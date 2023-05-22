<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
<?=$arResult["FORM_NOTE"]?>
<?if ($arResult["isFormNote"] != "Y"){?>
<?=$arResult["FORM_HEADER"]?>
<?if ($arResult["isFormDescription"] == "Y" || $arResult["isFormTitle"] == "Y" || $arResult["isFormImage"] == "Y"){?>

	<div class="contact-form__form-inputs">
		<?foreach ($arResult["QUESTIONS"] as $FIELD_SID => $arQuestion){
			$html_code = str_replace('class="', 'class="input__input"', $arQuestion["HTML_CODE"]);
			if ($arQuestion['STRUCTURE'][0]['FIELD_TYPE'] == 'hidden'):?>
				<?=$arQuestion["HTML_CODE"];?>
			<?else:
				if (is_array($arResult["FORM_ERRORS"]) && array_key_exists($FIELD_SID, $arResult['FORM_ERRORS'])):?>
					<span class="error-fld" title="<?=htmlspecialcharsbx($arResult["FORM_ERRORS"][$FIELD_SID])?>"></span><?endif;
				if ($arQuestion["CAPTION"] != "Сообщение"):?>
					<div class="input contact-form__input">
					<label class="input__label">
					<div class="input__label-text"><?=$arQuestion["CAPTION"]?><?=$arQuestion["REQUIRED"] == "Y" ? $arResult["REQUIRED_SIGN"] : ""?></div>
					<?=$html_code?>
					</label>
					</div>
				<?endif;
			endif;
		}?>
	</div>

	<?foreach ($arResult["QUESTIONS"] as $FIELD_SID => $arQuestion){
		if ($arQuestion['STRUCTURE'][0]['FIELD_TYPE'] == 'hidden'):?>
			<?=$arQuestion["HTML_CODE"];?>
		<?else:
			if (is_array($arResult["FORM_ERRORS"]) && array_key_exists($FIELD_SID, $arResult['FORM_ERRORS'])):?>
				<span class="error-fld" title="<?=htmlspecialcharsbx($arResult["FORM_ERRORS"][$FIELD_SID])?>"></span><?endif;
			if ($arQuestion["CAPTION"] == "Сообщение"):?>
				<div class="contact-form__form-message">
					<div class="input">
						<label class="input__label">
							<div class="input__label-text"><?=$arQuestion["CAPTION"]?><?=$arQuestion["REQUIRED"] == "Y" ? $arResult["REQUIRED_SIGN"] : ""?></div>
							<?=$html_code?>
							<div class="input__notification"></div>
						</label>
					</div>
				</div>
			<?endif;
			endif;
		} //endwhile?>

	<div class="contact-form__bottom">
		<div class="contact-form__bottom-policy">Нажимая &laquo;Отправить&raquo;, Вы&nbsp;подтверждаете, что
			ознакомлены, полностью согласны и&nbsp;принимаете условия &laquo;Согласия на&nbsp;обработку персональных
			данных&raquo;.</div>
		<input class="form-button contact-form__bottom-button" data-success="Отправлено"
			data-error="Ошибка отправки" <?=(intval($arResult["F_RIGHT"]) < 10 ? "disabled=\"disabled\"" : "");?>
			type="submit" name="web_form_submit" value="<?=htmlspecialcharsbx(trim($arResult["arForm"]["BUTTON"]) == '' ? GetMessage("FORM_ADD") : $arResult["arForm"]["BUTTON"]);?>">
		</input>
	</div>
<?} // endif?>

<?if($arResult["isUseCaptcha"] == "Y"){?>
		<tr>
			<th colspan="2"><b><?=GetMessage("FORM_CAPTCHA_TABLE_TITLE")?></b></th>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td><input type="hidden" name="captcha_sid" value="<?=htmlspecialcharsbx($arResult["CAPTCHACode"]);?>" /><img src="/bitrix/tools/captcha.php?captcha_sid=<?=htmlspecialcharsbx($arResult["CAPTCHACode"]);?>" width="180" height="40" /></td>
		</tr>
		<tr>
			<td><?=GetMessage("FORM_CAPTCHA_FIELD_TITLE")?><?=$arResult["REQUIRED_SIGN"];?></td>
			<td><input type="text" name="captcha_word" size="30" maxlength="50" value="" class="inputtext" /></td>
		</tr>
<?} // isUseCaptcha?>
<?if ($arResult["isFormErrors"] == "Y"):?><?=$arResult["FORM_ERRORS_TEXT"];?><?endif;?>
<?=$arResult["FORM_FOOTER"]?>
<?
} //endif (isFormNote)
