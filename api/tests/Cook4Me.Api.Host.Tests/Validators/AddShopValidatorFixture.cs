#region copyright
// Copyright 2017 Habart Thierry
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#endregion

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Hosting;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Cook4Me.Api.Host.Tests.Validators
{
    public class AddShopValidatorFixture
    {
        private Mock<ICategoryRepository> _categoryRepositoryStub;
        private Mock<IShopRepository> _shopRepositoryStub;
        private Mock<IMapRepository> _mapRepositoryStub;
        private IAddShopValidator _validator;

        [Fact]
        public void When_Pass_No_Parameters_Then_Exceptions_Are_Thrown()
        {
            // ARRANGE
            InitializeFakeObjects();

            // ACTS & ASSERTS
            Assert.ThrowsAsync<ArgumentNullException>(() => _validator.Validate(null, null));
            Assert.ThrowsAsync<ArgumentNullException>(() => _validator.Validate(new Shop(), null));
        }

        [Fact]
        public async Task When_Category_Doesnt_Exist_Then_Error_Is_Returned()
        {
            // ARRANGE
            InitializeFakeObjects();
            _categoryRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult((Category)null));

            // ACT
            var result = await _validator.Validate(new Shop(), "subject");

            // ASSERT
            Assert.False(result.IsValid);
            Assert.True(result.Message == ErrorDescriptions.TheCategoryDoesntExist);
        }

        [Fact]
        public async Task When_Map_Doesnt_Exist_Then_Error_Is_Returned()
        {
            // ARRANGE
            InitializeFakeObjects();
            _categoryRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult(new Category()));
            _mapRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult((Map)null));

            // ACT
            var result = await _validator.Validate(new Shop(), "subject");

            // ASSERT
            Assert.False(result.IsValid);
            Assert.True(result.Message == ErrorDescriptions.TheMapDoesntExist);
        }
        
        [Fact]
        public async Task When_Map_File_Doesnt_Exist_Then_Error_Is_Returned()
        {
            // ARRANGE
            InitializeFakeObjects();
            _categoryRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult(new Category()));
            _mapRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult(new Map
            {
                PartialMapUrl = "/map2.json"
            }));

            // ACT
            var result = await _validator.Validate(new Shop(), "subject");

            // ASSERT
            Assert.False(result.IsValid);
            Assert.True(result.Message == ErrorDescriptions.TheMapFileDoesntExist);

        }

        [Fact]
        public async Task When_Place_Doesnt_Exist_Then_Error_Is_Returned()
        {
            // ARRANGE
            InitializeFakeObjects();
            _categoryRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult(new Category()));
            _mapRepositoryStub.Setup(c => c.Get(It.IsAny<string>())).Returns(Task.FromResult(new Map
            {
                PartialMapUrl = "/map.json"
            }));

            // ACT
            var result = await _validator.Validate(new Shop
            {
                PlaceId = "invalid_place_id"
            }, "subject");

            // ASSERT
            Assert.False(result.IsValid);
            Assert.True(result.Message == ErrorDescriptions.ThePlaceDoesntExist);
        }

        private void InitializeFakeObjects()
        {
            _categoryRepositoryStub = new Mock<ICategoryRepository>();
            _shopRepositoryStub = new Mock<IShopRepository>();
            _mapRepositoryStub = new Mock<IMapRepository>();
            _validator = new AddShopValidator(_categoryRepositoryStub.Object, _shopRepositoryStub.Object, _mapRepositoryStub.Object);
        }
    }
}
