{"version":3,"file":"core.bundle.map.js","names":["this","BX","Messenger","v2","exports","im_v2_application_launch","pull_client","rest_client","main_core","ui_vue3","ui_vue3_vuex","im_v2_model","im_v2_const","im_v2_provider_pull","im_v2_lib_logger","im_v2_lib_utils","CoreApplication","constructor","params","inited","initPromise","Promise","resolve","initPromiseResolver","offline","vuexAdditionalModel","store","storeBuilder","pullHandlers","prepareParams","initStorage","then","initPullClient","initComplete","catch","error","Logger","_params$host","Type","isUndefined","localize","message","host","location","origin","userId","prepareUserId","siteId","getLocalize","isStringFilled","siteDir","languageId","initPull","initRest","initVuexBuilder","applicationVariables","common","getHost","getUserId","getSiteId","getLanguageId","dialog","messageLimit","enableReadMessages","device","type","Utils","isMobile","DeviceType","mobile","desktop","orientation","getOrientation","builder","Builder","init","addModel","ApplicationModel","create","useDatabase","setVariables","MessagesModel","DialoguesModel","FilesModel","UsersModel","RecentModel","forEach","model","setDatabaseConfig","name","vuexBuilder","databaseName","databaseType","build","result","pullClient","subscribe","pullBaseHandler","ImBasePullHandler","controller","pullInstance","SubscriptionType","Status","callback","eventStatusInteraction","bind","Online","eventOnlineInteraction","restInstance","RestClient","restClient","rest","instance","client","PullClient","PULL","pull","database","BuilderDatabaseType","indexedDb","isBoolean","isArray","models","addVuexModel","parsedUserId","Number","parseInt","data","status","PullStatus","Offline","includes","command","Object","values","users","userInfo","dispatch","id","fields","createVue","application","config","beforeCreateFunction","beforeCreate","unmountedFunction","unmounted","createdFunction","created","initConfig","$bitrix","Data","set","Application","Loc","setMessage","el","template","computed","components","initConfigCreatedFunction","bitrixVue","BitrixVue","createApp","errorHandler","err","vm","info","console","warnHandler","warn","trace","use","mount","getStore","push","isOnline","ready","setError","code","description","localizeDescription","endsWith","commit","active","clearError","addLocalize","phrases","isPlainObject","entries","key","value","phrase","toString","Core","Vue3","Vuex","Model","Const","Provider","Pull","Lib"],"sources":["core.bundle.js"],"mappings":"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"}