<?php
require_once($_SERVER['DOCUMENT_ROOT'] . "/bitrix/modules/main/include/prolog_before.php");
if (!$USER->IsAdmin()):
    LocalRedirect('/');
endif;

\Bitrix\Main\Loader::includeModule('iblock');
$IBLOCK_ID = 4;
$el = new CIBlockElement;
$row = 1;
$arProps = [];

$rsProp = CIBlockPropertyEnum::GetList(
    ["SORT" => "ASC", "VALUE" => "ASC"],
    ['IBLOCK_ID' => $IBLOCK_ID]
);

while ($arProp = $rsProp->Fetch()):
    $key = trim($arProp['VALUE']);
    $arProps[$arProp['PROPERTY_CODE']][$key] = $arProp['ID'];
endwhile;
$rsElements = CIBlockElement::GetList([], ['IBLOCK_ID' => $IBLOCK_ID], false, false, ['ID']);
while ($element = $rsElements->GetNext()):
    CIBlockElement::Delete($element['ID']);
endwhile;

if (($handle = fopen("vacancy.csv", "r")) !== false):
    while (($data = fgetcsv($handle, 1000, ",")) !== false):
        if ($row == 1):
            $row++;
            continue;
        endif;
        $row++;

        $PROP['ACTIVITY'] = $data[9];
        $PROP['FIELD'] = $data[11];
        $PROP['OFFICE'] = $data[1];
        $PROP['EMAIL'] = $data[12];
        $PROP['LOCATION'] = $data[2];
        $PROP['TYPE'] = $data[8];
        $PROP['SALARY_TYPE'] = '';
        $PROP['SALARY_VALUE'] = $data[7];
        $PROP['REQUIRE'] = $data[4];
        $PROP['DUTY'] = $data[5];
        $PROP['CONDITIONS'] = $data[6];
        $PROP['SCHEDULE'] = $data[10];
        $PROP['DATE'] = date('d.m.Y');

        foreach ($PROP as $key => &$value):
            $value = trim($value);
            $value = str_replace('\n', '', $value);

            if (stripos($value, '•') !== false):
                $value = explode('•', $value);
                array_splice($value, 0, 1);
                foreach ($value as &$str):
                    $str = trim($str);
                endforeach;
            elseif ($arProps[$key]):
                $arSimilar = [];
                foreach ($arProps[$key] as $propKey => $propVal):

                    if ($key == 'OFFICE'):
                        $value = strtolower($value);
                        if ($value == 'центральный офис'):
                            $value .= 'свеза ' . $data[2];
                        elseif ($value == 'лесозаготовка'):
                            $value = 'свеза ресурс ' . $value;
                        elseif ($value == 'свеза тюмень'):
                            $value = 'свеза тюмени';
                        endif;
                        $arSimilar[similar_text($value, $propKey)] = $propVal;
                    endif;

                    if (stripos($propKey, $value) !== false):
                        $value = $propVal;
                        break;
                    endif;

                    if (similar_text($propKey, $value) > 50):
                        $value = $propVal;
                    endif;

                endforeach;

                if ($key == 'OFFICE' && !is_numeric($value)):
                    ksort($arSimilar);
                    $value = array_pop($arSimilar);
                endif;
            endif;
        endforeach;

        if ($PROP['TYPE'] == 'РСС'):
            $PROP['TYPE'] = $arProps['TYPE']['Продажи'];
        else:
            $PROP['TYPE'] = $arProps['TYPE']['Рабочие'];
        endif;

        if ($PROP['SCHEDULE'] == 'Полный день'):
            $PROP['SCHEDULE'] = $arProps['SCHEDULE']['Полный день'];
        else:
            $PROP['SCHEDULE'] = $arProps['SCHEDULE']['Сменнный график'];
        endif;

        if ($PROP['SALARY_VALUE'] == '-' || $PROP['SALARY_VALUE'] == 'по договоренности' || $PROP['SALARY_VALUE'] == ''):
            $PROP['SALARY_VALUE'] = '';
            $PROP['SALARY_TYPE'] = $arProps['SALARY_TYPE']['Договорная'];
        else:
            $arSalary = explode(' ', $PROP['SALARY_VALUE']);
            if ($arSalary[0] == 'ОТ' || $arSalary[0] == 'ДО'):
                $PROP['SALARY_TYPE'] = $arProps['SALARY_TYPE'][$arSalary[0]];
                array_splice($arSalary, 0, 1);
                $PROP['SALARY_VALUE'] = implode(' ', $arSalary);
            else:
                $PROP['SALARY_TYPE'] = $arProps['SALARY_TYPE']['='];
            endif;
        endif;

        $arLoadProductArray = [
            "MODIFIED_BY" => $USER->GetID(),
            "IBLOCK_SECTION_ID" => false,
            "IBLOCK_ID" => $IBLOCK_ID,
            "PROPERTY_VALUES" => $PROP,
            "NAME" => $data[3],
            "ACTIVE" => end($data) ? 'Y' : 'N',
        ];

        if ($PRODUCT_ID = $el->Add($arLoadProductArray):
            echo "Добавлен элемент с ID : " . $PRODUCT_ID . "<br>";
        else:
            echo "Error: " . $el->LAST_ERROR . '<br>';
        endif;
        echo "<hr>";
    endwhile;
    fclose($handle);
endif;
