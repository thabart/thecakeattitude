import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Badge } from 'reactstrap';

class DiscountTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {t} = this.props;
        var self = this;
        var discountElts = [];
        var product = self.props.product;
        var discounts = product['discounts'];
        if (discounts && discounts.length > 0) {
            discounts.sort(function(fd, sd) {
                if (fd.money_saved < sd.money_saved) {
                    return 1;
                }

                if (fd.money_saved > sd.money_saved) {
                    return -1;
                }

                return 0;
            });
            discounts.forEach(function(discount) {
                discountElts.push((<tr>
                    <td>
                        <h5>
                            <Badge color="success">
                                <strike style={{color: "white"}}>€ {product.price}</strike>
                                <i style={{color: "white"}} className="ml-1">- {discount.type === 'percentage' ? (<span>%</span>) : (<span>€</span>)} {discount.value}</i>
                            </Badge>
                        </h5>
                    </td>
                    <td><h5>€ {(product.price - discount.money_saved)}</h5></td>
                    <td>{discount.code}</td>
                </tr>));
            });
        }
        return (
            <div>
                {discountElts.length  === 0 ? (<span>{t('noDiscount')}</span>) : (                    
                    <table className="table table-striped">
                        <thead>
                            <th></th>
                            <th>{t('newPrice')}</th>
                            <th>{t('code')}</th>
                        </thead>
                        <tbody>
                            {discountElts}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release })(DiscountTab);
