{*
* 2007-2015 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
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
* @author    PrestaShop SA <contact@prestashop.com>
* @copyright 2007-2015 PrestaShop SA
* @license   http://opensource.org/licenses/afl-3.0.php Academic Free License (AFL 3.0)
* International Registered Trademark & Property of PrestaShop SA
*}
{extends file="helpers/options/options.tpl"}

{block name="input"}
	{if $field['type'] == 'theme'}
		{if $field['can_display_themes']}
			<div class="col-lg-12">
				<div class="row">

					{foreach $field.themes as $theme}
						<div class="col-sm-4 col-lg-3">
							<div class="theme-container">
								<h4 class="theme-title">{$theme->name}</h4>
								<div class="thumbnail-wrapper">
									<div class="action-wrapper">
										<div class="action-overlay"></div>
										<div class="action-buttons">
											<div class="btn-group">
												<a href="{$link->getAdminLink('AdminThemes')|escape:'html':'UTF-8'}&amp;action=enableTheme&amp;theme_name={$theme->name|urlencode}" class="btn btn-default">
													<i class="icon-check"></i> {l s='Use this theme'}
												</a>

												<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
													<i class="icon-caret-down"></i>&nbsp;
												</button>
												<ul class="dropdown-menu">
													<li>
														<a href="{$link->getAdminLink('AdminThemes')|escape:'html':'UTF-8'}&amp;action=deleteTheme&amp;theme_name={$theme->name|urlencode}" title="Delete this theme" class="delete">
															<i class="icon-trash"></i> {l s='Delete this theme'}
														</a>
													</li>
												</ul>

											</div>
										</div>
									</div>
									<img class="center-block img-thumbnail" src="../themes/{$theme->name}/preview.png" alt="{$theme->name}" />
								</div>
							</div>
						</div>
					{/foreach}

				</div>
			</div>
		{/if}
	{else}
		{$smarty.block.parent}
	{/if}
{/block}


{block name="footer"}

	{if isset($categoryData['after_tabs'])}
		{assign var=cur_theme value=$categoryData['after_tabs']['cur_theme']}
		<div class="row row-padding-top">

			<div class="col-md-3">
				<a href="{$base_url}" class="_blank">
					<img class="center-block img-thumbnail" src="../themes/{$cur_theme->name}/preview.png" alt="{$cur_theme->name}" />
				</a>
			</div>

			<div id="js_theme_form_container" class="col-md-9">
				<h2>{$cur_theme->name} {if isset($cur_theme->version)}<small>version {$cur_theme->version}</small>{/if}</h2>
				{if isset($cur_theme->author.name)}
				<p>
					{l s='Designed by %s' sprintf=$cur_theme->author.name}
				</p>
				{/if}

				<hr />
				<h4>{l s='Configure your page layouts'}</h4>
				<div class="row">
					<div class="col-sm-8">
						<p>{l s='Each page can use a different layouts, choose it among the layout bundled in your theme.'}</p>
					</div>
					<div class="col-sm-4">
						<a class="btn btn-default pull-right" href="{$link->getAdminLink('AdminThemes')}&action=configureLayouts">
							<i class="icon icon-file"></i>
							{l s='Choose layouts'}
						</a>
					</div>
				</div>
			</div>
		</div>

	{/if}

	{$smarty.block.parent}

{/block}


{block name="after"}
	<div class="panel clearfix" id="prestastore-content"></div>
	<script type="text/javascript">
		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: 'ajax-tab.php?rand=' + new Date().getTime(),
			async: true,
			cache: false,
			dataType : "html",
			data: {
				tab: 'AdminThemes',
				token: '{$token|escape:'html':'UTF-8'}',
				ajax: '1',
				action:'getAddonsThemes',
				page:'themes'
			},
			success: function(htmlData) {
				$("#prestastore-content").html("<h3><i class='icon-picture-o'></i> {l s='Live from PrestaShop Addons!'}</h3>"+htmlData);
			}
		});

		// These variable will move the form to another location
		var formToMove = "appearance";
		var formDestination = "js_theme_form_container";
	</script>
{/block}
