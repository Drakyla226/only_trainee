this.BX = this.BX || {};
this.BX.Sale = this.BX.Sale || {};
this.BX.Sale.PaymentPay = this.BX.Sale.PaymentPay || {};
(function (exports,sale_paymentPay_lib,sale_paymentPay_mixins_application,sale_paymentPay_backendProvider,sale_paymentPay_mixins_paymentSystem,ui_vue,sale_paymentPay_const,main_core_events) {
	'use strict';

	ui_vue.BitrixVue.component('sale-payment_pay-components-application-pay_system', {
	  props: {
	    options: Object
	  },
	  mixins: [sale_paymentPay_mixins_application.MixinMethods],
	  data: function data() {
	    var settings = new sale_paymentPay_lib.Settings(this.options);
	    return {
	      stageType: sale_paymentPay_const.StageType,
	      stages: this.prepareParamsStages(),
	      stage: this.setStageType(),
	      loading: false,
	      paymentProcess: this.prepareParamsPaymentProcess(settings)
	    };
	  },
	  created: function created() {
	    this.initPayment();
	    this.subscribeToGlobalEvents();
	  },
	  methods: {
	    initBackendProvider: function initBackendProvider() {
	      this.backendProvider = new sale_paymentPay_backendProvider.BackendProvider({
	        returnUrl: this.paymentProcess.returnUrl,
	        orderId: this.paymentProcess.orderId,
	        accessCode: this.paymentProcess.accessCode
	      });
	    },
	    prepareParamsStages: function prepareParamsStages() {
	      var settings = new sale_paymentPay_lib.Settings(this.options);
	      return {
	        paySystemList: {
	          paySystems: settings.get('app.paySystems', []),
	          selectedPaySystem: null
	          // title: settings.get('app.title'),
	        },

	        paySystemErrors: {
	          errors: []
	        },
	        paySystemResult: {
	          html: null,
	          fields: null
	        }
	      };
	    },
	    setStageType: function setStageType() {
	      return sale_paymentPay_const.StageType.list;
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"salescenter-payment-pay-app\">\n\t\t\t<template v-if=\"stage === stageType.list\">\n\t\t\t\t<sale-payment_pay-components-payment_system-pay_system_list\n\t\t\t\t\t:paySystems=\"stages.paySystemList.paySystems\"\n\t\t\t\t\t:selectedPaySystem=\"stages.paySystemList.selectedPaySystem\"\n\t\t\t\t\t:loading=\"loading\"\n\t\t\t\t\t@start-payment=\"startPayment($event)\"/>\n\t\t\t</template>\n\t\t\t<template v-else>\n\t\t\t\t<!--region popup/backdrop -->\n\t\t\t\t<sale-payment_pay-components-payment_system-backdrop :paySystem=\"currentPS(stages.paySystemList.selectedPaySystem, stages.paySystemList.paySystems)\">\n\t\t\t\t\t<template v-slot:main-content>\n\t\t\t\t\t\t<template v-if=\"stage === stageType.errors\">\n\t\t\t\t\t\t\t<sale-payment_pay-components-payment_system-error_box :errors=\"stages.paySystemErrors.errors\"/>\n\t\t\t\t\t\t</template>\n\n\t\t\t\t\t\t<template v-else-if=\"stage === stageType.result\">\n\t\t\t\t\t\t\t<sale-payment_pay-components-payment_system-pay_system_result\n\t\t\t\t\t\t\t\t:html=\"stages.paySystemResult.html\"\n\t\t\t\t\t\t\t\t:fields=\"stages.paySystemResult.fields\">\n\t\t\t\t\t\t\t\t\t<template v-slot:default><sale-payment_pay-components-payment_system-reset_panel @reset=\"resetView()\"/></template>\n\t\t\t\t\t\t\t</sale-payment_pay-components-payment_system-pay_system_result>\n\t\t\t\t\t\t</template>\n\t\t\t\t\t</template>\n\t\t\t\t</sale-payment_pay-components-payment_system-backdrop>\n\t\t\t\t<!--endregion-->\n\t\t\t</template>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-application-payment', {
	  props: {
	    options: Object
	  },
	  mixins: [sale_paymentPay_mixins_application.MixinMethods],
	  data: function data() {
	    var settings = new sale_paymentPay_lib.Settings(this.options);
	    return {
	      stageType: sale_paymentPay_const.StageType,
	      stages: this.prepareParamsStages(),
	      stage: this.setStageType(),
	      loading: false,
	      paymentProcess: this.prepareParamsPaymentProcess(settings)
	    };
	  },
	  created: function created() {
	    this.initPayment();
	    this.subscribeToGlobalEvents();
	  },
	  methods: {
	    initBackendProvider: function initBackendProvider() {
	      this.backendProvider = new sale_paymentPay_backendProvider.BackendProvider({
	        returnUrl: this.paymentProcess.returnUrl,
	        orderId: this.paymentProcess.orderId,
	        accessCode: this.paymentProcess.accessCode
	      });
	    },
	    prepareParamsStages: function prepareParamsStages() {
	      var settings = new sale_paymentPay_lib.Settings(this.options);
	      return {
	        paymentInfo: {
	          paySystem: settings.get('app.paySystems', [])[0],
	          title: settings.get('app.title'),
	          sum: settings.get('payment.sumFormatted'),
	          paid: settings.get('payment.paid'),
	          checks: settings.get('payment.checks', [])
	        },
	        paySystemList: {
	          selectedPaySystem: null
	        },
	        paySystemErrors: {
	          errors: []
	        },
	        paySystemResult: {
	          html: null,
	          fields: null
	        }
	      };
	    },
	    setStageType: function setStageType() {
	      return sale_paymentPay_const.StageType.paymentInfo;
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"salescenter-payment-pay-app\">\n\t\t\t<sale-payment_pay-components-payment_system-payment_info\n                v-if=\"stage === stageType.paymentInfo\"\n\t\t\t\t:paySystem=\"stages.paymentInfo.paySystem\"\n                :title=\"stages.paymentInfo.title\"\n\t\t\t\t:sum=\"stages.paymentInfo.sum\"\n\t\t\t\t:paid=\"stages.paymentInfo.paid\"\n\t\t\t\t:loading=\"loading\"\n\t\t\t\t:checks=\"stages.paymentInfo.checks\"\n                @start-payment=\"startPayment($event)\">\n\t\t\t</sale-payment_pay-components-payment_system-payment_info>\n            <sale-payment_pay-components-payment_system-error_box\n                v-if=\"stage === stageType.errors\"\n                :errors=\"stages.paySystemErrors.errors\">\n            \t<sale-payment_pay-components-payment_system-reset_panel @reset=\"resetView()\"/>\n            </sale-payment_pay-components-payment_system-error_box>\n            <sale-payment_pay-components-payment_system-pay_system_result\n                v-if=\"stage === stageType.result\"\n                :html=\"stages.paySystemResult.html\"\n                :fields=\"stages.paySystemResult.fields\">\n            \t<sale-payment_pay-components-payment_system-reset_panel @reset=\"resetView()\"/>\n            </sale-payment_pay-components-payment_system-pay_system_result>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-payment_info-button', {
	  props: {
	    loading: {
	      type: Boolean,
	      "default": false,
	      required: false
	    }
	  },
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinPaymentInfoButton],
	  // language=Vue
	  template: "\n\t\t<button :class=\"classes\" @click=\"onClick($event)\">\n\t\t\t<slot></slot>\n\t\t</button>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-payment_info-pay_system_small_card', {
	  props: {
	    logo: String,
	    name: String
	  },
	  template: "\n\t\t<div class=\"order-payment-operator\">\n\t\t\t<img :src=\"logo\" :alt=\"name\" v-if=\"logo\">\n\t\t\t<div class=\"order-payment-pay-system-name\" v-else>{{ name }}</div>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-button', {
	  props: {
	    loading: {
	      type: Boolean,
	      "default": false,
	      required: false
	    }
	  },
	  computed: {
	    classes: function classes() {
	      return {
	        'order-payment-method-item-button': true,
	        'btn': true,
	        'btn-primary': true,
	        'rounded-pill': true,
	        'pay-mode': true,
	        'order-payment-loader': this.loading
	      };
	    },
	    buttonClasses: function buttonClasses() {
	      return {
	        'loading-button-text': this.loading
	      };
	    }
	  },
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinButton],
	  // language=Vue
	  template: "\n\t\t<div :class=\"classes\" @click=\"onClick($event)\">\n\t\t\t<span :class=\"buttonClasses\"><slot></slot></span>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-check', {
	  props: {
	    status: {
	      type: String,
	      "default": '',
	      required: false
	    },
	    link: {
	      type: String,
	      "default": '',
	      required: false
	    },
	    title: {
	      type: String,
	      required: true
	    }
	  },
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinCheck],
	  // language=Vue
	  template: "\n\t\t<div class=\"mb-2\" :class=\"{'check-print': processing}\">\n\t\t\t<a :href=\"link\" target=\"_blank\" class=\"check-link\" v-if=\"downloadable\">{{ title }}</a>\n\t\t\t<span v-else>{{ title }}</span>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-error_box', {
	  props: {
	    errors: Array
	  },
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div>\n\t\t\t<div class=\"alert alert-danger\">\n\t\t\t\t<slot name=\"errors-header\">\n\t\t\t\t\t<div>{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_8 }}</div>\n\t\t\t\t</slot>\n\t\t\t\t<slot name=\"errors-footer\">\n\t\t\t\t\t<div>{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_9 }}</div>\n\t\t\t\t</slot>\n\t\t\t</div>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-pay_system_row', {
	  props: {
	    loading: Boolean,
	    name: String,
	    logo: String,
	    id: Number
	  },
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    }
	  },
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinPaySystemRow],
	  // language=Vue
	  template: "\n\t\t<div class=\"order-pay-method-item-container pay-mode\" @click=\"onClick()\">\n\t\t\t<div class=\"order-pay-method-item-logo-block\">\n\t\t\t\t<div class=\"order-pay-method-logo\" :style=\"logoStyle\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"order-pay-method-text-block\">\n\t\t\t\t<div class=\"order-pay-method-text\">{{ name }}</div>\n\t\t\t</div>\n\t\t\t<sale-payment_pay-components-payment_system-button :loading=\"loading\">{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_4 }}</sale-payment_pay-components-payment_system-button>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-pay_system_list', {
	  props: {
	    paySystems: {
	      type: Array,
	      "default": [],
	      required: false
	    },
	    selectedPaySystem: {
	      type: Number,
	      "default": null,
	      required: false
	    },
	    loading: {
	      type: Boolean,
	      "default": false,
	      required: false
	    }
	  },
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinPaySystemList],
	  // language=Vue
	  template: "\n\t\t<div>\n<!--\t\t\t<div class=\"page-section-title\" v-if=\"title\">{{ title }}</div>-->\n\t\t\t<div class=\"order-payment-method-list\">\n\t\t\t\t<slot>\n\t\t\t\t\t<sale-payment_pay-components-payment_system-pay_system_row\n\t\t\t\t\t\tv-for=\"paySystem in paySystems\"\n\t\t\t\t\t\t:loading=\"isItemLoading(paySystem.ID)\"\n\t\t\t\t\t\t:name=\"paySystem.NAME\"\n\t\t\t\t\t\t:logo=\"paySystem.LOGOTIP\"\n\t\t\t\t\t\t:id=\"paySystem.ID\"\n\t\t\t\t\t\t@click=\"startPayment($event)\"\n\t\t\t\t\t\t:key=\"paySystem.ID\"\n\t\t\t\t\t/>\n\t\t\t\t</slot>\n\t\t\t</div>\n<!--            <slot name=\"user-consent\"></slot>-->\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-pay_system_result', {
	  props: {
	    html: {
	      type: String,
	      "default": null,
	      required: false
	    },
	    fields: {
	      type: Object,
	      "default": null,
	      required: false
	    }
	  },
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    }
	  },
	  mounted: function mounted() {
	    if (this.html) {
	      BX.html(this.$refs.paySystemResultTemplate, this.html);
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"payment-mobile-change-method\">\n\t\t\t<template v-if=\"html\">\n\t\t\t\t<div ref=\"paySystemResultTemplate\"></div>\n\t\t\t</template>\n\t\t\t<template v-else>\n\t\t\t\t<div class=\"checkout-basket-section\">\n\t\t\t\t\t<div class=\"page-section-title\">{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_1 }}</div>\n\t\t\t\t\t<div class=\"checkout-basket-personal-order-info\" v-if=\"fields\">\n\t\t\t\t\t\t<div class=\"checkout-basket-personal-order-info-item\" v-if=\"fields.SUM_WITH_CURRENCY\">\n\t\t\t\t\t\t\t<span>{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_2 }}</span>\n\t\t\t\t\t\t\t<strong v-html=\"fields.SUM_WITH_CURRENCY\"></strong>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"checkout-basket-personal-order-info-item\" v-if=\"fields.PAY_SYSTEM_NAME\">\n\t\t\t\t\t\t\t<span>{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_3 }}</span>\n\t\t\t\t\t\t\t<strong>{{ fields.PAY_SYSTEM_NAME }}</strong>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</template>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-payment_info', {
	  props: {
	    paySystem: Object,
	    title: String,
	    sum: String,
	    loading: Boolean,
	    paid: Boolean,
	    checks: Array
	  },
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    },
	    totalSum: function totalSum() {
	      return this.localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_10.replace('#SUM#', this.sum);
	    }
	  },
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinPaymentInfo],
	  // language=Vue
	  template: "\n\t\t<div>\n\t\t\t<div class=\"order-payment-container\">\n\t\t\t\t<div class=\"order-payment-title\" v-if=\"title\">{{ title }}</div>\n\t\t\t\t<div class=\"order-payment-inner d-flex align-items-center justify-content-between\">\n\t\t\t\t\t<sale-payment_pay-components-payment_system-payment_info-pay_system_small_card :name=\"paySystem.NAME\" :logo=\"paySystem.LOGOTIP\"/>\n\t\t\t\t\t<div class=\"order-payment-status d-flex align-items-center\" v-if=\"paid\">\n\t\t\t\t\t\t<div class=\"order-payment-status-ok\"></div>\n\t\t\t\t\t\t<div>{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_5 }}</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"order-payment-price\" v-html=\"totalSum\"></div>\n\t\t\t\t</div>\n\t\t\t\t<hr v-if=\"checks.length > 0\">\n\t\t\t\t<sale-payment_pay-components-payment_system-check\n\t\t\t\t\tv-for=\"check in checks\" :key=\"check.id\"\n\t\t\t\t\t:title=\"getCheckTitle(check)\"\n\t\t\t\t\t:link=\"check.link\"\n\t\t\t\t\t:status=\"check.status\"/>\n\t\t\t\t<div class=\"order-payment-buttons-container\" v-if=\"!paid\">\n\t\t\t\t\t<sale-payment_pay-components-payment_system-payment_info-button\n\t\t\t\t\t\t:loading=\"loading\"\n\t\t\t\t\t\t@click=\"onClick()\">\n\t\t\t\t\t\t{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_4 }}\n\t\t\t\t\t</sale-payment_pay-components-payment_system-payment_info-button>\n\t\t\t\t</div>\t\n\t\t\t</div>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-reset_panel', {
	  mixins: [sale_paymentPay_mixins_paymentSystem.MixinResetPanel],
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    }
	  },
	  // language=Vue
	  template: "\n\t\t<div class=\"order-payment-buttons-container\">\n\t\t\t<div class=\"order-basket-section-description py-3\">\n\t\t\t\t{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_6 }}\n\t\t\t</div>\n\t\t\t<div class=\"order-basket-section-another-payment-button\">\n\t\t\t\t<sale-payment_pay-components-payment_system-button @click=\"reset()\">\n\t\t\t\t\t{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_7 }}\n\t\t\t\t</sale-payment_pay-components-payment_system-button>\n\t\t\t</div>\n\t\t</div>\t\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-backdrop', {
	  props: ['paySystem'],
	  data: function data() {
	    return {
	      isShow: true
	    };
	  },
	  // language=Vue
	  methods: {
	    close: function close() {
	      this.isShow = false;
	      main_core_events.EventEmitter.emit(sale_paymentPay_const.EventType.payment.reset, {});
	    }
	  },
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    },
	    getObjectClass: function getObjectClass() {
	      var result = ['checkout-basket-item'];
	      if (this.isShow === true) {
	        result.push('active-backdrop-open-change-sku active-popup-open');
	      }
	      return result;
	    },
	    title: function title() {
	      return BX.util.htmlspecialchars(this.paySystem.NAME);
	    },
	    logoStyle: function logoStyle() {
	      var defaultLogo = '/bitrix/js/sale/payment-pay/images/default_logo.png';
	      var src = this.paySystem.LOGOTIP || defaultLogo;
	      return "background-image: url(\"".concat(BX.util.htmlspecialchars(src), "\")");
	    }
	  },
	  template: "\n\t\t<div :class=getObjectClass>\n\t\t\t<div class=\"checkout-basket-item-backdrop-wrapper js-backdrop-open-change-sku\">\n\t\t\t\t<div class=\"checkout-basket-item-backdrop-overlay js-backdrop-open-change-sku\"></div>\n\t\t\t\t<div class=\"checkout-basket-item-backdrop-container js-backdrop-open-change-sku\">\n\t\t\t\t\t<div class=\"checkout-basket-item-detail-header justify-content-between align-items-center\">\n\t\t\t\t\t\t<div id=\"bx_3966226736_424_7e1b8e3524755c391129a9d7e6f2d206_prebuy_swipe_btn\"\n\t\t\t\t\t\t\t class=\"checkout-basket-item-detail-swipe-btn-container\">\n\t\t\t\t\t\t\t<div class=\"checkout-basket-item-detail-swipe-btn\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"checkout-order-payment-close\" @click=\"close()\">{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_12 }}</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"checkout-basket-item-backdrop-inner\">\n\t\t\t\t\t\t<div class=\"checkout-basket-item-backdrop-main\">\n\t\t\t\t\t\t\t<div class=\"checkout-order-payment-title\">\n\t\t\t\t\t\t\t\t<div class=\"checkout-basket-pay-method-item-logo-block\">\n\t\t\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\t\t\t:style=logoStyle\n\t\t\t\t\t\t\t\t\t\tclass=\"checkout-basket-pay-method-logo\"/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"checkout-order-payment-title-text\">{{title}}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<slot name=\"main-content\"></slot>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t"
	});

	ui_vue.BitrixVue.component('sale-payment_pay-components-payment_system-popup', {
	  props: ['paySystem'],
	  data: function data() {
	    return {
	      isShow: true
	    };
	  },
	  // language=Vue
	  methods: {
	    close: function close() {
	      this.isShow = false;
	      main_core_events.EventEmitter.emit(sale_paymentPay_const.EventType.payment.reset, {});
	    }
	  },
	  computed: {
	    localize: function localize() {
	      return Object.freeze(ui_vue.BitrixVue.getFilteredPhrases('PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_'));
	    },
	    getObjectClass: function getObjectClass() {
	      var result = ['checkout-order-payment-popup-wrap'];
	      if (this.isShow === true) {
	        result.push('active-popup-open');
	      }
	      return result;
	    },
	    logoStyle: function logoStyle() {
	      var src = this.paySystem.LOGOTIP;
	      return "background-image: url(\"".concat(BX.util.htmlspecialchars(src), "\")");
	    }
	  },
	  template: "\n\t<div :class=getObjectClass>\n\t\t\t<div class=\"checkout-order-payment-popup-overlay\" @click=\"close()\"/>\n\t\t\t<div class=\"checkout-order-payment-popup\">\n\t\t\t\t<div class=\"checkout-order-payment-popup-head\">\n\t\t\t\t\t<div class=\"checkout-order-payment-close\" @click=\"close()\">{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_12 }}</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"checkout-order-payment-popup-main\">\n\t\t\t\t\t<div class=\"checkout-order-payment-title\">\n\t\t\t\t\t\t<div class=\"checkout-basket-pay-method-item-logo-block\">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\t:style=logoStyle\n\t\t\t\t\t\t\t\tclass=\"checkout-basket-pay-method-logo\"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"checkout-order-payment-content\">\n\t\t\t\t\t\t<slot name=\"main-content\"></slot>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"checkout-order-payment-btn-container\">\n\t\t\t\t\t\t<button class=\"btn btn-primary rounded-pill\" @click=\"close()\">{{ localize.PAYMENT_PAY_PAYMENT_SYSTEM_COMPONENTS_13 }}</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t</div>"
	});

}((this.BX.Sale.PaymentPay.Components = this.BX.Sale.PaymentPay.Components || {}),BX.Sale.PaymentPay.Lib,BX.Sale.PaymentPay.Mixins.Application,BX.Sale.PaymentPay.BackendProvider,BX.Sale.PaymentPay.Mixins.PaymentSystem,BX,BX.Sale.PaymentPay.Const,BX.Event));
//# sourceMappingURL=registry.bundle.js.map
