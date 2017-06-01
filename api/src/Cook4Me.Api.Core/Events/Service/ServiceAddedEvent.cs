using Cook4Me.Api.Core.Bus;
using System;

namespace Cook4Me.Api.Core.Events.Service
{
    public class ServiceAddedEvent : Event
    {
        public string Id { get; set; }
        public string ShopId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public double NewPrice { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
    }
}
