<?php

/*
* 2007-2015 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2015 PrestaShop SA
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

class ProductUnitPriceCalculatorCore
{
    public function __construct($productId, $productAttributeId, $id_lang)
    {
        $this->product = new Product($productId, false, $id_lang);

        $combinations = $this->product->getAttributesGroups($id_lang);
        foreach ($combinations as $combination) {
            if ($combination['id_product_attribute'] == $productAttributeId) {
                $this->combination = $combination;
                break;
            }
        }
    }

    public function getUnitPrice()
    {
        if ((float) $this->combination['unit_price_impact'] !== 0.0) {
            $unit_price = ($this->product->price / $this->product->unit_price_ratio) + $this->combination['unit_price_impact'];
        } else {
            $unit_price = ($this->product->price + $this->combination['price']) / $this->product->unit_price_ratio;
        }

        return $unit_price;
    }
}
