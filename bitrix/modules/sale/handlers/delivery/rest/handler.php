<?php

namespace Sale\Handlers\Delivery;

use Bitrix\Main,
	Bitrix\Main\Loader,
	Bitrix\Main\Localization\Loc,
	Bitrix\Sale\Delivery\Services\Base,
	Bitrix\Sale\Delivery\Services\Manager;

Loader::registerAutoLoadClasses(
	'sale',
	[
		__NAMESPACE__.'\RestProfile' => 'handlers/delivery/rest/profile.php',
	]
);

Loc::loadMessages(__FILE__);

/**
 * Class RestHandler
 * @package Sale\Handlers\Delivery
 */
final class RestHandler extends Base
{
	private const HANDLER_CODE_PREFIX = 'BITRIX_REST_';

	protected static $canHasProfiles = true;
	protected static $whetherAdminExtraServicesShow = true;

	/**
	 * Returns class name
	 * @return string
	 */
	public static function getClassTitle(): string
	{
		return Loc::getMessage('SALE_DELIVERY_REST_HANDLER_NAME');
	}

	/**
	 * @return string Class, service description.
	 */
	public static function getClassDescription(): string
	{
		return Loc::getMessage('SALE_DELIVERY_REST_HANDLER_DESCRIPTION');
	}

	/**
	 * @param array $initParams Initial data params from table record.
	 * @throws Main\ArgumentTypeException
	 * @throws Main\SystemException
	 */
	public function __construct(array $initParams)
	{
		parent::__construct($initParams);

		if (isset($initParams['REST_CODE']) && $initParams['REST_CODE'] !== '')
		{
			$this->handlerCode = $initParams['REST_CODE'];
		}
		elseif (isset($this->config['MAIN']['REST_CODE']))
		{
			$this->handlerCode = $this->config['MAIN']['REST_CODE'];
		}

		if ((int)$this->id <= 0)
		{
			$settings = $this->getHandlerSettings();
			if ($settings !== null)
			{
				$this->name = $settings['NAME'];
				$this->description = $settings['DESCRIPTION'];
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public function getHandlerCode(): string
	{
		return self::HANDLER_CODE_PREFIX . (string)$this->handlerCode;
	}

	private function getHandlerSettings(): ?array
	{
		$handlerList = \Bitrix\Sale\Delivery\Services\Manager::getRestHandlerList();
		$code = str_replace(self::HANDLER_CODE_PREFIX, '', $this->getHandlerCode());

		return $handlerList[$code] ?? null;
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	protected function getConfigStructure(): array
	{
		$settings = $this->getHandlerSettings();

		if (!empty($settings['SETTINGS']['CONFIG']))
		{
			$result['MAIN'] = $settings['SETTINGS']['CONFIG'];
		}
		else
		{
			$result['MAIN'] = [
				'TITLE' => Loc::getMessage('SALE_DELIVERY_REST_HANDLER_SETTING_TITLE'),
				'DESCRIPTION' => Loc::getMessage('SALE_DELIVERY_REST_HANDLER_SETTING_DESCRIPTION'),
			];
		}

		$result['MAIN']['ITEMS']['REST_CODE'] = [
			'TYPE' => 'STRING',
			'NAME' => Loc::getMessage('SALE_DELIVERY_REST_HANDLER_SETTING_REST_CODE'),
			'READONLY' => true,
			'DEFAULT' => $settings['CODE'] ?? '',
		];

		return $result;
	}

	/**
	 * @param int $serviceId
	 * @param array $fields
	 * @return bool
	 * @throws Main\ArgumentTypeException
	 * @throws Main\SystemException
	 */
	public static function onAfterAdd($serviceId, array $fields = array()): bool
	{
		if ($serviceId <= 0)
		{
			return false;
		}

		$result = true;

		// Add profiles
		$fields['ID'] = $serviceId;
		$srv = new self($fields);
		$profiles = $srv->getProfilesListFull();
		if (is_array($profiles) && !empty($profiles))
		{
			foreach($profiles as $profileType => $profileFields)
			{
				$profile = $srv->getProfileDefaultParams($profileType, $profileFields);
				$res = Manager::add($profile);
				$result = $result && $res->isSuccess();
			}
		}

		return $result;
	}

	/**
	 * @return array All profile fields.
	 */
	public function getProfilesListFull(): array
	{
		$settings = $this->getHandlerSettings();

		return $settings['PROFILES'] ?? [];
	}

	/**
	 * @param string $type
	 * @param array $fields
	 * @return array
	 */
	private function getProfileDefaultParams($type, array $fields): array
	{
		$active = $fields['ACTIVE'] ?? ($this->active ? 'Y' : 'N');
		$sort = $fields['SORT'] ?? $this->sort;

		return [
			'CODE' => '',
			'PARENT_ID' => $this->id,
			'NAME' => $fields['NAME'],
			'ACTIVE' => $active,
			'SORT' => $sort,
			'DESCRIPTION' => $fields['DESCRIPTION'],
			'CLASS_NAME' => '\Sale\Handlers\Delivery\RestProfile',
			'CURRENCY' => $this->currency,
			'CONFIG' => [
				'MAIN' => [
					'PROFILE_TYPE' => $type,
				]
			]
		];
	}

	/**
	 * @return bool
	 */
	public static function whetherAdminExtraServicesShow(): bool
	{
		return self::$whetherAdminExtraServicesShow;
	}

	/**
	 * @return array
	 */
	public static function getChildrenClassNames(): array
	{
		return [
			'\Sale\Handlers\Delivery\RestProfile'
		];
	}

	/**
	 * @return array profiles ids and names
	 */
	public function getProfilesList(): array
	{
		$result = [];

		$profiles = $this->getProfilesListFull();
		foreach($profiles as $profileType => $profile)
		{
			$result[$profileType] = $profile['NAME'];
		}

		return $result;
	}

	/**
	 * @return bool
	 */
	public static function canHasProfiles(): bool
	{
		return self::$canHasProfiles;
	}
}
