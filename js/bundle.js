var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URI_1 = require("./URI");
var AppConfig = /** @class */ (function (_super) {
    __extends(AppConfig, _super);
    function AppConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppConfig.getInitLoadingUrls = function () {
        if (AppConfig.platform == "wx") {
            return [
                "res/atlas/map.atlas",
                "res/data.json",
                // URI.spineUrl + "other_taozhuangxitong1.sk",
                URI_1.default.spineUrl + "other_taozhuangxitong1.png",
                // URI.spineUrl + "other_wupinghuanrao_kin_little.sk",
                URI_1.default.spineUrl + "other_wupinghuanrao_kin_little.png",
                "res/atlas/test.atlas",
                "sound/bg_music.wav",
                "sound/hecheng.wav",
                "sound/teji.wav",
                "sound/xiahua.wav",
                "sound/xiaochu.wav",
                "sound/yidong.wav"
            ];
        }
        else {
            return [
                "res/data.json",
                URI_1.default.spineUrl + "other_taozhuangxitong1.sk",
                URI_1.default.spineUrl + "other_wupinghuanrao_kin_little.sk",
                "sound/bg_music.wav",
                "sound/hecheng.wav",
                "sound/teji.wav",
                "sound/xiahua.wav",
                "sound/xiaochu.wav",
                "sound/yidong.wav"
            ];
        }
    };
    //是否已经新手引导过
    AppConfig.hadGuidance = function () {
        var bo = localStorage.getItem("guide");
        if (bo == "true") {
            return true;
        }
        return false;
    };
    AppConfig.setGuidance = function (value) {
        if (value) {
            localStorage.setItem("guide", "true");
        }
        else {
            localStorage.setItem("guide", "false");
        }
    };
    AppConfig.pools = {};
    // public static platform = "test"; //laya测试
    AppConfig.platform = "wx"; //微信测试
    // public static platform = "android"; //android native
    // public static platform = "android4399"; //android native4399
    // public static platform = "ios"; //ios native
    AppConfig.version = "1.8";
    return AppConfig;
}(Laya.Script));
exports.default = AppConfig;

},{"./URI":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* 源代码拓展
*/
var CodeExpand = /** @class */ (function () {
    function CodeExpand() {
    }
    CodeExpand.init = function () {
        // Laya.Sprite拓展
        var spriteProto = Laya.Sprite.prototype;
        // 添加点击缩放的监听
        spriteProto["zoomOn"] = function (handler, scale) {
            if (scale === void 0) { scale = 1.1; }
            var self = this;
            if (!self["initSX"]) {
                self["initSX"] = self.scaleX;
                self["initSY"] = self.scaleY;
            }
            if (scale > 0 && scale != 1) {
                var centerX = self.getCenterX();
                var centerY = self.getCenterY();
                self.pivotX = self.width / 2;
                self.pivotY = self.height / 2;
                self.pos(centerX, centerY);
            }
            if (self.hasListener("press")) {
                self.off(Laya.Event.MOUSE_DOWN, self, self["mouseDown"]);
                self.off(Laya.Event.MOUSE_UP, self, self["mouseUp"]);
                self.off(Laya.Event.MOUSE_MOVE, self, self["mouseMove"]);
                self.off(Laya.Event.MOUSE_OUT, self, self["mouseOut"]);
                self.off(Laya.Event.MOUSE_OVER, self, self["mouseOver"]);
                self.off("press", self, self["press"]);
            }
            self["mouseDown"] = function (event) {
                if (self["isDown"])
                    return;
                self.scale(self["initSX"] * scale, self["initSY"] * scale);
                self["isDown"] = true;
                handler && handler.runWith(event);
                setTimeout(function () {
                    if (self["isDown"]) {
                        self.event("press");
                    }
                }, 200);
                // if (game.AppConfig.soundEffect)
                // {
                // 	Laya.SoundManager.playSound(game.URI.audioUrl + "UI/button.wav", 1);
                // }
            };
            self["mouseUp"] = function (event) {
                if (!self["isDown"])
                    return;
                self.scale(self["initSX"], self["initSY"]);
                handler && handler.runWith(event);
                self["isDown"] = false;
            };
            self["mouseMove"] = function (event) {
                if (self["isDown"]) {
                    handler && handler.runWith(event);
                }
            };
            self["mouseOver"] = function (event) {
                handler && handler.runWith(event);
            };
            self["mouseOut"] = function (event) {
                if (self["isDown"]) {
                    self.scale(self["initSX"], self["initSY"]);
                    handler && handler.runWith(event);
                }
                self["isDown"] = false;
            };
            self["press"] = function (event) {
                var event = new Laya.Event();
                event.type = "press";
                event.currentTarget = self;
                handler && handler.runWith(event);
            };
            self.on("press", this, self["press"]);
            self.on(Laya.Event.MOUSE_DOWN, this, self["mouseDown"]);
            self.on(Laya.Event.MOUSE_UP, this, self["mouseUp"]);
            self.on(Laya.Event.MOUSE_MOVE, this, self["mouseMove"]);
            self.on(Laya.Event.MOUSE_OVER, this, self["mouseOver"]);
            self.on(Laya.Event.MOUSE_OUT, this, self["mouseOut"]);
            // if (self["top"])
            // {
            // 	self.y = self["top"] + self.pivotY;
            // 	self["top"] = NaN;
            // }
            // if (self["bottom"])
            // {
            // 	self.y = (self.parent as Laya.Sprite).height - self["bottom"] - self.height + self.pivotY;
            // 	self["bottom"] = NaN;
            // }
            // if (self["left"])
            // {
            // 	self.x = self["left"] + self.pivotX;
            // 	self["left"] = NaN;
            // }
            // if (self["right"])
            // {
            // 	self.x = (self.parent as Laya.Sprite).width - self["right"] - self.width + self.pivotX;
            // 	self["right"] = NaN;
            // }
        };
        spriteProto["getLeft"] = function () {
            var self = this;
            if (self["anchorX"]) {
                self.pivotX = self.width * self["anchorX"];
            }
            return self.x - self.pivotX * self.scaleX;
        };
        spriteProto["getRight"] = function () {
            var self = this;
            return self.getLeft() + self.width * self.scaleX;
        };
        spriteProto["getTop"] = function () {
            var self = this;
            if (self["anchorY"]) {
                self.pivotY = self.height * self["anchorY"];
            }
            return self.y - self.pivotY * self.scaleY;
        };
        spriteProto["getBottom"] = function () {
            var self = this;
            return self.getTop() + self.height * self.scaleY;
        };
        spriteProto["getCenterX"] = function () {
            var self = this;
            return self.getLeft() + self.width / 2 * self.scaleX;
        };
        spriteProto["getCenterY"] = function () {
            var self = this;
            return self.getTop() + self.height / 2 * self.scaleY;
        };
        spriteProto["clone"] = function () {
            if (!this["uiData"])
                return null;
            var self = this;
            var clone = Laya.SceneUtils.createComp(self["uiData"]);
            // if (self["uiData"])
            // {
            // 	for (var key in self["uiData"]["props"]) {
            // 		if (self["uiData"]["props"].hasOwnProperty(key)) {
            // 			var element = self[key];
            // 			clone["key"] = element;
            // 		}
            // 	}
            // 	self.children([]).forEach(child => {
            // 		var index = self.getChildIndex(child)
            // 		clone.removeChildAt(index);
            // 		clone.addChildAt((child as Laya.Sprite).clone(), index);
            // 	});
            // }
            clone.visible = self.visible;
            return clone;
        };
        // String拓展
        var stringProto = String.prototype;
        // 字符串格式化(只做了简单的%d,%s匹配，未做参数个数和类型判断，之后优化完善)
        String["format"] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var str = args[0];
            args = args.slice(1, args.length);
            var match = function (mString, mArgs) {
                var index = 0;
                var result = mString.match(new RegExp("%[d,s]+"));
                if (!result) {
                    return mString;
                }
                else {
                    mString = mString.replace(result[0], mArgs[0]);
                    mArgs = mArgs.slice(1, mArgs.length);
                    return match(mString, mArgs);
                }
            };
            return match(str, args);
        };
        String["isEmojiCharacter"] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var substring = args[0];
            for (var i = 0; i < substring.length; i++) {
                var hs = substring.charCodeAt(i);
                if (0xd800 <= hs && hs <= 0xdbff) {
                    if (substring.length > 1) {
                        var ls = substring.charCodeAt(i + 1);
                        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                        if (0x1d000 <= uc && uc <= 0x1f77f) {
                            return true;
                        }
                    }
                }
                else if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    if (ls == 0x20e3) {
                        return true;
                    }
                }
                else {
                    if (0x2100 <= hs && hs <= 0x27ff) {
                        return true;
                    }
                    else if (0x2B05 <= hs && hs <= 0x2b07) {
                        return true;
                    }
                    else if (0x2934 <= hs && hs <= 0x2935) {
                        return true;
                    }
                    else if (0x3297 <= hs && hs <= 0x3299) {
                        return true;
                    }
                    else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                        || hs == 0x2b50) {
                        return true;
                    }
                }
            }
        };
        // Array拓展
        var arrayProto = Array.prototype;
        // array字段排序 1：arr.sortOn([["key1", "up"], ["key2", "down"]]) 2：arr.sortOn("up")
        // 复合排序 fieldList包含多个列表，每个列表包含2个值，第一个表示要排序的key,第二个表示要排序的类型（升降序
        // 值排序 只传一个字符串表示对值列表进行排序
        arrayProto["sortOn"] = function (fieldList) {
            var index = 0;
            var compare = function (a, b) {
                var result = 0;
                var key = fieldList[index][0];
                var sortType = fieldList[index][1] || "up";
                var valueA = a[key];
                var valueB = b[key];
                if (typeof (valueA) == "boolean") {
                    valueA = valueA ? 1 : 0;
                    valueB = valueB ? 1 : 0;
                }
                if (valueA > valueB) {
                    result = sortType == "up" ? 1 : -1;
                }
                else if (valueA < valueB) {
                    result = sortType == "up" ? -1 : 1;
                }
                else {
                    index++;
                    if (fieldList[index]) {
                        return compare(a, b);
                    }
                    else {
                        result = 1;
                    }
                }
                index = 0;
                return result;
            };
            if (typeof (fieldList) == "string") {
                this.sort(function (a, b) {
                    var result = 0;
                    if (a > b) {
                        result = fieldList == "up" ? 1 : -1;
                    }
                    else if (a < b) {
                        result = fieldList == "up" ? -1 : 1;
                    }
                    return result;
                });
            }
            else {
                this.sort(compare);
            }
        };
        arrayProto["getIndex"] = function (value) {
            var i = -1;
            for (i = 0; i < this.length; i++) {
                if (this[i] == value) {
                    return i;
                }
            }
            return i;
        };
        if (!Int32Array["prototype"]["fill"]) {
            Int32Array["prototype"]["fill"] = function (value) {
                var i = 0;
                while (typeof this[i] != "undefined") {
                    this[i] = value;
                    i++;
                }
                return this;
            };
        }
        if (!Number["isFinite"]) {
            Number["isFinite"] = function (value) {
                return (typeof value == "number") && (value != NaN);
            };
        }
    };
    return CodeExpand;
}());
exports.default = CodeExpand;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var LoadingScene_1 = require("./script/scene/LoadingScene");
var MainGameScene_1 = require("./script/scene/MainGameScene");
var FontGrid_1 = require("./script/prefeb/FontGrid");
var GameUI_1 = require("./script/GameUI");
var GameControl_1 = require("./script/GameControl");
var Bullet_1 = require("./script/Bullet");
var DropBox_1 = require("./script/DropBox");
var GameResult_1 = require("./script/prefeb/GameResult");
var GameSetting_1 = require("./script/prefeb/GameSetting");
var StartGame_1 = require("./script/prefeb/StartGame");
var TipItem_1 = require("./script/prefeb/TipItem");
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
        reg("script/scene/LoadingScene.ts", LoadingScene_1.default);
        reg("script/scene/MainGameScene.ts", MainGameScene_1.default);
        reg("script/prefeb/FontGrid.ts", FontGrid_1.default);
        reg("script/GameUI.ts", GameUI_1.default);
        reg("script/GameControl.ts", GameControl_1.default);
        reg("script/Bullet.ts", Bullet_1.default);
        reg("script/DropBox.ts", DropBox_1.default);
        reg("script/prefeb/GameResult.ts", GameResult_1.default);
        reg("script/prefeb/GameSetting.ts", GameSetting_1.default);
        reg("script/prefeb/StartGame.ts", StartGame_1.default);
        reg("script/prefeb/TipItem.ts", TipItem_1.default);
    };
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "loading/Loading.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();

},{"./script/Bullet":7,"./script/DropBox":8,"./script/GameControl":9,"./script/GameUI":10,"./script/prefeb/FontGrid":19,"./script/prefeb/GameResult":20,"./script/prefeb/GameSetting":21,"./script/prefeb/StartGame":23,"./script/prefeb/TipItem":24,"./script/scene/LoadingScene":25,"./script/scene/MainGameScene":26}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var AppConfig_1 = require("./AppConfig");
var MapFontInfo_1 = require("./script/model/MapFontInfo");
var CodeExpand_1 = require("./CodeExpand");
var TipController_1 = require("./script/controller/TipController");
var ControllerMgr_1 = require("./script/controller/ControllerMgr");
var SceneMgr_1 = require("./script/scene/SceneMgr");
var LoadingScene_1 = require("./script/scene/LoadingScene");
var SoundTool_1 = require("./script/tool/SoundTool");
var Main = /** @class */ (function () {
    function Main() {
        //根据IDE设置初始化引擎		
        // let str = "";
        // let arr = str.split(",");
        // let coutArr = [];
        // let cout = "";
        // arr.forEach(element => {
        // 	let elementStr = element.trim();
        // 	if(elementStr == "")
        // 	{
        // 		return;
        // 	}
        // 	if(coutArr.indexOf(elementStr) != -1)
        // 	{
        // 		return;
        // 	}
        // 	if(cout != "")
        // 	{
        // 		cout += ","
        // 	}
        // 	coutArr.push(elementStr);
        // 	cout += "\"" +elementStr + "\"";
        // })
        Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, "webgl");
        // Laya.init(640, 1136);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        // if(AppConfig.platform == "wx")
        // {
        // 	// Laya.URL.basePath = "https://raw.githubusercontent.com/wupei1987/font-game-wx-asset/master/";
        // 	wx.setEnableDebug({
        // 		enableDebug: true,
        // 		success: (result: _setEnableDebugSuccessObject) => void{},
        // 		fail: () => void{},
        // 		complete: () => void{},
        // 	  })
        // }
        if (AppConfig_1.default.platform == "wx") {
            Laya.stage.scaleMode = "fixwidth";
            Laya.URL.basePath = "https://raw.githubusercontent.com/wupei1987/font-game-wx-asset/master/";
            Laya.MiniAdpter.nativefiles = [
                "btn_startGame.png"
            ];
        }
        else {
            Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        }
        // Laya.stage.scaleMode = GameConfig.scaleMode;
        Laya.stage.alignV = GameConfig_1.default.alignV;
        Laya.stage.alignH = GameConfig_1.default.alignH;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        Laya.stage.frameRate = "slow";
        // Laya.enableDebugPanel();
        // Laya.Browser.window.showAlertOnJsException(false);
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        CodeExpand_1.default.init();
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    };
    Main.prototype.onConfigLoaded = function () {
        Laya.Scene.open(GameConfig_1.default.startScene, true, null, Laya.Handler.create(this, this.onLoadingLoad));
    };
    /**
     * 更新进度条
     * @param percent 百分比 0-100
     */
    Main.prototype.updateLoadingProgress = function (percent) {
        percent = Math.floor(percent);
        if (SceneMgr_1.default.curSceneScript != null && SceneMgr_1.default.curSceneScript instanceof LoadingScene_1.default) {
            SceneMgr_1.default.curSceneScript.updatePercent(percent);
        }
    };
    Main.prototype.onLoadingLoad = function () {
        if (Laya.Browser.window.loadingView) {
            Laya.Browser.window.loadingView.hideLoadingView();
        }
        this.updateLoadingProgress(0);
        Laya.loader.load(AppConfig_1.default.getInitLoadingUrls(), Laya.Handler.create(this, this.loadStartScene), Laya.Handler.create(this, function (progress) {
            this.updateLoadingProgress(progress * 90);
        }));
    };
    Main.prototype.loadStartScene = function () {
        var data = Laya.loader.getRes("res/data.json");
        MapFontInfo_1.default.DataSource = data;
        Laya.Scene.open("main/MainGame.scene", true, null, Laya.Handler.create(this, this.onGameStart), Laya.Handler.create(this, this.onGameLoadProgress, [], false));
        if (Laya.Browser.onMiniGame) {
            Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/test.atlas");
        }
    };
    Main.prototype.onGameLoadProgress = function (value) {
        if (Laya.Browser.window.loadingView) {
            Laya.Browser.window.loadingView.loading(value * 100);
        }
        this.updateLoadingProgress(90 + value * 10);
    };
    Main.prototype.onGameStart = function () {
        ControllerMgr_1.default.getInstance(TipController_1.default).init();
        SoundTool_1.default.init();
        SoundTool_1.default.playBgMusic();
    };
    return Main;
}());
//激活启动类
new Main();

},{"./AppConfig":1,"./CodeExpand":2,"./GameConfig":3,"./script/controller/ControllerMgr":12,"./script/controller/TipController":14,"./script/model/MapFontInfo":15,"./script/scene/LoadingScene":25,"./script/scene/SceneMgr":28,"./script/tool/SoundTool":30}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResMgr = /** @class */ (function () {
    function ResMgr() {
        this.spineList = {};
        this.textureList = {};
        this.animationList = {};
        this.modelDelayList = {};
        this.idx = 0;
    }
    ResMgr.Instance = function () {
        if (ResMgr.instance == null) {
            ResMgr.instance = new ResMgr();
        }
        return ResMgr.instance;
    };
    ResMgr.prototype.releaseSpine = function (url) {
        if (this.spineList[url]) {
            var spine = this.spineList[url];
            // spine.releaseResource(true);
            for (var i = 0; i < spine["_loadList"].length; i++) {
                var texture = spine.getTexture(spine["_loadList"][i]);
                if (texture) {
                    texture.disposeBitmap();
                    texture.destroy();
                }
            }
            spine.destroy();
            Laya.loader.clearRes(url);
            this.spineList[url] = null;
        }
    };
    ResMgr.prototype.loadSpine = function (url, callbk) {
        var self = this;
        var num = 0;
        var loadFunc = function (spine) {
            var complete = function () {
                self.spineList[spine] = factory;
                if ((url instanceof Array)) {
                    num++;
                    if (num == url.length) {
                        callbk.run();
                    }
                }
                else {
                    callbk.run();
                }
            };
            var factory = new Laya.Templet();
            factory.on(Laya.Event.COMPLETE, self, complete);
            // factory.on(Event.ERROR, this, this.onError);
            factory.loadAni(spine);
        };
        if ((url instanceof Array)) {
            for (var i = 0; i < url.length; i++) {
                loadFunc(url[i]);
            }
        }
        else {
            loadFunc(url);
        }
    };
    ResMgr.prototype.loadTexture = function (url, callbk) {
        var self = this;
        if ((url instanceof Array)) {
            for (var i = 0; i < url.length; i++) {
                if (i == (url.length - 1)) {
                    Laya.Texture2D.load(url[i], callbk);
                }
                else {
                    Laya.Texture2D.load(url[i], null);
                }
            }
        }
        else {
            Laya.Texture2D.load(url, callbk);
        }
        // if (callbk != null) {
        //     callbk.run();
        // }
    };
    ResMgr.prototype.loadPNG = function (url, callbk) {
        if (Laya.loader.getRes(url) != null) {
            // if(Laya.loader.getRes(url).released == true)
            // {
            //     let texture : Laya.Texture = Laya.loader.getRes(url);
            //     texture.bitmap.on(Laya.Event.RECOVERED,this,function() : void{
            //          callbk.run();
            //     });
            //     texture.active();
            //     // texture.load(url);
            //     // callbk.run();
            // }
            // else 
            // {
            callbk.run();
            // }
            return;
        }
        Laya.loader.load(url, callbk, null, "image");
    };
    ResMgr.prototype.getPNG = function (url) {
        return Laya.loader.getRes(url);
    };
    /**
     * 根据图片地址创建sprite
     * @param url 图片地址
     * @param sprite 默认为空 如果不为空 直接在此sprite上绘制
     */
    ResMgr.prototype.createSprite = function (url, sprite) {
        var sp = sprite || new Laya.Sprite();
        var tex;
        if (Laya.loader.getRes(url) == null) {
            this.loadPNG(url, Laya.Handler.create(this, function () {
                tex = this.getPNG(url);
                sp.graphics.drawTexture(tex);
                if (tex) {
                    sp.size(tex.sourceWidth, tex.sourceHeight);
                }
            }));
        }
        else {
            tex = this.getPNG(url);
            sp.graphics.drawTexture(tex);
            if (tex) {
                sp.size(tex.sourceWidth, tex.sourceHeight);
            }
        }
        return sp;
    };
    ResMgr.prototype.createImg = function (url, img) {
        if (!img) {
            img = new Laya.Image();
        }
        this.loadPNG(url, Laya.Handler.create(this, function () {
            img.skin = url;
        }));
        return img;
    };
    ResMgr.prototype.loadModel = function (url, callbk) {
        if (Laya.loader.getRes(url) && Laya.loader.getRes(url)["_children"] && Laya.loader.getRes(url).getChildAt(0)) {
            callbk.run();
            return;
        }
        Laya.loader.create(url, callbk);
    };
    ResMgr.prototype.load = function (url, callbk) {
        if (Laya.loader.getRes(url) != null) {
            callbk.run();
            return;
        }
        Laya.loader.load(url, callbk);
    };
    ResMgr.prototype.loadJson = function (url, callbk) {
        if (Laya.loader.getRes(url) != null) {
            callbk.run();
            return;
        }
        Laya.loader.load(url, callbk, null, Laya.Loader.JSON);
    };
    ResMgr.prototype.loadAtlas = function (url, callbk) {
        if (Laya.loader.getRes(url) != null) {
            callbk.run();
            return;
        }
        Laya.loader.load(url, callbk, null, Laya.Loader.ATLAS);
    };
    ResMgr.prototype.loadAnimation = function (aniUrl, atlasUrl, callbk) {
        if (atlasUrl != "" && atlasUrl != null) {
            if (Laya.loader.getRes(aniUrl) != null && Laya.loader.getRes(atlasUrl) != null) {
                callbk.run();
                return;
            }
        }
        else {
            if (Laya.loader.getRes(aniUrl) != null) {
                callbk.run();
                return;
            }
        }
        Laya.loader.load(aniUrl, Laya.Handler.create(this, function () {
            if (atlasUrl != null && atlasUrl != "") {
                Laya.loader.load(atlasUrl, Laya.Handler.create(this, function () {
                    this.animationList[aniUrl] = atlasUrl;
                    callbk.run();
                }), null, Laya.Loader.ATLAS);
            }
            else {
                callbk.run();
            }
        }, null, false), null, Laya.Loader.JSON);
    };
    ResMgr.prototype.getSpine = function (url) {
        return this.spineList[url];
    };
    ResMgr.prototype.createSpine = function (url, animation, loop, callbk) {
        if (loop === void 0) { loop = true; }
        if (callbk === void 0) { callbk = null; }
        var sk;
        if (this.spineList[url]) {
            sk = this.spineList[url].buildArmature(0);
            if (animation != null) {
                sk.play(animation, loop);
            }
            if (callbk != null) {
                callbk.runWith(sk);
            }
        }
        else {
            sk = new Laya.Skeleton();
            this.loadSpine(url, Laya.Handler.create(this, function () {
                sk.init(this.spineList[url], 0);
                if (animation != null) {
                    sk.play(animation, loop);
                }
                if (callbk != null) {
                    callbk.runWith(sk);
                }
            }));
        }
        return sk;
    };
    ResMgr.prototype.createAnimation = function (url, animation) {
        var ani = new Laya.Animation();
        ani.source = url;
        if (animation) {
            ani.play(null, true, animation);
        }
        return ani;
    };
    ResMgr.prototype.getTexture = function (url, callbk) {
        var res = Laya.loader.getRes(url);
        if (res) {
            callbk.runWith(res);
        }
        else {
            this.loadTexture(url, callbk);
        }
    };
    ResMgr.prototype.tryGetTexture = function (url) {
        var res = Laya.loader.getRes(url);
        if (res) {
            return res;
        }
        else {
            return null;
        }
    };
    ResMgr.prototype.loadList = function (urls, caller, onProgress, onComplete) {
        if (urls.length == 0) {
            onComplete.call(caller);
            return;
        }
        var item = {
            id: this.idx,
            urls: urls,
            caller: caller,
            index: 0,
            onProgress: onProgress,
            onComplete: onComplete
        };
        this.idx++;
        this.startLoad(item);
    };
    ResMgr.prototype.startLoad = function (item) {
        if (item.urls.length <= item.index) {
            if (item.onComplete != null) {
                item.onComplete.call(item.caller);
            }
            return;
        }
        var url = item.urls[item.index];
        item.index++;
        if (item.onProgress != null) {
            item.onProgress.call(item.caller, item.index, item.urls.length);
        }
        this.loadOnce(url, this.startLoad, item);
    };
    ResMgr.prototype.loadOnce = function (url, callBack, item) {
        if (url instanceof Object) {
            url = url.url;
        }
        var type = url.substr(url.indexOf('.') + 1).toLowerCase();
        var f = Laya.Handler.create(this, function (par_callBk, par_this, par_item, par_url) {
            par_callBk.call(par_this, par_item);
        }, [callBack, this, item, url]);
        switch (type) {
            case "png":
                if (url.indexOf("texture/") == -1) {
                    this.loadPNG(url, f);
                }
                else {
                    this.loadTexture(url, f);
                }
                break;
            case "sk":
                this.loadSpine(url, f);
                break;
            case "lh":
                this.loadModel(url, f);
                break;
            case "json":
            case "lang":
                this.loadJson(url, f);
                break;
            case "atlas":
                this.loadAtlas(url, f);
                break;
            case "ani":
                this.loadAnimation(url, null, f);
                break;
            default:
                this.load(url, f);
                break;
        }
    };
    ResMgr.instance = null;
    return ResMgr;
}());
exports.ResMgr = ResMgr;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URI = /** @class */ (function (_super) {
    __extends(URI, _super);
    function URI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    URI.prefabUrl = "prefab/";
    URI.spineUrl = "res/spine/";
    URI.soundUrl = "sound/";
    return URI;
}(Laya.Script));
exports.default = URI;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
 */
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        return _super.call(this) || this;
    }
    Bullet.prototype.onEnable = function () {
        //设置初始速度
        var rig = this.owner.getComponent(Laya.RigidBody);
        rig.setVelocity({ x: 0, y: -10 });
    };
    Bullet.prototype.onTriggerEnter = function (other, self, contact) {
        //如果被碰到，则移除子弹
        this.owner.removeSelf();
    };
    Bullet.prototype.onUpdate = function () {
        //如果子弹超出屏幕，则移除子弹
        if (this.owner.y < -10) {
            this.owner.removeSelf();
        }
    };
    Bullet.prototype.onDisable = function () {
        //子弹被移除时，回收子弹到对象池，方便下次复用，减少对象创建开销
        Laya.Pool.recover("bullet", this.owner);
    };
    return Bullet;
}(Laya.Script));
exports.default = Bullet;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameUI_1 = require("./GameUI");
/**
 * 掉落盒子脚本，实现盒子碰撞及回收流程
 */
var DropBox = /** @class */ (function (_super) {
    __extends(DropBox, _super);
    function DropBox() {
        var _this = _super.call(this) || this;
        /**盒子等级 */
        _this.level = 1;
        return _this;
    }
    DropBox.prototype.onEnable = function () {
        /**获得组件引用，避免每次获取组件带来不必要的查询开销 */
        this._rig = this.owner.getComponent(Laya.RigidBody);
        this.level = Math.round(Math.random() * 5) + 1;
        this._text = this.owner.getChildByName("levelTxt");
        this._text.text = this.level + "";
    };
    DropBox.prototype.onUpdate = function () {
        //让持续盒子旋转
        this.owner.rotation++;
    };
    DropBox.prototype.onTriggerEnter = function (other, self, contact) {
        var owner = this.owner;
        if (other.label === "buttle") {
            //碰撞到子弹后，增加积分，播放声音特效
            if (this.level > 1) {
                this.level--;
                this._text.changeText(this.level + "");
                owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                Laya.SoundManager.playSound("sound/hit.wav");
            }
            else {
                if (owner.parent) {
                    var effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                    effect.pos(owner.x, owner.y);
                    owner.parent.addChild(effect);
                    effect.play(0, true);
                    owner.removeSelf();
                    Laya.SoundManager.playSound("sound/destroy.wav");
                }
            }
            GameUI_1.default.instance.addScore(1);
        }
        else if (other.label === "ground") {
            //只要有一个盒子碰到地板，则停止游戏
            owner.removeSelf();
            GameUI_1.default.instance.stopGame();
        }
    };
    /**使用对象池创建爆炸动画 */
    DropBox.prototype.createEffect = function () {
        var ani = new Laya.Animation();
        ani.loadAnimation("test/TestAni.ani");
        ani.on(Laya.Event.COMPLETE, null, recover);
        function recover() {
            ani.removeSelf();
            Laya.Pool.recover("effect", ani);
        }
        return ani;
    };
    DropBox.prototype.onDisable = function () {
        //盒子被移除时，回收盒子到对象池，方便下次复用，减少对象创建开销。
        Laya.Pool.recover("dropBox", this.owner);
    };
    return DropBox;
}(Laya.Script));
exports.default = DropBox;

},{"./GameUI":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
var GameControl = /** @class */ (function (_super) {
    __extends(GameControl, _super);
    function GameControl() {
        var _this = _super.call(this) || this;
        /** @prop {name:createBoxInterval,tips:"间隔多少毫秒创建一个下跌的容器",type:int,default:1000}*/
        _this.createBoxInterval = 1000;
        /**开始时间*/
        _this._time = 0;
        /**是否已经开始游戏 */
        _this._started = false;
        return _this;
    }
    GameControl.prototype.onEnable = function () {
        this._time = Date.now();
        this._gameBox = this.owner.getChildByName("gameBox");
    };
    GameControl.prototype.onUpdate = function () {
        //每间隔一段时间创建一个盒子
        var now = Date.now();
        if (now - this._time > this.createBoxInterval && this._started) {
            this._time = now;
            this.createBox();
        }
    };
    GameControl.prototype.createBox = function () {
        //使用对象池创建盒子
        var box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
        box.pos(Math.random() * (Laya.stage.width - 100), -100);
        this._gameBox.addChild(box);
    };
    GameControl.prototype.onStageClick = function (e) {
        //停止事件冒泡，提高性能，当然也可以不要
        e.stopPropagation();
        //舞台被点击后，使用对象池创建子弹
        var flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
        flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this._gameBox.addChild(flyer);
    };
    /**开始游戏，通过激活本脚本方式开始游戏*/
    GameControl.prototype.startGame = function () {
        if (!this._started) {
            this._started = true;
            this.enabled = true;
        }
    };
    /**结束游戏，通过非激活本脚本停止游戏 */
    GameControl.prototype.stopGame = function () {
        this._started = false;
        this.enabled = false;
        this.createBoxInterval = 1000;
        this._gameBox.removeChildren();
    };
    return GameControl;
}(Laya.Script));
exports.default = GameControl;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./../ui/layaMaxUI");
var GameControl_1 = require("./GameControl");
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
var GameUI = /** @class */ (function (_super) {
    __extends(GameUI, _super);
    function GameUI() {
        var _this = _super.call(this) || this;
        GameUI.instance = _this;
        //关闭多点触控，否则就无敌了
        Laya.MouseManager.multiTouchEnabled = false;
        return _this;
    }
    GameUI.prototype.onEnable = function () {
        this._control = this.getComponent(GameControl_1.default);
        //点击提示文字，开始游戏
        this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
    };
    GameUI.prototype.onTipClick = function (e) {
        this.tipLbll.visible = false;
        this._score = 0;
        this.scoreLbl.text = "";
        this._control.startGame();
    };
    /**增加分数 */
    GameUI.prototype.addScore = function (value) {
        if (value === void 0) { value = 1; }
        this._score += value;
        this.scoreLbl.changeText("分数：" + this._score);
        //随着分数越高，难度增大
        if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
            this._control.createBoxInterval -= 20;
    };
    /**停止游戏 */
    GameUI.prototype.stopGame = function () {
        this.tipLbll.visible = true;
        this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
        this._control.stopGame();
    };
    return GameUI;
}(layaMaxUI_1.ui.test.TestSceneUI));
exports.default = GameUI;

},{"./../ui/layaMaxUI":32,"./GameControl":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerBase = /** @class */ (function (_super) {
    __extends(ControllerBase, _super);
    function ControllerBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ControllerBase.prototype.getSign = function () {
        return this["__proto__"].constructor.name;
    };
    // public static getInstance<T>(c : new() => T) : T
    // {
    //     let sign = c["name"];
    //     let item = ControllerBase._controllerObjs[sign];
    //     if(item == null)
    //     {
    //         item = new c();
    //         ControllerBase._controllerObjs[sign] = item;
    //     }
    //     return item;
    // }
    ControllerBase.prototype.show = function () {
    };
    ControllerBase.prototype.close = function () {
    };
    ControllerBase.prototype.destroy = function () {
    };
    ControllerBase._controllerObjs = {};
    return ControllerBase;
}(Laya.Script));
exports.default = ControllerBase;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerMgr = /** @class */ (function () {
    function ControllerMgr() {
    }
    ControllerMgr.getInstance = function (c) {
        var sign = c["name"];
        var item = ControllerMgr._controllerObjs[sign];
        if (item == null) {
            item = new c();
            ControllerMgr._controllerObjs[sign] = item;
        }
        return item;
    };
    ControllerMgr._controllerObjs = {};
    return ControllerMgr;
}());
exports.default = ControllerMgr;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerBase_1 = require("./ControllerBase");
var PlayerInfo_1 = require("../model/PlayerInfo");
var PlayerController = /** @class */ (function (_super) {
    __extends(PlayerController, _super);
    function PlayerController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.myPlayerInfo = new PlayerInfo_1.default();
        return _this;
    }
    return PlayerController;
}(ControllerBase_1.default));
exports.default = PlayerController;

},{"../model/PlayerInfo":18,"./ControllerBase":11}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerBase_1 = require("./ControllerBase");
var GameConfig_1 = require("../../GameConfig");
var TipItem_1 = require("../prefeb/TipItem");
var TipController = /** @class */ (function (_super) {
    __extends(TipController, _super);
    function TipController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._labels = [];
        _this._startY = 960;
        _this._tipItems = [];
        _this._tipItemStartY = 550;
        return _this;
    }
    Object.defineProperty(TipController.prototype, "tipSpr", {
        get: function () {
            return this._tipSpr;
        },
        enumerable: true,
        configurable: true
    });
    TipController.prototype.init = function () {
        this._tipSpr = new Laya.Sprite();
        this._tipSpr.name = "TipSpr";
        Laya.stage.addChild(this._tipSpr);
        Laya.loader.load("prefab/TipItem.json", Laya.Handler.create(this, this.onLoadTipItemComplete));
    };
    TipController.prototype.onLoadTipItemComplete = function () {
        this._tipItemPrefab = new Laya.Prefab();
        this._tipItemPrefab.json = Laya.loader.getRes("prefab/TipItem.json");
    };
    TipController.prototype.showLeftBottomTip = function (text) {
        var label = new Laya.Label();
        label.color = "#204800";
        label.text = text;
        label.font = "SimHei";
        label.fontSize = 30;
        label.anchorY = 1;
        label.y = this._startY;
        this._tipSpr.addChild(label);
        this._labels.push(label);
        this.sortLabels();
        Laya.timer.once(1000, this, function () {
            Laya.Tween.to(label, { alpha: 0 }, 300);
        });
        Laya.timer.once(1300, this, function () {
            this._labels.splice(this._labels.indexOf(label), 1);
            Laya.timer.clearAll(label);
            label.destroy(true);
        });
    };
    TipController.prototype.sortLabels = function () {
        for (var i = void 0; i < this._labels.length; i++) {
            var label = this._labels[i];
            var targetY = this._startY - 40 * i;
            Laya.Tween.to(label, { y: targetY }, 100);
        }
    };
    TipController.prototype.showTip = function (txt) {
        if (this._tipItemPrefab != null) {
            var tipItemSpr_1 = Laya.Pool.getItemByCreateFun("TipItem", this._tipItemPrefab.create, this._tipItemPrefab);
            var tipItemScript = tipItemSpr_1.getComponent(TipItem_1.default);
            tipItemScript.text = txt;
            this._tipSpr.addChild(tipItemSpr_1);
            tipItemSpr_1.x = (GameConfig_1.default.width - tipItemSpr_1.width) / 2;
            tipItemSpr_1.y = this._tipItemStartY - 60;
            this._tipItems.push(tipItemSpr_1);
            this.sortTipItems();
            Laya.timer.once(1000, this, function () {
                Laya.Tween.to(tipItemSpr_1, { alpha: 0 }, 300);
            });
            Laya.timer.once(1300, this, function () {
                this._tipItems.splice(this._tipItems.indexOf(tipItemSpr_1), 1);
                Laya.timer.clearAll(tipItemSpr_1);
                tipItemSpr_1.destroy(true);
            });
        }
    };
    TipController.prototype.sortTipItems = function () {
        for (var i = 0; i < this._tipItems.length; i++) {
            var label = this._tipItems[i];
            var targetY = this._tipItemStartY - 60 * (this._tipItems.length - i);
            Laya.Tween.to(label, { y: targetY }, 100);
        }
    };
    return TipController;
}(ControllerBase_1.default));
exports.default = TipController;

},{"../../GameConfig":3,"../prefeb/TipItem":24,"./ControllerBase":11}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppConfig_1 = require("../../AppConfig");
var ModelBase_1 = require("./ModelBase");
var ResMgr_1 = require("../../ResMgr");
var URI_1 = require("../../URI");
var MapFontInfo = /** @class */ (function (_super) {
    __extends(MapFontInfo, _super);
    function MapFontInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._quality = 1;
        return _this;
    }
    MapFontInfo.getGroup = function (font) {
        if (MapFontInfo._groupCache[font] == null) {
            var arr = [];
            for (var i = 0; i < MapFontInfo.DataSource["group"].length; i++) {
                var tempGroup = MapFontInfo.DataSource["group"][i];
                if (tempGroup.indexOf(font) != -1) {
                    arr.push(tempGroup);
                }
            }
            MapFontInfo._groupCache[font] = arr;
        }
        return MapFontInfo._groupCache[font];
    };
    Object.defineProperty(MapFontInfo.prototype, "quality", {
        get: function () {
            return this._quality;
        },
        //1,2,3,4 初始为1，没合成一次升级，最高4级
        set: function (value) {
            if (value > 4) {
                value = 4;
            }
            this._quality = value;
        },
        enumerable: true,
        configurable: true
    });
    MapFontInfo.create = function (data) {
        if (AppConfig_1.default.pools['MapFontInfo'] == null) {
            AppConfig_1.default.pools['MapFontInfo'] = { sign: 'MapFontInfo', pool: MapFontInfo._pool, createCount: 0, recoverCount: 0 };
        }
        AppConfig_1.default.pools['MapFontInfo'].createCount++;
        var cout;
        if (MapFontInfo._pool.length > 0) {
            cout = MapFontInfo._pool.pop();
            cout.isRecover = false;
        }
        else {
            cout = new MapFontInfo();
        }
        if (data != null)
            cout.setDataByKey(data);
        return cout;
    };
    Object.defineProperty(MapFontInfo.prototype, "canHeChengGroup", {
        /**
         * 是否可合成词组
         */
        get: function () {
            var _this = this;
            if (MapFontInfo._heChengCiZuObj[this.text] == null) {
                var cout_1 = [];
                MapFontInfo.DataSource["group"].forEach(function (element) {
                    if (element.indexOf(_this.text) != -1) {
                        cout_1.push(element);
                    }
                });
                MapFontInfo._heChengCiZuObj[this.text] = cout_1;
            }
            return MapFontInfo._heChengCiZuObj[this.text].length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFontInfo.prototype, "canHeChengGroups", {
        get: function () {
            if (this.canHeChengGroup) {
                return MapFontInfo._heChengCiZuObj[this.text];
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 根据fontId,找出使用这个id的组合列表,未传入fontId，则输出所有组合列表
     * @param id font id
     * @param isExceptSelf 是否排除自己
     */
    MapFontInfo.prototype.getStructInfos = function (fontId, isExceptSelf) {
        var _this = this;
        if (fontId === void 0) { fontId = null; }
        if (isExceptSelf === void 0) { isExceptSelf = true; }
        var cout = [];
        if (fontId == this.id && isExceptSelf == false) {
            cout.push(fontId.toString());
        }
        else {
            this.structInfo.split(",").forEach(function (element) {
                if (fontId == null) {
                    if (element == _this.id.toString()) {
                        return;
                    }
                    cout.push(element);
                }
                else {
                    if (isExceptSelf && element == fontId.toString()) {
                        return;
                    }
                    if (element.split("_").indexOf(fontId.toString()) != -1) {
                        cout.push(element);
                    }
                }
            });
        }
        return cout;
    };
    Object.defineProperty(MapFontInfo.prototype, "canHeChengFont", {
        /**
         * 是否可合成其他汉子
         */
        get: function () {
            var _this = this;
            if (MapFontInfo._heChengHanZiObj[this.text] == null) {
                var cout_2 = [];
                MapFontInfo.DataSource["font"].forEach(function (element) {
                    var fontInfo = MapFontInfo.create();
                    fontInfo.setDataByValueArr(element);
                    var structInfos = fontInfo.getStructInfos(_this.id);
                    if (structInfos.length > 0) {
                        cout_2.push(fontInfo);
                    }
                });
                MapFontInfo._heChengHanZiObj[this.text] = cout_2;
            }
            return MapFontInfo._heChengHanZiObj[this.text].length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapFontInfo.prototype, "canHeChengFontInfos", {
        get: function () {
            if (this.canHeChengFont) {
                return MapFontInfo._heChengHanZiObj[this.text];
            }
            return [];
        },
        enumerable: true,
        configurable: true
    });
    MapFontInfo.prototype.getStuntFontEffect = function () {
        if (!this.isStuntFont) {
            return null;
        }
        if (this._stuntFontEffect == null) {
            this._stuntFontEffect = ResMgr_1.ResMgr.Instance().createSpine(URI_1.default.spineUrl + "other_wupinghuanrao_kin_little.sk", "animation", true);
            this._stuntFontEffect.x = this._stuntFontEffect.y = 44;
            this._stuntFontEffect.scaleX = this._stuntFontEffect.scaleY = 1.3;
        }
        return this._stuntFontEffect;
    };
    MapFontInfo.prototype.destroyStuntEffect = function () {
        if (this._stuntFontEffect) {
            this._stuntFontEffect.destroy(true);
            this._stuntFontEffect = null;
        }
    };
    MapFontInfo.prototype.getStruct = function () {
        return MapFontInfo.DataSource["font_struct"];
    };
    MapFontInfo.prototype.recover = function () {
        if (this.isRecover) {
            return;
        }
        if (this._stuntFontEffect) {
            this._stuntFontEffect.destroy(true);
        }
        this._stuntFontEffect = null;
        if (AppConfig_1.default.pools['MapFontInfo'] == null) {
            AppConfig_1.default.pools['MapFontInfo'] = { sign: 'MapFontInfo', pool: MapFontInfo._pool, createCount: 0, recoverCount: 0 };
        }
        AppConfig_1.default.pools['MapFontInfo'].recoverCount++;
        MapFontInfo._pool.push(this);
        this.isRecover = true;
    };
    MapFontInfo.prototype.setDataByValueArr = function (dataArr) {
        var fontStruct = MapFontInfo.DataSource["font_struct"];
        var obj;
        for (var i = 0; i < dataArr.length; i++) {
            if (fontStruct.length > i)
                this[fontStruct[i]] = dataArr[i];
        }
    };
    MapFontInfo.prototype.setDataByKey = function (value) {
        var obj;
        var fontStruct = MapFontInfo.DataSource["font_struct"];
        var fontDatas = MapFontInfo.DataSource["font"];
        for (var i = 0; i < fontDatas.length; i++) {
            var fontArr = MapFontInfo.DataSource["font"][i];
            var isMeet = true;
            for (var tempProperty in value) {
                if (value[tempProperty] != fontArr[fontStruct.indexOf(tempProperty)]) {
                    isMeet = false;
                    break;
                }
            }
            if (isMeet) {
                obj = {};
                for (var j = 0; j < fontStruct.length; j++) {
                    obj[fontStruct[j]] = fontArr[j];
                }
                break;
            }
        }
        if (obj != null) {
            this.setData(obj);
        }
    };
    MapFontInfo._groupCache = {};
    MapFontInfo._pool = [];
    MapFontInfo._heChengCiZuObj = {};
    MapFontInfo._heChengHanZiObj = {};
    return MapFontInfo;
}(ModelBase_1.default));
exports.default = MapFontInfo;

},{"../../AppConfig":1,"../../ResMgr":5,"../../URI":6,"./ModelBase":17}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppConfig_1 = require("../../AppConfig");
var ModelBase_1 = require("./ModelBase");
var MapFontInfo_1 = require("./MapFontInfo");
var MapStarInfo = /** @class */ (function (_super) {
    __extends(MapStarInfo, _super);
    function MapStarInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapStarInfo.create = function (data) {
        if (AppConfig_1.default.pools['MapStarInfo'] == null) {
            AppConfig_1.default.pools['MapStarInfo'] = { sign: 'MapStarInfo', pool: MapStarInfo._pool, createCount: 0, recoverCount: 0 };
        }
        AppConfig_1.default.pools['MapStarInfo'].createCount++;
        var cout;
        if (MapStarInfo._pool.length > 0) {
            cout = MapStarInfo._pool.pop();
            cout.isRecover = false;
        }
        else {
            cout = new MapStarInfo();
        }
        if (data != null)
            cout.setDataByKey(data);
        return cout;
    };
    MapStarInfo.prototype.getStruct = function () {
        return MapFontInfo_1.default.DataSource["star_struct"];
    };
    MapStarInfo.prototype.recover = function () {
        if (this.isRecover) {
            return;
        }
        if (AppConfig_1.default.pools['MapStarInfo'] == null) {
            AppConfig_1.default.pools['MapStarInfo'] = { sign: 'MapStarInfo', pool: MapStarInfo._pool, createCount: 0, recoverCount: 0 };
        }
        AppConfig_1.default.pools['MapStarInfo'].recoverCount++;
        MapStarInfo._pool.push(this);
        this.isRecover = true;
    };
    MapStarInfo.prototype.setDataByKey = function (value) {
        var obj;
        var struct = this.getStruct();
        var datas = MapFontInfo_1.default.DataSource["star"];
        for (var i = 0; i < datas.length; i++) {
            var fontArr = datas[i];
            var isMeet = true;
            for (var tempProperty in value) {
                if (value[tempProperty] != fontArr[struct.indexOf(tempProperty)]) {
                    isMeet = false;
                    break;
                }
            }
            if (isMeet) {
                obj = {};
                for (var j = 0; j < struct.length; j++) {
                    obj[struct[j]] = fontArr[j];
                }
                break;
            }
        }
        if (obj != null) {
            this.setData(obj);
        }
    };
    MapStarInfo._pool = [];
    return MapStarInfo;
}(ModelBase_1.default));
exports.default = MapStarInfo;

},{"../../AppConfig":1,"./MapFontInfo":15,"./ModelBase":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppConfig_1 = require("../../AppConfig");
var ModelBase = /** @class */ (function () {
    function ModelBase() {
        this.isRecover = false;
        this._____id = ModelBase.modelIdIncrease;
        ModelBase.modelIdIncrease++;
    }
    ModelBase.prototype.setData = function (obj) {
        var struct = this.getStruct();
        if (obj instanceof Array && struct != null) {
            for (var i = 0; i < struct.length; i++) {
                this[struct[i]] = obj[i];
            }
        }
        else {
            for (var tempPro in obj) {
                this[tempPro] = obj[tempPro];
            }
        }
    };
    ModelBase.prototype.getStruct = function () {
        return null;
    };
    ModelBase.prototype.getSign = function () {
        if (this._sign == null) {
            this._sign = this["__proto__"].constructor.name;
        }
        return this._sign;
    };
    ModelBase.create = function (data) {
        if (AppConfig_1.default.pools['ModelBase'] == null) {
            AppConfig_1.default.pools['ModelBase'] = { sign: 'ModelBase', pool: ModelBase._pool, createCount: 0, recoverCount: 0 };
        }
        AppConfig_1.default.pools['ModelBase'].createCount++;
        var cout;
        if (ModelBase._pool.length > 0) {
            cout = ModelBase._pool.pop();
            cout.isRecover = false;
        }
        else {
            cout = new ModelBase();
        }
        if (data != null)
            cout.setDataByKey(data);
        return cout;
    };
    ModelBase.prototype.recover = function () {
        if (this.isRecover) {
            return;
        }
        if (AppConfig_1.default.pools['ModelBase'] == null) {
            AppConfig_1.default.pools['ModelBase'] = { sign: 'ModelBase', pool: ModelBase._pool, createCount: 0, recoverCount: 0 };
        }
        AppConfig_1.default.pools['ModelBase'].recoverCount++;
        ModelBase._pool.push(this);
        this.isRecover = true;
    };
    ModelBase.prototype.setDataByKey = function (value) {
    };
    ModelBase.modelIdIncrease = 0;
    ModelBase._pool = [];
    return ModelBase;
}());
exports.default = ModelBase;

},{"../../AppConfig":1}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModelBase_1 = require("./ModelBase");
var MapStarInfo_1 = require("./MapStarInfo");
var PlayerInfo = /** @class */ (function (_super) {
    __extends(PlayerInfo, _super);
    function PlayerInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "test";
        _this.url = "http://cdn.duitang.com/uploads/item/201410/08/20141008150015_dP8yJ.thumb.700_0.jpeg";
        return _this;
    }
    PlayerInfo.prototype.getStarInfo = function (score) {
        var starNum;
        if (score < 3000) {
            starNum = 0;
        }
        else if (score < 8000) {
            starNum = 1;
        }
        else if (score < 12000) {
            starNum = 2;
        }
        else if (score < 30000) {
            starNum = 3;
        }
        else if (score < 60000) {
            starNum = 4;
        }
        else {
            starNum = 5;
        }
        if (this._starInfo == null || this._starInfo.star_num != starNum) {
            this._starInfo = MapStarInfo_1.default.create();
            if (this._starInfo.star_num != starNum) {
                this._starInfo.setDataByKey({ star_num: starNum });
            }
        }
        return this._starInfo;
    };
    return PlayerInfo;
}(ModelBase_1.default));
exports.default = PlayerInfo;

},{"./MapStarInfo":16,"./ModelBase":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrefebBase_1 = require("./PrefebBase");
var ResMgr_1 = require("../../ResMgr");
var URI_1 = require("../../URI");
var FontGrid = /** @class */ (function (_super) {
    __extends(FontGrid, _super);
    function FontGrid() {
        var _this = _super.call(this) || this;
        /** @prop {name:font, tips:"显示文字", type:String, default:""}*/
        _this.font = "";
        /** @prop {name:numType, tips:"质量 蓝1，红2，紫3，金4", type:Number, default:1}*/
        _this.quality = 1;
        _this.colorArr = ["blue", "red", "puple", "yellow"];
        _this._effects = [];
        return _this;
    }
    FontGrid.prototype.addEffect = function (effect) {
        if (effect == null)
            return;
        this.owner.addChild(effect);
        this._effects.push(effect);
    };
    FontGrid.prototype.clearEffects = function () {
        var _this = this;
        this._effects.forEach(function (element) {
            _this.owner.removeChild(element);
        });
        this._effects = [];
    };
    FontGrid.prototype.onUpdate = function () {
        var img_bg = this.owner.getChildByName("img_bg");
        if (this.font != null) {
            this.owner.getChildByName("txt")["text"] = this.font;
            img_bg.visible = true;
            img_bg.skin = "map/img_" + this.getQualitySign() + "GridBg.png";
        }
        else {
            this.owner.getChildByName("txt")["text"] = "";
            img_bg.visible = false;
        }
    };
    FontGrid.prototype.getQualitySign = function () {
        return this.colorArr[this.quality - 1];
    };
    FontGrid.prototype.onReset = function () {
        this.quality = 1;
    };
    FontGrid.prototype.onDisable = function () {
        this.recover();
    };
    FontGrid.prototype.playHeChengEffect = function () {
        var sk = ResMgr_1.ResMgr.Instance().createSpine(URI_1.default.spineUrl + "other_taozhuangxitong1.sk", "animation", false);
        sk.x = sk.y = 44;
        sk.scaleX = sk.scaleY = 1.7;
        this.owner.addChild(sk);
        sk.on(Laya.Event.STOPPED, this, function (par_sk) {
            par_sk.destroy();
        }, [sk]);
    };
    FontGrid.prototype.reset = function () {
        this.quality = 1;
        this.clearEffects();
    };
    return FontGrid;
}(PrefebBase_1.default));
exports.default = FontGrid;

},{"../../ResMgr":5,"../../URI":6,"./PrefebBase":22}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrefebBase_1 = require("./PrefebBase");
var AppConfig_1 = require("../../AppConfig");
var GameResult = /** @class */ (function (_super) {
    __extends(GameResult, _super);
    function GameResult() {
        return _super.call(this) || this;
    }
    GameResult.prototype.onAwake = function () {
        _super.prototype.onAwake.call(this);
        this.txt_score.text = this.score.toString();
        this.btn_home.clickHandler = Laya.Handler.create(this, function () {
            this.showHomeHandler.run();
        }, null, false);
        this.btn_tryAgain.clickHandler = Laya.Handler.create(this, function () {
            if (AppConfig_1.default.platform == "wx") {
                this.restartHandler.runWith(1);
                wx["shareAppMessage"]({
                    title: '我在这个游戏里面得了' + this.score + "分",
                    imageUrl: "https://mmocgame.qpic.cn/wechatgame/iaUVuxArE9L9G28F6XrxKAIEtJOs9x1Ycm2MYmC2Uz5T9O4RLq0ejvG3ic2KlUBiaVf/0",
                    imageUrlId: "NelenHPLRXK1-AWENn0aZw"
                });
            }
            else {
                this.restartHandler.run();
            }
        }, null, false);
    };
    GameResult.prototype.onEnable = function () {
    };
    GameResult.prototype.onDisable = function () {
        this.btn_home.offAll();
        this.btn_tryAgain.offAll();
    };
    return GameResult;
}(PrefebBase_1.default));
exports.default = GameResult;

},{"../../AppConfig":1,"./PrefebBase":22}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrefebBase_1 = require("./PrefebBase");
var AppConfig_1 = require("../../AppConfig");
var ControllerMgr_1 = require("../controller/ControllerMgr");
var TipController_1 = require("../controller/TipController");
var SoundTool_1 = require("../tool/SoundTool");
var GameSetting = /** @class */ (function (_super) {
    __extends(GameSetting, _super);
    function GameSetting() {
        return _super.call(this) || this;
    }
    GameSetting.prototype.onAwake = function () {
        _super.prototype.onAwake.call(this);
        this.btn_home.clickHandler = Laya.Handler.create(this, function () {
            this.showHomeHandler.run();
        }, null, false);
        this.btn_tryAgain.clickHandler = Laya.Handler.create(this, function () {
            if (AppConfig_1.default.platform == "wx") {
                this.restartHandler.runWith(1);
                wx["shareAppMessage"]({
                    title: '发现有个有趣的游戏',
                    imageUrl: "https://mmocgame.qpic.cn/wechatgame/iaUVuxArE9L9G28F6XrxKAIEtJOs9x1Ycm2MYmC2Uz5T9O4RLq0ejvG3ic2KlUBiaVf/0",
                    imageUrlId: "NelenHPLRXK1-AWENn0aZw"
                });
            }
            else {
                this.restartHandler.run();
            }
        }, null, false);
        this.btn_share.clickHandler = (Laya.Handler.create(this, function (e) {
            // if(e.type != Laya.Event.MOUSE_UP)return;
            if (AppConfig_1.default.platform == "wx") {
                wx["shareAppMessage"]({
                    title: '发现有个有趣的游戏',
                    imageUrl: "https://mmocgame.qpic.cn/wechatgame/iaUVuxArE9L9G28F6XrxKAIEtJOs9x1Ycm2MYmC2Uz5T9O4RLq0ejvG3ic2KlUBiaVf/0",
                    imageUrlId: "NelenHPLRXK1-AWENn0aZw"
                });
            }
            else {
                ControllerMgr_1.default.getInstance(TipController_1.default).showTip("尽情期待");
            }
        }, null, false));
        this.btn_close.clickHandler = (Laya.Handler.create(this, function (e) {
            // if(e.type != Laya.Event.MOUSE_UP)return;
            this.onCloseHandler.run();
        }, null, false));
        this.btn_music.on(Laya.Event.MOUSE_DOWN, this, this.onDragMouseDown);
        this.btn_effect.on(Laya.Event.MOUSE_DOWN, this, this.onDragMouseDown);
        this.refresh();
    };
    GameSetting.prototype.onDragMouseDown = function (e) {
        this._dragTarget = e.currentTarget;
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onStageMouseUp2);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onStageMouseMove2);
    };
    GameSetting.prototype.onStageMouseUp2 = function (e) {
        this._dragTarget = null;
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onStageMouseUp2);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onStageMouseMove2);
    };
    GameSetting.prototype.onStageMouseMove2 = function (e) {
        var point = new Laya.Point(e.stageX, e.stageY);
        var progress;
        if (this._dragTarget == this.btn_effect) {
            progress = this.progress_effect;
        }
        else {
            progress = this.progress_music;
        }
        point = this._dragTarget.parent["globalToLocal"](point);
        var x = point.x - progress.x - this._dragTarget.width / 2;
        if (x < 0) {
            x = 0;
        }
        if (x > progress.width - this._dragTarget.width) {
            x = progress.width - this._dragTarget.width;
        }
        var num = x / (progress.width - this._dragTarget.width);
        progress.value = num;
        if (progress == this.progress_effect) {
            SoundTool_1.default.setSoundVolume(num);
        }
        else {
            SoundTool_1.default.setMusicVolume(num);
        }
        this.refresh();
    };
    GameSetting.prototype.refresh = function () {
        this.progress_effect.value = SoundTool_1.default.getSoundVolume();
        this.btn_effect.x = this.progress_effect.x + (this.progress_effect.width - this.btn_effect.width) * this.progress_effect.value + this.btn_effect.width / 2;
        this.progress_music.value = SoundTool_1.default.getMusicVolume();
        this.btn_music.x = this.progress_music.x + (this.progress_music.width - this.btn_music.width) * this.progress_music.value + this.btn_music.width / 2;
    };
    GameSetting.prototype.onEnable = function () {
    };
    GameSetting.prototype.onDisable = function () {
        this.btn_home.offAll();
        this.btn_tryAgain.offAll();
        this.btn_share.offAll();
    };
    return GameSetting;
}(PrefebBase_1.default));
exports.default = GameSetting;

},{"../../AppConfig":1,"../controller/ControllerMgr":12,"../controller/TipController":14,"../tool/SoundTool":30,"./PrefebBase":22}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrefebBase = /** @class */ (function (_super) {
    __extends(PrefebBase, _super);
    function PrefebBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrefebBase.setPrefeb = function (value) {
        PrefebBase._prefeb = value;
    };
    PrefebBase.prototype.onAwake = function () {
        for (var i = 0; i < this.owner.numChildren; i++) {
            var element = this.owner.getChildAt(i);
            if (element.name == "" || element.name.indexOf("_") == -1) {
                continue;
            }
            var tempPropertyList = element.name.split("_");
            switch (tempPropertyList[0]) {
                case "list":
                case "txt":
                case "img":
                case "btn":
                case "progress":
                    this[element.name] = element;
                    break;
                default:
                    break;
            }
        }
    };
    PrefebBase.getPrefeb = function () {
        return this._prefeb;
    };
    PrefebBase.getSign = function () {
        return this["__proto__"].constructor.name;
    };
    PrefebBase.create = function () {
        return Laya.Pool.getItemByCreateFun(PrefebBase.getSign(), PrefebBase._prefeb.create, PrefebBase._prefeb);
    };
    PrefebBase.prototype.recover = function () {
        Laya.Pool.recover(PrefebBase.getSign(), this);
    };
    return PrefebBase;
}(Laya.Script));
exports.default = PrefebBase;

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrefebBase_1 = require("./PrefebBase");
var AppConfig_1 = require("../../AppConfig");
var ControllerMgr_1 = require("../controller/ControllerMgr");
var TipController_1 = require("../controller/TipController");
var WXTool_1 = require("../tool/WXTool");
var GameConfig_1 = require("../../GameConfig");
var PlayerController_1 = require("../controller/PlayerController");
var StartGame = /** @class */ (function (_super) {
    __extends(StartGame, _super);
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    function StartGame() {
        return _super.call(this) || this;
    }
    StartGame.prototype.onAwake = function () {
        var _this = this;
        _super.prototype.onAwake.call(this);
        if (AppConfig_1.default.platform == "wx") {
            var scaleX = Laya.MiniAdpter.window.screen.availWidth / 640;
            var scaleY = Laya.MiniAdpter.window.screen.availHeight * (GameConfig_1.default.height / Laya.stage.height) / 1136;
            // let scaleX = Laya.stage.width / 640;
            // let scaleY = Laya.stage.height / 1136;
            var button_1 = wx["createUserInfoButton"]({
                type: 'image',
                image: 'btn_startGame.png',
                style: {
                    left: this.btn_startGame.x * scaleX,
                    top: this.btn_startGame.y * scaleY,
                    width: this.btn_startGame.width * scaleX,
                    height: this.btn_startGame.height * scaleY,
                    lineHeight: 40,
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });
            button_1.onTap(function (res) {
                // console.log(res)
                ControllerMgr_1.default.getInstance(PlayerController_1.default).myPlayerInfo.name = res.userInfo.nickName;
                _this.handler.run();
                button_1.destroy();
            });
            this.btn_startGame.destroy();
            this.btn_startGame = button_1;
            WXTool_1.default.addBtn(this.btn_startGame);
        }
        else {
            this.btn_startGame.zoomOn(Laya.Handler.create(this, function (e) {
                if (e.type == Laya.Event.MOUSE_UP)
                    this.handler.run();
            }, null, false));
        }
        this.btn_showRank.zoomOn(Laya.Handler.create(this, function (e) {
            if (e.type != Laya.Event.MOUSE_UP)
                return;
            if (AppConfig_1.default.platform == "wx") {
                this.onShowRank.run();
            }
            else {
                ControllerMgr_1.default.getInstance(TipController_1.default).showTip("尽情期待");
            }
        }, null, false));
        this.btn_share.zoomOn(Laya.Handler.create(this, function (e) {
            if (e.type != Laya.Event.MOUSE_UP)
                return;
            if (AppConfig_1.default.platform == "wx") {
                wx["shareAppMessage"]({
                    title: '发现有个有趣的游戏',
                    imageUrl: "https://mmocgame.qpic.cn/wechatgame/iaUVuxArE9L9G28F6XrxKAIEtJOs9x1Ycm2MYmC2Uz5T9O4RLq0ejvG3ic2KlUBiaVf/0",
                    imageUrlId: "NelenHPLRXK1-AWENn0aZw"
                });
            }
            else {
                ControllerMgr_1.default.getInstance(TipController_1.default).showTip("尽情期待");
            }
        }, null, false));
    };
    StartGame.prototype.onEnable = function () {
    };
    StartGame.prototype.onDisable = function () {
        if (AppConfig_1.default.platform == "wx") {
            WXTool_1.default.removeBtn(this.btn_startGame);
            this.btn_startGame.destroy(true);
        }
        else {
            this.btn_startGame.offAll();
        }
    };
    return StartGame;
}(PrefebBase_1.default));
exports.default = StartGame;

},{"../../AppConfig":1,"../../GameConfig":3,"../controller/ControllerMgr":12,"../controller/PlayerController":13,"../controller/TipController":14,"../tool/WXTool":31,"./PrefebBase":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrefebBase_1 = require("./PrefebBase");
var TipItem = /** @class */ (function (_super) {
    __extends(TipItem, _super);
    function TipItem() {
        var _this = _super.call(this) || this;
        /** @prop {name:text, tips:"字符串类型示例", type:String, default:"d"}*/
        _this.text = "d";
        return _this;
    }
    TipItem.prototype.onAwake = function () {
        _super.prototype.onAwake.call(this);
        this.txt_text.text = this.text;
        this.img_bg.width = this.txt_text.displayWidth + 36;
        this.owner["width"] = this.img_bg.width;
    };
    TipItem.prototype.onEnable = function () {
    };
    TipItem.prototype.onDisable = function () {
    };
    return TipItem;
}(PrefebBase_1.default));
exports.default = TipItem;

},{"./PrefebBase":22}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneBase_1 = require("./SceneBase");
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        return _super.call(this) || this;
    }
    LoadingScene.prototype.onAwake = function () {
        _super.prototype.onAwake.call(this);
    };
    LoadingScene.prototype.onEnable = function () {
    };
    LoadingScene.prototype.onDisable = function () {
    };
    /**
     * 更新进度条百分比
     * @param value 百分比 0-100
     */
    LoadingScene.prototype.updatePercent = function (value) {
        this.txt_progress.text = "正在加载资源 " + value + "%";
    };
    return LoadingScene;
}(SceneBase_1.default));
exports.default = LoadingScene;

},{"./SceneBase":27}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapFontInfo_1 = require("../model/MapFontInfo");
var StartGame_1 = require("../prefeb/StartGame");
var SceneBase_1 = require("./SceneBase");
var FontGrid_1 = require("../prefeb/FontGrid");
var PlayerController_1 = require("../controller/PlayerController");
var GameResult_1 = require("../prefeb/GameResult");
var AppConfig_1 = require("../../AppConfig");
var TipController_1 = require("../controller/TipController");
var ControllerMgr_1 = require("../controller/ControllerMgr");
var NativeBridge4399_1 = require("../tool/NativeBridge4399");
var SoundTool_1 = require("../tool/SoundTool");
var GameSetting_1 = require("../prefeb/GameSetting");
var GameState;
(function (GameState) {
    GameState[GameState["End"] = 0] = "End";
    GameState[GameState["Pause"] = 1] = "Pause";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["init"] = 3] = "init";
    GameState[GameState["EffectPause"] = 4] = "EffectPause"; //释放特效导致的暂停
})(GameState || (GameState = {}));
var MainGameScene = /** @class */ (function (_super) {
    __extends(MainGameScene, _super);
    function MainGameScene() {
        var _this = _super.call(this) || this;
        _this._fonts = [];
        _this._sysDropingFontInfos = []; //消除产生的新字，自动下落
        _this._sysDispelFontInfoStack = []; //消除产生的新字，在自动下落完毕后，存储，用于所有字下落完毕统一执行消除操作
        _this._startPoint = new Laya.Point(2, 0);
        _this._maxTickTime = 26;
        _this._sysTickTime = 0;
        _this._maxSysTickTime = 8;
        _this._words = []; //左边字符列表，欢迎字符列表
        _this._splitFontWords = []; //分字字符列表
        _this._splitGroupWords = []; //分词字符列表
        _this._minWordsLength = 5;
        _this._isMouseDown = false;
        _this._isQuickDrop = false;
        _this._score = 0; //当前局分数
        _this._nuQi = 0; //怒气，用来触发技能
        _this._debugMode = false; //调试
        _this._debugFonts = [
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
            "氵", null, null, "氵", null,
        ];
        _this._debugDropFonts = ["十"];
        _this._guideDropFonts = [];
        _this._cacheProperties = ["heCiSplitTimes", "heCizuRate", "ciZuRate", "_score", "_nuQi", "_popularGroup", "_guideRate", "buShouRate"];
        _this._stuntFontsCheckArr1 = []; //合成消除确认队列
        _this._stuntFontsCheckArr2 = []; //组词消除确认队列
        _this._checkIds = [];
        _this._guideImgs = {};
        _this._guideRate = 0;
        //生成字
        _this.heCiSplitTimes = 1; //合成当前左边词组失败次数
        _this.heCizuRate = 40; //出现左边那个词组的概率
        _this.hanZiRate = 60; // 出现能跟五列最外边汉字合成汉字的概率
        _this.ciZuRate = 60; // 出现能跟五列最外边汉字合成词组的概率
        _this.buShouRate = 0; //出现特殊部首的概率
        _this._playerEffectInd = 0;
        return _this;
    }
    MainGameScene.prototype.onAwake = function () {
        _super.prototype.onAwake.call(this);
        switch (AppConfig_1.default.platform) {
            case "wx":
                break;
            default:
                this.txt_playerName.visible = false;
                this.list_star.y = 84;
                this.txt_score.y = 142;
                break;
        }
        if (!AppConfig_1.default.hadGuidance()) {
            this._guideDropFonts = ["木", "木", "夕", "想", "又", "欠", "乐", "木", "目", "心", "化", "十"];
            AppConfig_1.default.setGuidance(true);
        }
        this.list_grids.renderHandler = Laya.Handler.create(this, this.onGridRender, null, false);
        this.list_star.renderHandler = Laya.Handler.create(this, this.onStarRender, null, false);
        this.list_nuQi.renderHandler = Laya.Handler.create(this, this.onNuQiRender, null, false);
        this._myPlayerInfo = ControllerMgr_1.default.getInstance(PlayerController_1.default).myPlayerInfo;
        this.btn_pauseOrStart["zoomOn"](Laya.Handler.create(this, this.onPauseOrStartMouseEvent, [], false));
        this.btn_setting["zoomOn"](Laya.Handler.create(this, this.onSettingMouseEvent, [], false));
        this.changeGameStatue(GameState.init);
        this.refresh();
        // let sk = ResMgr.Instance().createSpine(URI.spineUrl + "zf_wanqianshijie.sk","hit",true,Laya.Handler.create(this,function() : void{
        //     // this._heChengEffect.destroy();
        //     // this._heChengEffect = null;
        // }));
        // sk.x = sk.y = 44;
        // this.owner.addChild(sk);
    };
    MainGameScene.prototype.onSettingMouseEvent = function (e) {
        if (e.type == Laya.Event.MOUSE_UP) {
            this.changeGameStatue(GameState.Pause);
            this.showGameSetting();
        }
        e.stopPropagation();
    };
    MainGameScene.prototype.onPauseOrStartMouseEvent = function (e) {
        if (e.type == Laya.Event.MOUSE_UP) {
            if (this._gameState == GameState.Pause) {
                this.changeGameStatue(GameState.Playing);
            }
            else {
                //打印当前所有格子信息
                var str = "";
                for (var j = 0; j < this.list_grids.repeatY; j++) {
                    for (var i = 0; i < this.list_grids.repeatX; i++) {
                        if (this._fonts[i][j] == null) {
                            str += "null,";
                        }
                        else {
                            str += "'" + this._fonts[i][j].text + "',";
                        }
                    }
                    str += "\n";
                }
                console.log(str);
                this.changeGameStatue(GameState.Pause);
            }
        }
        e.stopPropagation();
    };
    MainGameScene.prototype.showStartGame = function () {
        var startGameSpr = Laya.Pool.getItemByCreateFun("StartGame", this.prefab_startGame.create, this.prefab_startGame);
        var startGameScript = startGameSpr.getComponent(StartGame_1.default);
        startGameScript.handler = Laya.Handler.create(this, this.changeGameStatue, [GameState.Playing], false);
        startGameScript.onShowRank = Laya.Handler.create(this, this.showRank, null, false);
        this.addPopUp("StartGame", startGameSpr, false, false, false);
    };
    MainGameScene.prototype.showGameResult = function () {
        var gameResultSpr = Laya.Pool.getItemByCreateFun("GameResult", this.prefab_gameResult.create, this.prefab_gameResult);
        var gameResultScript = gameResultSpr.getComponent(GameResult_1.default);
        var storageObj = {
            "wxgame": {
                "score": this._score,
                "update_time": Date.now()
            },
            "score": this._score
        };
        this._dataViewer.postMsg({
            cmd: "wx.setUserCloudStorage",
            data: storageObj
        });
        gameResultScript.score = this._score;
        gameResultScript.showHomeHandler = Laya.Handler.create(this, this.changeGameStatue, [GameState.init], false);
        gameResultScript.restartHandler = Laya.Handler.create(this, this.restart, null, false);
        this.addPopUp("GameResult", gameResultSpr, false, false, false);
    };
    MainGameScene.prototype.showGameSetting = function () {
        var gameSettingSpr = Laya.Pool.getItemByCreateFun("GameSetting", this.prefab_gameSetting.create, this.prefab_gameSetting);
        var gameSettingScript = gameSettingSpr.getComponent(GameSetting_1.default);
        gameSettingScript.onCloseHandler = Laya.Handler.create(this, this.changeGameStatue, [GameState.Playing], false);
        gameSettingScript.showHomeHandler = Laya.Handler.create(this, this.changeGameStatue, [GameState.init], false);
        gameSettingScript.restartHandler = Laya.Handler.create(this, this.restart, null, false);
        this.addPopUp("gameSetting", gameSettingSpr, true, true, false);
    };
    MainGameScene.prototype.restart = function () {
        localStorage.setItem("StorageVersion", null);
        localStorage.setItem("CacheData", null);
        this._gameState = GameState.End;
        this.changeGameStatue(GameState.Playing);
    };
    /**
     *
     * @param gameState 变更状态
     * @param nextState 下一个状态
     */
    MainGameScene.prototype.changeGameStatue = function (gameState, nextState) {
        if (nextState === void 0) { nextState = -1; }
        switch (gameState) {
            case GameState.End:
                localStorage.setItem("CacheData", null);
                this.showGameResult();
                break;
            case GameState.Playing:
                if (AppConfig_1.default.platform == "android4399") {
                    NativeBridge4399_1.default.showBannerAd(true);
                }
                this.btn_pauseOrStart.skin = "map/btn_pause.png";
                this.hidePopUp();
                if (this._gameState != GameState.Pause && this._gameState != GameState.EffectPause) {
                    var bool = void 0;
                    try {
                        bool = this.restoreAll();
                    }
                    catch (_a) {
                        localStorage.setItem("CacheData", null);
                        bool = false;
                    }
                    if (!bool) {
                        this._score = 0;
                        // this._nuQi = this._debugMode ? 12 : 0;
                        this._nuQi = 0;
                        for (var i = 0; i < this.list_grids.repeatX; i++) {
                            for (var j = 0; j < this.list_grids.repeatY; j++) {
                                if (this._fonts[i] == null) {
                                    this._fonts[i] = [];
                                }
                                if (this._debugMode) {
                                    var txt = this._debugFonts[i + j * 5];
                                    if (txt == null) {
                                        this._fonts[i][j] = null;
                                    }
                                    else {
                                        var tempFontInfo = MapFontInfo_1.default.create({ text: txt });
                                        tempFontInfo.x = i;
                                        tempFontInfo.y = j;
                                        this._fonts[i][j] = tempFontInfo;
                                    }
                                }
                                else {
                                    this._fonts[i][j] = null;
                                }
                            }
                        }
                        this._words = [];
                        this._popularGroup = null;
                        this._sysDispelFontInfoStack = [];
                        this._sysDropingFontInfos = [];
                        this._splitFontWords = [];
                        this._splitGroupWords = [];
                        this._dropingFontInfo = null;
                        this._nextDropingFontInfo = null;
                        this.heCiSplitTimes = 0; //合成当前左边词组失败次数
                        this.heCizuRate = 10; //出现左边那个词组的概率
                        this.hanZiRate = 10; // 出现能跟五列最外边汉字合成汉字的概率
                        this.ciZuRate = 10; // 出现能跟五列最外边汉字合成词组的概率
                        this.refresh();
                        this.renderGridList();
                    }
                }
                break;
            case GameState.Pause:
                this.btn_pauseOrStart.skin = "map/btn_start.png";
                break;
            case GameState.EffectPause:
                break;
            case GameState.init:
                this.showStartGame();
                if (AppConfig_1.default.platform == "android4399") {
                    NativeBridge4399_1.default.showBannerAd(false);
                }
                break;
        }
        this._gameState = gameState;
        if (nextState != -1) {
            this.changeGameStatue(nextState);
        }
    };
    MainGameScene.prototype.onNuQiRender = function (cell, index) {
        var data = cell.dataSource;
        cell.getChildByName("img_star")["visible"] = data;
    };
    MainGameScene.prototype.onGridRender = function (cell, index) {
        var data = cell.dataSource;
        var fontGridScrip = cell.getComponent(FontGrid_1.default);
        if (data == null) {
            fontGridScrip.font = null;
            fontGridScrip.clearEffects();
        }
        else {
            fontGridScrip.font = data.text;
            fontGridScrip.addEffect(data.getStuntFontEffect());
            fontGridScrip.quality = data.quality;
        }
    };
    MainGameScene.prototype.onStarRender = function (cell, index) {
        var isShine = cell.dataSource; // 是否点亮
        if (isShine) {
            cell.skin = "map/img_star.png";
        }
        else {
            cell.skin = "map/img_starBg.png";
        }
    };
    MainGameScene.prototype.onMouseDown = function () {
        if (this._gameState == GameState.Playing) {
            this._mouseDownPoint = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
            this._isQuickDrop = false;
        }
    };
    MainGameScene.prototype.onMouseUp = function () {
        if (this._gameState == GameState.Playing) {
            if (this._mouseDownPoint == null) {
                return;
            }
            var absX = Math.abs(Laya.stage.mouseX - this._mouseDownPoint.x);
            var absY = Laya.stage.mouseY - this._mouseDownPoint.y;
            if (absX > 10) {
                if (absY > absX * 2.5) {
                    //竖着移动
                    this._isQuickDrop = true;
                    SoundTool_1.default.playXiaHuaEffect();
                }
                else {
                    this.moveDropingFont(Laya.stage.mouseX < this._mouseDownPoint.x);
                    SoundTool_1.default.playYiDongEffect();
                }
            }
            else if (absY > 25) {
                this._isQuickDrop = true;
                SoundTool_1.default.playXiaHuaEffect();
            }
            this._mouseDownPoint = null;
        }
    };
    MainGameScene.prototype.onEnable = function () {
    };
    MainGameScene.prototype.onDisable = function () {
        if (this._gameState == GameState.Playing)
            this.changeGameStatue(GameState.Pause);
    };
    MainGameScene.prototype.onUpdate = function () {
        var _this = this;
        if (this._gameState == GameState.Playing) {
            //判断当前字符是否不足
            var isEditList_1 = false;
            this.updatePopularGroup();
            //消除产生的漂浮字移动及消除
            if (this._sysDropingFontInfos.length > 0) {
                if (this._sysTickTime > 0) {
                    this._sysTickTime--;
                }
                else {
                    this._sysTickTime = this._maxSysTickTime;
                    var sysDelArr = [];
                    if (this._sysDropingFontInfos.length == this._sysDispelFontInfoStack.length) {
                        this._sysDropingFontInfos = [];
                        if (!this.invokeStuntFont()) {
                            this.dispelCiZu(this._sysDispelFontInfoStack);
                            this._sysDispelFontInfoStack.forEach(function (element) {
                                if (_this.getFontInfo(element.x, element.y) != element) {
                                    return;
                                }
                                _this.dispel(element.x, element.y);
                            });
                            this.checkSysDropFonts();
                            this._sysDispelFontInfoStack = [];
                        }
                    }
                    else {
                        isEditList_1 = true;
                        this._sysDropingFontInfos.forEach(function (element) {
                            if (_this._sysDispelFontInfoStack.indexOf(element) != -1) {
                                return;
                            }
                            if (_this._fonts[element.x][element.y + 1] == null && element.y + 1 < _this.list_grids.repeatY) {
                                //继续下落
                                _this.changeDropFontTo(element.x, element.y + 1, element);
                            }
                            else {
                                //无法下落，执行消除动作
                                _this._sysDispelFontInfoStack.push(element);
                                isEditList_1 = true;
                            }
                        });
                    }
                }
            }
            else {
                //方块状态检测
                if (this._tickTime > 0) {
                    if (this._isQuickDrop && this._tickTime > 1)
                        this._tickTime = 1;
                    this._tickTime--;
                }
                else {
                    this._tickTime = (100 - this._myPlayerInfo.getStarInfo(this._score).speed_rate) * this._maxTickTime / 100;
                    //判断是否有掉落中的字，没有的话，生成字
                    if (this._dropingFontInfo == null) {
                        this._isQuickDrop = false;
                        if (this._fonts[this._startPoint.x][this._startPoint.y] != null) {
                            //游戏结束
                            this.changeGameStatue(GameState.End);
                            return;
                        }
                        else {
                            if (this._nextDropingFontInfo == null) {
                                this.randomNextFont();
                            }
                            this._dropingFontInfo = MapFontInfo_1.default.create({ id: this._nextDropingFontInfo.id });
                            this._dropingFontInfo.isStuntFont = this._nextDropingFontInfo.isStuntFont;
                            // console.log("正在掉落的汉子：");
                            // console.log(this._dropingFontInfo.text);
                            this.guideToGrid();
                            this.setDispelText(this._dropingFontInfo.text);
                            this.randomNextFont();
                            this.updateNextDropingFont();
                            this._dropingFontInfo.x = this._startPoint.x;
                            this._dropingFontInfo.y = this._startPoint.y;
                            this._fonts[this._dropingFontInfo.x][this._dropingFontInfo.y] = this._dropingFontInfo;
                            isEditList_1 = true;
                            this.cacheAll();
                        }
                    }
                    else {
                        if (this._isQuickDrop)
                            this._tickTime = 1;
                        if (this._dropingFontInfo != null) {
                            if (this._fonts[this._dropingFontInfo.x][this._dropingFontInfo.y + 1] == null && this._dropingFontInfo.y + 1 < this.list_grids.repeatY) {
                                //继续下落
                                this.changeDropFontTo(this._dropingFontInfo.x, this._dropingFontInfo.y + 1, this._dropingFontInfo);
                            }
                            else {
                                //无法下落，执行消除动作
                                this._mouseDownPoint = null;
                                this.destroyGuideImgs();
                                var isDispel = false;
                                var cout = void 0;
                                cout = this.dispelCiZu([this._dropingFontInfo]);
                                if (cout == true) {
                                    isDispel = true;
                                }
                                cout = this.dispel(this._dropingFontInfo.x, this._dropingFontInfo.y);
                                if (cout == true) {
                                    isDispel = true;
                                }
                                // if(isDispel == false)
                                // {
                                //     this.setDispelText(this._dropingFontInfo.text);
                                // }
                                this._dropingFontInfo = null;
                            }
                            isEditList_1 = true;
                        }
                    }
                }
            }
            if (isEditList_1) {
                this.renderGridList();
            }
        }
    };
    /**
     * 获取所有非空顶字符
     */
    MainGameScene.prototype.getAllFonts = function () {
        var cout = [];
        for (var i = 0; i < this._fonts.length; i++) {
            for (var j = this._fonts[0].length - 1; j >= 0; j--) {
                if (this._fonts[i][j] != null) {
                    cout.push(this._fonts[i][j]);
                }
            }
        }
        return cout;
    };
    MainGameScene.prototype.cacheAll = function () {
        var _this = this;
        var obj = {};
        this._cacheProperties.forEach(function (element) {
            obj[element] = _this[element];
        });
        obj._wordTexts = [];
        this._words.forEach(function (element) {
            obj._wordTexts.push({ text: element.text, isStuntFont: element.isStuntFont });
        });
        obj._splitFontWordTexts = [];
        this._splitFontWords.forEach(function (element) {
            obj._splitFontWordTexts.push({ text: element.text, isStuntFont: element.isStuntFont });
        });
        obj._splitGroupWordTexts = [];
        this._splitGroupWords.forEach(function (element) {
            obj._splitGroupWordTexts.push({ text: element.text, isStuntFont: element.isStuntFont });
        });
        if (this._dropingFontInfo != null)
            obj._dropingFontInfoText = { text: this._dropingFontInfo.text, isStuntFont: this._dropingFontInfo.isStuntFont };
        if (this._nextDropingFontInfo != null)
            obj._nextDropingFontInfoText = { text: this._nextDropingFontInfo.text, isStuntFont: this._nextDropingFontInfo.isStuntFont };
        obj._sysDispelFontInfoStackPoses = [];
        this._sysDispelFontInfoStack.forEach(function (element) {
            obj._sysDispelFontInfoStackPoses.push(new Laya.Point(element.x, element.y));
        });
        obj._sysDropingFontInfosPoses = [];
        this._sysDropingFontInfos.forEach(function (element) {
            obj._sysDropingFontInfosPoses.push(new Laya.Point(element.x, element.y));
        });
        obj._fontTexts = [];
        for (var i = 0; i < this._fonts.length; i++) {
            obj._fontTexts[i] = [];
            for (var j = 0; j < this._fonts[i].length; j++) {
                if (this._fonts[i][j] == null) {
                    obj._fontTexts[i][j] = null;
                }
                else {
                    obj._fontTexts[i][j] = { text: this._fonts[i][j].text, isStuntFont: this._fonts[i][j].isStuntFont };
                }
            }
        }
        localStorage.setItem("StorageVersion", AppConfig_1.default.version);
        localStorage.setItem("CacheData", JSON.stringify(obj));
    };
    MainGameScene.prototype.restoreAll = function () {
        var _this = this;
        if (this._debugMode) {
            return false;
        }
        var storageVersion = localStorage.getItem("StorageVersion");
        if (storageVersion == AppConfig_1.default.version) {
            var dataStr = localStorage.getItem("CacheData");
            if (dataStr == null) {
                return false;
            }
            try {
                var restoreObj_1 = JSON.parse(dataStr);
                var tempFontInfo_1;
                this._fonts = [];
                for (var i = 0; i < this.list_grids.repeatX; i++) {
                    this._fonts[i] = [];
                    for (var j = 0; j < this.list_grids.repeatY; j++) {
                        if (restoreObj_1._fontTexts[i] == null || restoreObj_1._fontTexts[i][j] == null) {
                            this._fonts[i][j] = null;
                        }
                        else {
                            tempFontInfo_1 = this._fonts[i][j] = MapFontInfo_1.default.create({ text: restoreObj_1._fontTexts[i][j].text });
                            tempFontInfo_1.isStuntFont = restoreObj_1._fontTexts[i][j].isStuntFont;
                            tempFontInfo_1.x = i;
                            tempFontInfo_1.y = j;
                        }
                    }
                }
                this._cacheProperties.forEach(function (element) {
                    _this[element] = restoreObj_1[element];
                });
                this._words = [];
                restoreObj_1._wordTexts.forEach(function (element) {
                    tempFontInfo_1 = MapFontInfo_1.default.create({ text: element.text });
                    if (tempFontInfo_1.text == null)
                        return;
                    tempFontInfo_1.isStuntFont = element.isStuntFont;
                    _this._words.push(tempFontInfo_1);
                });
                this._splitFontWords = [];
                restoreObj_1._splitFontWordTexts.forEach(function (element) {
                    tempFontInfo_1 = MapFontInfo_1.default.create({ text: element.text });
                    if (tempFontInfo_1.text == null)
                        return;
                    tempFontInfo_1.isStuntFont = element.isStuntFont;
                    _this._splitFontWords.push(tempFontInfo_1);
                });
                this._splitGroupWords = [];
                restoreObj_1._splitGroupWordTexts.forEach(function (element) {
                    tempFontInfo_1 = MapFontInfo_1.default.create({ text: element.text });
                    if (tempFontInfo_1.text == null)
                        return;
                    tempFontInfo_1.isStuntFont = element.isStuntFont;
                    _this._splitGroupWords.push(tempFontInfo_1);
                });
                if (restoreObj_1._dropingFontInfoText != null) {
                    this._dropingFontInfo = MapFontInfo_1.default.create({ text: restoreObj_1._dropingFontInfoText.text });
                    if (this._dropingFontInfo.text == null) {
                        return false;
                    }
                    this._dropingFontInfo.isStuntFont = restoreObj_1._dropingFontInfoText.isStuntFont;
                    this.setDispelText(this._dropingFontInfo.text);
                    this._dropingFontInfo.x = this._startPoint.x;
                    this._dropingFontInfo.y = this._startPoint.y;
                }
                else {
                    this.randomNextFont();
                    this._dropingFontInfo = this._nextDropingFontInfo;
                    this._nextDropingFontInfo = null;
                }
                if (restoreObj_1._nextDropingFontInfoText != null)
                    this._nextDropingFontInfo = MapFontInfo_1.default.create({ text: restoreObj_1._nextDropingFontInfoText.text });
                if (this._nextDropingFontInfo == null || this._nextDropingFontInfo.text == null) {
                    this.randomNextFont();
                }
                else {
                    this._nextDropingFontInfo.isStuntFont = restoreObj_1._nextDropingFontInfoText.isStuntFont;
                }
                this._sysDispelFontInfoStack = [];
                restoreObj_1._sysDispelFontInfoStackPoses.forEach(function (element) {
                    tempFontInfo_1 = _this.getFontInfo(element.x, element.y);
                    if (tempFontInfo_1 != null) {
                        _this._sysDispelFontInfoStack.push(tempFontInfo_1);
                    }
                });
                this._sysDropingFontInfos = [];
                restoreObj_1._sysDropingFontInfosPoses.forEach(function (element) {
                    tempFontInfo_1 = _this.getFontInfo(element.x, element.y);
                    if (tempFontInfo_1 != null) {
                        _this._sysDropingFontInfos.push(tempFontInfo_1);
                    }
                });
                this._tickTime = (100 - this._myPlayerInfo.getStarInfo(this._score).speed_rate) * this._maxTickTime / 100;
                this.renderGridList();
                this.refresh();
                return true;
            }
            catch (error) {
                localStorage.setItem("CacheData", null);
                return false;
            }
        }
        return false;
    };
    MainGameScene.prototype.moveDropingFont = function (left) {
        if (this._dropingFontInfo == null) {
            return;
        }
        var minTickTime = 0.3 * (100 - this._myPlayerInfo.getStarInfo(this._score).speed_rate) * this._maxTickTime / 100;
        if (left) {
            if (this._dropingFontInfo.x > 0 && this._fonts[this._dropingFontInfo.x - 1][this._dropingFontInfo.y] == null) {
                this.changeDropFontTo(this._dropingFontInfo.x - 1, this._dropingFontInfo.y);
                this._tickTime = this._tickTime > minTickTime ? this._tickTime : minTickTime;
            }
        }
        else {
            if (this._dropingFontInfo.x < this.list_grids.repeatX - 1 && this._fonts[this._dropingFontInfo.x + 1][this._dropingFontInfo.y] == null) {
                this.changeDropFontTo(this._dropingFontInfo.x + 1, this._dropingFontInfo.y);
                this._tickTime = this._tickTime > minTickTime ? this._tickTime : minTickTime;
            }
        }
        // let targetMc = this.list_grids.getCell(this._dropingFontInfo.y * this.list_grids.repeatX + this._dropingFontInfo.x);
        // let itemWidth = targetMc.width;
        // let point = new Laya.Point(targetMc.x + targetMc.width / 2, targetMc.y + targetMc.height / 2);
        // point = (targetMc.parent as Laya.Sprite).localToGlobal(point);
        // //判断下移到底
        // if(Math.abs(point.x - Laya.stage.mouseX) < itemWidth / 2)
        // {
        //     if(Laya.stage.mouseY - point.y > itemWidth / 2)
        //     {
        //         //移动到底
        //         this._isQuickDrop = true;
        //         // while(this._fonts[this._dropingFontInfo.x][this._dropingFontInfo.y + 1] == null && this._dropingFontInfo.y + 1 < this.list_grids.repeatY)
        //         // {
        //         //     this.changeDropFontTo(this._dropingFontInfo.x, this._dropingFontInfo.y + 1)
        //         // }
        //     }
        // }
        // else 
        // {
        //     if(Laya.stage.mouseX < point.x)
        //     {
        //         //向左移动
        //         if(this._dropingFontInfo.x > 0 && this._fonts[this._dropingFontInfo.x - 1][this._dropingFontInfo.y]  == null)
        //         {
        //             this.changeDropFontTo(this._dropingFontInfo.x - 1, this._dropingFontInfo.y);
        //         }
        //     }
        //     else 
        //     {
        //         //向右一定
        //         if(this._dropingFontInfo.x < this.list_grids.repeatX - 1 && this._fonts[this._dropingFontInfo.x + 1][this._dropingFontInfo.y]  == null)
        //         {
        //             this.changeDropFontTo(this._dropingFontInfo.x + 1, this._dropingFontInfo.y);
        //         }
        //     }
        // }
        // if(isRefreshList)
        // {
        this.renderGridList();
        // }
    };
    //检查消除产生的漂浮字加入列表
    MainGameScene.prototype.checkSysDropFonts = function () {
        for (var i = 0; i < this.list_grids.repeatX; i++) {
            var isAdd = false;
            for (var j = this.list_grids.repeatY - 1; j >= 0; j--) {
                if (this._fonts[i][j] != null && (isAdd || (j + 1 < this.list_grids.repeatY && this._fonts[i][j + 1] == null))) {
                    isAdd = true;
                    if (this._sysDropingFontInfos.indexOf(this._fonts[i][j]) == -1)
                        this._sysDropingFontInfos.push(this._fonts[i][j]);
                }
            }
        }
    };
    //移动正在操作的字
    MainGameScene.prototype.changeDropFontTo = function (x, y, fontInfo) {
        if (fontInfo === void 0) { fontInfo = null; }
        if (y < 0 || x < 0) {
            return;
        }
        if (x >= this.list_grids.repeatX || y >= this.list_grids.repeatY) {
            return;
        }
        if (fontInfo == null) {
            fontInfo = this._dropingFontInfo;
        }
        this._fonts[fontInfo.x][fontInfo.y] = null;
        fontInfo.x = x;
        fontInfo.y = y;
        this._fonts[fontInfo.x][fontInfo.y] = fontInfo;
    };
    //更新文字列表
    MainGameScene.prototype.renderGridList = function () {
        var arr = [];
        for (var j = 0; j < this.list_grids.repeatY; j++) {
            for (var i = 0; i < this.list_grids.repeatX; i++) {
                arr.push(this._fonts[i][j]);
            }
        }
        this.list_grids.dataSource = arr;
    };
    /**
     * 消除汉子
     * @param x x坐标或者mapfontinfo
     * @param y y坐标
     * @param stuntCheck 是否执行技能 默认true
     * @param isHeChengHanZi  是否是合成汉子时候的消除 默认true
     */
    MainGameScene.prototype.dispelFont = function (x, y) {
        if (y === void 0) { y = 0; }
        var dispelFontInfo;
        var indX;
        var indY;
        if (x instanceof MapFontInfo_1.default) {
            dispelFontInfo = x;
            this._fonts[x.x][x.y] = null;
            indX = x.x;
            indY = x.y;
        }
        else {
            dispelFontInfo = this.getFontInfo(x, y);
            if (dispelFontInfo != null)
                this._fonts[x][y] = null;
            indX = x;
            indY = y;
        }
        if (dispelFontInfo != null) {
            var sysInd = this._sysDropingFontInfos.indexOf(dispelFontInfo);
            if (sysInd != -1) {
                this._sysDropingFontInfos.splice(sysInd, 1);
            }
            sysInd = this._sysDispelFontInfoStack.indexOf(dispelFontInfo);
            if (sysInd != -1) {
                this._sysDispelFontInfoStack.splice(sysInd, 1);
            }
            dispelFontInfo.destroyStuntEffect();
        }
    };
    /**
     * 触发技能汉子效果
     */
    MainGameScene.prototype.invokeStuntFont = function () {
        var _this = this;
        var points1 = [];
        var points2 = [];
        var score = 0;
        var tempFontInfo;
        var effectObj = {};
        var pushArrFun = function (x, y, arr) {
            if (effectObj[x + "_" + y] == null) {
                arr.push(new Laya.Point(x, y));
                effectObj[x + "_" + y] = true;
            }
        };
        this._stuntFontsCheckArr1.forEach(function (element) {
            //消除技能格子四周
            if (element.fontInfo != _this.getFontInfo(element.fontInfo.x, element.fontInfo.y)) {
                //技能汉字已经被消除不触发技能
                return;
            }
            pushArrFun(element.fontInfo.x - 1, element.fontInfo.y, points1);
            pushArrFun(element.fontInfo.x + 1, element.fontInfo.y, points1);
            pushArrFun(element.fontInfo.x, element.fontInfo.y - 1, points1);
            pushArrFun(element.fontInfo.x, element.fontInfo.y + 1, points1);
            //消除包含当前字的所有汉子格子
            for (var i = 0; i < _this._fonts.length; i++) {
                for (var j = 0; j < _this._fonts[i].length; j++) {
                    tempFontInfo = _this._fonts[i][j];
                    if (tempFontInfo != null) {
                        if (tempFontInfo.getStructInfos(element.id, false).length > 0) {
                            score += 10;
                            pushArrFun(tempFontInfo.x, tempFontInfo.y, points2);
                        }
                    }
                }
            }
        });
        this._stuntFontsCheckArr2.forEach(function (element) {
            //消除包含当前字的所有汉子格子
            for (var i = 0; i < _this._fonts.length; i++) {
                for (var j = 0; j < _this._fonts[i].length; j++) {
                    tempFontInfo = _this._fonts[i][j];
                    if (tempFontInfo != null) {
                        if (tempFontInfo.getStructInfos(element.id, false).length > 0) {
                            score += 10;
                            pushArrFun(tempFontInfo.x, tempFontInfo.y, points2);
                        }
                    }
                }
            }
        });
        var timeToUpdate;
        if (points1.length > 0) {
            this.playEffectInc();
            timeToUpdate = 700;
            points1.forEach(function (element2) {
                tempFontInfo = _this.getFontInfo(element2.x, element2.y);
                if (tempFontInfo != null) {
                    score += 10;
                    _this.dispelFont(tempFontInfo);
                }
                var tempFontScript = _this.getFontScript(element2.x, element2.y);
                if (tempFontScript != null)
                    tempFontScript.playHeChengEffect();
            });
            Laya.timer.once(500, this, function () {
                var _this = this;
                points1.forEach(function (element3) {
                    var tempFontScript = _this.getFontScript(element3.x, element3.y);
                    if (tempFontScript != null) {
                        tempFontScript.font = null;
                        tempFontScript.clearEffects();
                        tempFontScript.onUpdate();
                    }
                });
            });
            Laya.timer.once(700, this, function () {
                this.renderGridList();
                this.updateScore();
                this.setStar(this._myPlayerInfo.getStarInfo(this._score).star_num);
            });
            Laya.timer.once(850, this, function () {
                this.endEffectInc();
            });
        }
        if (points2.length > 0) {
            this.playEffectInc();
            timeToUpdate = 1000;
            Laya.timer.once(300, this, function () {
                var _this = this;
                points2.forEach(function (element2) {
                    tempFontInfo = _this.getFontInfo(element2.x, element2.y);
                    if (tempFontInfo != null) {
                        _this.dispelFont(tempFontInfo);
                    }
                    var tempFontScript = _this.getFontScript(element2.x, element2.y);
                    if (tempFontScript != null)
                        tempFontScript.playHeChengEffect();
                });
            });
            Laya.timer.once(800, this, function () {
                var _this = this;
                points2.forEach(function (element3) {
                    var tempFontScript = _this.getFontScript(element3.x, element3.y);
                    if (tempFontScript != null) {
                        tempFontScript.font = null;
                        tempFontScript.clearEffects();
                        tempFontScript.onUpdate();
                    }
                });
            });
            Laya.timer.once(1150, this, function () {
                this.endEffectInc();
            });
        }
        this._score += score;
        if (timeToUpdate > 0) {
            Laya.timer.once(timeToUpdate, this, function () {
                this.renderGridList();
                this.updateScore();
                this.setStar(this._myPlayerInfo.getStarInfo(this._score).star_num);
            });
        }
        this._stuntFontsCheckArr1 = [];
        this._stuntFontsCheckArr2 = [];
        return points1.length > 0 || points2.length > 0;
    };
    /**
     * 消除词组
     * @param changeFontInfos 有变更的汉子列表
     */
    MainGameScene.prototype.dispelCiZu = function (changeFontInfos) {
        var _this = this;
        var checkFontTxts = []; //当前所有汉子列表
        for (var j = 0; j < this.list_grids.repeatY; j++) {
            for (var i = 0; i < this.list_grids.repeatX; i++) {
                var tempFontInfo = this.getFontInfo(i, j);
                if (tempFontInfo != null) {
                    var txt = tempFontInfo.text;
                    if (checkFontTxts.indexOf(txt) == -1) {
                        checkFontTxts.push(txt);
                    }
                }
            }
        }
        var checkArr = []; //查找所有屏幕上所有字的词典，找出可能的组合列表
        checkFontTxts.forEach(function (element1) {
            var tempArr = MapFontInfo_1.default.getGroup(element1);
            tempArr.forEach(function (element2) {
                if (checkArr.indexOf(element2) != -1) {
                    return;
                }
                var chars = element2.split("");
                var isFix = true;
                for (var i = 0; i < chars.length; i++) {
                    if (checkFontTxts.indexOf(chars[i]) == -1) {
                        isFix = false;
                        break;
                    }
                }
                if (isFix) {
                    if (element2 == _this._popularGroup) {
                        checkArr.unshift(element2);
                    }
                    else {
                        checkArr.push(element2);
                    }
                }
            });
        });
        //遍历变更列表，寻找可消除的词组并执行消除
        var isDispel = false;
        changeFontInfos.forEach(function (element) {
            if (_this.getFontInfo(element.x, element.y) != element) {
                return;
            }
            var cout = _this.dispelCiZuItem(element.x, element.y, checkArr);
            if (cout == true) {
                isDispel = true;
            }
        });
        return isDispel;
    };
    MainGameScene.prototype.dispelCiZuItem = function (x, y, checkArr) {
        var _this = this;
        var root = this.getFontInfo(x, y);
        if (root == null) {
            return;
        }
        var _loop_1 = function (i) {
            var group = checkArr[i];
            if (group.indexOf(root.text) == -1) {
                return "continue";
            }
            this_1._checkChars = group.split("");
            var aStarInfo = this_1.dispelCiZuItemSure(x, y, null);
            if (aStarInfo != null) {
                //消除词组
                SoundTool_1.default.playXiaoChuEffect();
                this_1.playEffectInc();
                if (group == this_1._popularGroup) {
                    this_1._popularGroup = null;
                }
                // console.log("消除词组：=============================")
                // console.log("词组：" + group)
                var score = 40;
                var points_1 = aStarInfo.getSureList();
                var time_1 = 0;
                var ciZuObj_1 = {};
                points_1.forEach(function (element) {
                    ciZuObj_1[element.x + "_" + element.y] = true;
                    var tempFontScript = _this.getFontScript(element.x, element.y);
                    tempFontScript.playHeChengEffect();
                    var tempFont = _this.getFontInfo(element.x, element.y);
                    if (tempFont != null) {
                        // console.log("point : ("+tempFont.x+","+tempFont.y+","+tempFont.text+")");
                        _this.dispelFont(tempFont);
                        if (tempFont.isStuntFont) {
                            _this._stuntFontsCheckArr2.push({ fontInfo: tempFont, id: tempFont.id });
                        }
                        time_1++;
                    }
                });
                points_1.forEach(function (element) {
                    var tempFont = _this.getFontInfo(element.x - 1, element.y);
                    if (tempFont != null) {
                        _this.dispelFont(tempFont);
                        if (tempFont.isStuntFont) {
                            _this._stuntFontsCheckArr2.push({ fontInfo: tempFont, id: tempFont.id });
                        }
                        time_1++;
                    }
                    tempFont = _this.getFontInfo(element.x + 1, element.y);
                    if (tempFont != null) {
                        _this.dispelFont(tempFont);
                        if (tempFont.isStuntFont) {
                            _this._stuntFontsCheckArr2.push({ fontInfo: tempFont, id: tempFont.id });
                        }
                        time_1++;
                    }
                    tempFont = _this.getFontInfo(element.x, element.y - 1);
                    if (tempFont != null) {
                        _this.dispelFont(tempFont);
                        if (tempFont.isStuntFont) {
                            _this._stuntFontsCheckArr2.push({ fontInfo: tempFont, id: tempFont.id });
                        }
                        time_1++;
                    }
                    tempFont = _this.getFontInfo(element.x, element.y + 1);
                    if (tempFont != null) {
                        _this.dispelFont(tempFont);
                        if (tempFont.isStuntFont) {
                            _this._stuntFontsCheckArr2.push({ fontInfo: tempFont, id: tempFont.id });
                        }
                        time_1++;
                    }
                });
                score += (time_1 * 10);
                this_1._score += score;
                Laya.timer.once(500, this_1, function () {
                    var _this = this;
                    points_1.forEach(function (element) {
                        var tempFontScript = _this.getFontScript(element.x, element.y);
                        tempFontScript.font = null;
                        tempFontScript.clearEffects();
                        tempFontScript.onUpdate();
                    });
                });
                Laya.timer.once(200, this_1, function () {
                    var _this = this;
                    points_1.forEach(function (element) {
                        var tempFontScript;
                        var tempX = element.x - 1;
                        var tempY = element.y;
                        if (ciZuObj_1[tempX + "_" + tempY] != true) {
                            tempFontScript = _this.getFontScript(tempX, tempY);
                            if (tempFontScript != null) {
                                tempFontScript.playHeChengEffect();
                            }
                        }
                        tempX = element.x + 1;
                        tempY = element.y;
                        if (ciZuObj_1[tempX + "_" + tempY] != true) {
                            tempFontScript = _this.getFontScript(tempX, tempY);
                            if (tempFontScript != null) {
                                tempFontScript.playHeChengEffect();
                            }
                        }
                        tempX = element.x;
                        tempY = element.y - 1;
                        if (ciZuObj_1[tempX + "_" + tempY] != true) {
                            tempFontScript = _this.getFontScript(tempX, tempY);
                            if (tempFontScript != null) {
                                tempFontScript.playHeChengEffect();
                            }
                        }
                        tempX = element.x;
                        tempY = element.y + 1;
                        if (ciZuObj_1[tempX + "_" + tempY] != true) {
                            tempFontScript = _this.getFontScript(tempX, tempY);
                            if (tempFontScript != null) {
                                tempFontScript.playHeChengEffect();
                            }
                        }
                    });
                });
                Laya.timer.once(700, this_1, function () {
                    this.setDispelText(group);
                    this.renderGridList();
                    this.updateScore();
                    this.setStar(this._myPlayerInfo.getStarInfo(this._score).star_num);
                });
                Laya.timer.once(850, this_1, function () {
                    this.endEffectInc();
                });
                return { value: true };
            }
        };
        var this_1 = this;
        for (var i = 0; i < checkArr.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return false;
    };
    MainGameScene.prototype.dispelCiZuItemSure = function (x, y, parentAStarInfo) {
        var currentFontInfo = this.getFontInfo(x, y);
        if (currentFontInfo == null) {
            return null;
        }
        var chars = parentAStarInfo == null ? this._checkChars.concat() : parentAStarInfo.chars.concat();
        if (chars.indexOf(currentFontInfo.text) == -1) {
            return null;
        }
        var aStarInfo = new SearchInfo();
        aStarInfo.currentPoint.x = x;
        aStarInfo.currentPoint.y = y;
        aStarInfo.setOpenList(parentAStarInfo == null ? [] : parentAStarInfo.getOpenList().concat());
        aStarInfo.setSureList(parentAStarInfo == null ? [] : parentAStarInfo.getSureList().concat());
        aStarInfo.open(x, y, false);
        aStarInfo.sure(x, y);
        aStarInfo.chars = chars;
        aStarInfo.chars.splice(aStarInfo.chars.indexOf(currentFontInfo.text), 1);
        if (aStarInfo.chars.length == 0) {
            return aStarInfo;
        }
        if (!aStarInfo.isOpen(x - 1, y) && !aStarInfo.isSure(x - 1, y)) {
            aStarInfo.open(x - 1, y);
        }
        if (!aStarInfo.isOpen(x + 1, y) && !aStarInfo.isSure(x + 1, y)) {
            aStarInfo.open(x + 1, y);
        }
        if (!aStarInfo.isOpen(x, y - 1) && !aStarInfo.isSure(x, y - 1)) {
            aStarInfo.open(x, y - 1);
        }
        if (!aStarInfo.isOpen(x, y + 1) && !aStarInfo.isSure(x, y + 1)) {
            aStarInfo.open(x, y + 1);
        }
        var openList = aStarInfo.getOpenList();
        for (var i = 0; i < openList.length; i++) {
            var element = openList[i];
            var cout = this.dispelCiZuItemSure(element.x, element.y, aStarInfo);
            if (cout != null) {
                return cout;
            }
        }
        return null;
    };
    /**
     * 消字
     * @param x
     * @param y
     */
    MainGameScene.prototype.dispel = function (x, y) {
        var targetFontInfo = this.getFontInfo(x, y);
        if (targetFontInfo == null)
            return false;
        var canHeChengFontInfos = targetFontInfo.canHeChengFontInfos;
        if (canHeChengFontInfos.length == 0)
            return false;
        var popularGroup = this._popularGroup;
        if (popularGroup != null) {
            canHeChengFontInfos.sort(function (a, b) {
                if (popularGroup.indexOf(a.text) != -1) {
                    return -1;
                }
                else if (popularGroup.indexOf(b.text) != -1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        //遍历变更列表，寻找可消除的词组并执行消除
        var hasHeCheng = false;
        for (var i = 0; i < canHeChengFontInfos.length; i++) {
            if (hasHeCheng) {
                break;
            }
            var tempFontInfo = canHeChengFontInfos[i];
            var structInfoList = tempFontInfo.structInfo.split(",");
            for (var j = 0; j < structInfoList.length; j++) {
                var structList = structInfoList[j].split("_");
                if (structList.length > 1 && structList.indexOf(targetFontInfo.id.toString()) != -1) {
                    var cout = this.dispelItem(targetFontInfo.x, targetFontInfo.y, structList, tempFontInfo.id);
                    if (cout) {
                        hasHeCheng = true;
                        break;
                    }
                }
            }
        }
        return hasHeCheng;
    };
    MainGameScene.prototype.dispelItem = function (x, y, checkArr, fontId) {
        var _this = this;
        var root = this.getFontInfo(x, y);
        if (root == null) {
            return;
        }
        this._checkIds = checkArr;
        var searchInfo = this.dispelItemSure(x, y, null);
        if (searchInfo != null) {
            //消除并合成汉子
            SoundTool_1.default.playHeChengEffect();
            this.playEffectInc();
            var maxQuality_1 = 0;
            var points = searchInfo.getSureList();
            points.forEach(function (element) {
                var tempFontGrid = _this.getFontScript(element.x, element.y);
                var tempFontInfo = _this.getFontInfo(element.x, element.y);
                if (maxQuality_1 < tempFontInfo.quality) {
                    maxQuality_1 = tempFontInfo.quality;
                }
                if (tempFontGrid != null) {
                    tempFontGrid.playHeChengEffect();
                    // console.log("消除格子: ("+element.x+","+element.y+")");
                }
            });
            var coutFontInfo_1 = MapFontInfo_1.default.create({ id: fontId });
            this.setDispelText(coutFontInfo_1.text);
            coutFontInfo_1.x = x;
            coutFontInfo_1.y = y;
            coutFontInfo_1.quality = maxQuality_1 + 1;
            var targetCell = this.getFontCell(x, y);
            var targetPoint_1 = new Laya.Point(targetCell.x, targetCell.y);
            Laya.timer.once(500, this, function (par_points) {
                var _this = this;
                par_points.forEach(function (element) {
                    var tempFontInfo = _this.getFontInfo(element.x, element.y);
                    if (tempFontInfo == null)
                        return;
                    if (element.x != x || element.y != y) {
                        var moveStartCell = _this.getFontCell(element.x, element.y);
                        var moveStartFontGridScript = _this.getFontScript(element.x, element.y);
                        moveStartFontGridScript.font = null;
                        moveStartFontGridScript.clearEffects();
                        var moveCell = Laya.Pool.getItemByCreateFun("FontGrid", _this.prefab_fontGrid.create, _this.prefab_fontGrid);
                        moveCell["x"] = moveStartCell["x"];
                        moveCell["y"] = moveStartCell["y"];
                        var moveFontGridScript = moveCell.getComponent(FontGrid_1.default);
                        moveFontGridScript.font = tempFontInfo.text;
                        moveFontGridScript.addEffect(tempFontInfo.getStuntFontEffect());
                        moveFontGridScript.onUpdate();
                        _this.list_grids.addChild(moveCell);
                        Laya.Tween.to(moveCell, { x: targetPoint_1.x, y: targetPoint_1.y }, 100, null, Laya.Handler.create(_this, function (targetMc) {
                            targetMc.destroy(true);
                        }, [moveCell]));
                    }
                    _this.dispelFont(tempFontInfo);
                    if (tempFontInfo && tempFontInfo.isStuntFont) {
                        _this._stuntFontsCheckArr1.push({ fontInfo: coutFontInfo_1, id: tempFontInfo.id });
                    }
                });
            }, [points]);
            var score = 10;
            var time = points.length;
            score += 10 * time;
            this._score += score;
            ControllerMgr_1.default.getInstance(TipController_1.default).showLeftBottomTip("+" + score);
            Laya.timer.once(550, this, function () {
                this._fonts[x][y] = coutFontInfo_1;
                var targetFontScript = this.getFontScript(x, y);
                targetFontScript.font = coutFontInfo_1.text;
                targetFontScript.addEffect(coutFontInfo_1.getStuntFontEffect());
                this.updateScore();
                this.setStar(this._myPlayerInfo.getStarInfo(this._score).star_num);
                this._nuQi++;
                this.updateNuQi();
            });
            Laya.timer.once(700, this, function () {
                this.endEffectInc();
            });
            // console.log("合成汉子：=============================");
            // console.log("("+coutFontInfo.x+","+coutFontInfo.y+","+coutFontInfo.text+")");
            this._sysDropingFontInfos.push(coutFontInfo_1);
            // console.log("======================================")
            return true;
        }
        return false;
    };
    MainGameScene.prototype.dispelItemSure = function (x, y, parentAStarInfo) {
        var currentFontInfo = this.getFontInfo(x, y);
        if (currentFontInfo == null) {
            return null;
        }
        var chars = parentAStarInfo == null ? this._checkIds.concat() : parentAStarInfo.chars.concat();
        if (chars.indexOf(currentFontInfo.id.toString()) == -1) {
            return null;
        }
        var aStarInfo = new SearchInfo();
        aStarInfo.currentPoint.x = x;
        aStarInfo.currentPoint.y = y;
        aStarInfo.setOpenList(parentAStarInfo == null ? [] : parentAStarInfo.getOpenList().concat());
        aStarInfo.setSureList(parentAStarInfo == null ? [] : parentAStarInfo.getSureList().concat());
        aStarInfo.open(x, y, false);
        aStarInfo.sure(x, y);
        aStarInfo.chars = chars;
        aStarInfo.chars.splice(aStarInfo.chars.indexOf(currentFontInfo.id.toString()), 1);
        if (aStarInfo.chars.length == 0) {
            return aStarInfo;
        }
        if (!aStarInfo.isOpen(x - 1, y) && !aStarInfo.isSure(x - 1, y)) {
            aStarInfo.open(x - 1, y);
        }
        if (!aStarInfo.isOpen(x + 1, y) && !aStarInfo.isSure(x + 1, y)) {
            aStarInfo.open(x + 1, y);
        }
        if (!aStarInfo.isOpen(x, y - 1) && !aStarInfo.isSure(x, y - 1)) {
            aStarInfo.open(x, y - 1);
        }
        if (!aStarInfo.isOpen(x, y + 1) && !aStarInfo.isSure(x, y + 1)) {
            aStarInfo.open(x, y + 1);
        }
        var openList = aStarInfo.getOpenList();
        for (var i = 0; i < openList.length; i++) {
            var element = openList[i];
            var cout = this.dispelItemSure(element.x, element.y, aStarInfo);
            if (cout != null) {
                return cout;
            }
        }
        return null;
    };
    MainGameScene.prototype.destroyGuideImgs = function () {
        for (var tempProperty in this._guideImgs) {
            var tempImg = this._guideImgs[tempProperty];
            Laya.timer.clearAll(tempImg);
            Laya.Tween.clearAll(tempImg);
            tempImg.destroy(true);
        }
        this._guideImgs = {};
    };
    /**
     * 循环所有顶格，显示跟当前飘落的汉子有关联的格子，即可组成词语或者和合成汉子的格子
     */
    MainGameScene.prototype.guideToGrid = function () {
        var _this = this;
        for (var tempProperty in this._guideImgs) {
            var tempImg = this._guideImgs[tempProperty];
            Laya.timer.clearAll(tempImg);
            Laya.Tween.clearAll(tempImg);
            tempImg.destroy(true);
        }
        this._guideImgs = {};
        var rate = Math.random() * 100;
        if (rate > this._guideRate) {
            this._guideRate = Math.min(this._guideRate + 1, 5);
            return;
        }
        var dropingFontCanHeChengFontInfos = this._dropingFontInfo.canHeChengFontInfos;
        var dropingFontCanHeChengGroups = this._dropingFontInfo.canHeChengGroups;
        var topFontInfos = this.getTopFontInfos();
        var points = [];
        topFontInfos.forEach(function (tempFontInfo) {
            dropingFontCanHeChengGroups.forEach(function (tempGroup) {
                if (tempGroup.length != 2) {
                    return;
                }
                var groupArr = tempGroup.split("");
                groupArr.splice(groupArr.indexOf(_this._dropingFontInfo.text), 1);
                if (groupArr.indexOf(tempFontInfo.text) != -1) {
                    //可合成词组
                    points.push(new Laya.Point(tempFontInfo.x, tempFontInfo.y));
                    return;
                }
            });
            dropingFontCanHeChengFontInfos.forEach(function (tempMergeFontInfo) {
                var structInfos = tempMergeFontInfo.getStructInfos(tempFontInfo.id);
                for (var i = 0; i < structInfos.length; i++) {
                    var tempStruckInfo = structInfos[i];
                    var tempStruckArr = tempStruckInfo.split("_");
                    if (tempStruckArr.length != 2) {
                        continue;
                    }
                    tempStruckArr.splice(tempStruckArr.indexOf(tempFontInfo.id.toString()), 1);
                    if (tempStruckArr.indexOf(_this._dropingFontInfo.id.toString()) != -1) {
                        //可合成汉子
                        points.push(new Laya.Point(tempFontInfo.x, tempFontInfo.y));
                        return;
                    }
                }
            });
        });
        if (points.length > 0) {
            this._guideRate = 0;
            points.forEach(function (element) {
                if (_this._guideImgs[element.x + "-" + element.y] != null) {
                    return;
                }
                var tempGrid = _this.getFontCell(element.x, element.y);
                var tempImg = new Laya.Image("map/tz_jiantou.png");
                tempImg.scaleX = tempImg.scaleY = 0.7;
                tempImg.rotation = 90;
                tempImg.x = 75;
                tempImg.y = -75;
                tempGrid.addChild(tempImg);
                _this._guideImgs[element.x + "-" + element.y] = tempImg;
                Laya.timer.loop(1000, tempImg, function (par_img) {
                    var targetY = par_img.y == -75 ? -85 : -75;
                    Laya.Tween.to(par_img, { y: targetY }, 750);
                }, [tempImg]);
            });
        }
    };
    MainGameScene.prototype.getFontInfo = function (x, y) {
        if (this._fonts[x] == null) {
            return null;
        }
        return this._fonts[x][y];
    };
    MainGameScene.prototype.getFontCell = function (x, y) {
        if (y < 0 || y >= this.list_grids.repeatY || x < 0 || x >= this.list_grids.repeatX) {
            return null;
        }
        return this.list_grids.getCell(y * this.list_grids.repeatX + x);
    };
    MainGameScene.prototype.getFontScript = function (x, y) {
        var fontCell = this.getFontCell(x, y);
        if (fontCell == null)
            return null;
        return fontCell.getComponent(FontGrid_1.default);
    };
    //信息更新
    MainGameScene.prototype.refresh = function () {
        this.setStar(this._myPlayerInfo.getStarInfo(this._score).star_num);
        this.txt_playerName.text = this._myPlayerInfo.name;
        this.updateNextDropingFont();
        this.updateScore();
        this.updatePopularGroup();
        this.updateNuQi();
    };
    MainGameScene.prototype.updateScore = function () {
        this.txt_score.text = this._score.toString();
    };
    MainGameScene.prototype.updatePopularGroup = function () {
        if (this._popularGroup == null) {
            var bank = MapFontInfo_1.default.DataSource["bank"];
            this._popularGroup = bank[Math.floor(Math.random() * bank.length)];
            this.heCiSplitTimes = 0;
        }
        if (this._popularGroup != null) {
            this.txt_popularGroup.text = this._popularGroup;
            this.img_popularGroupBg.height = this.txt_popularGroup.displayHeight + 16;
        }
    };
    MainGameScene.prototype.updateNextDropingFont = function () {
        if (this._nextDropingFontInfo == null) {
            this.txt_nextFont.text = "";
        }
        else {
            this.txt_nextFont.text = this._nextDropingFontInfo.text;
        }
    };
    MainGameScene.prototype.setDispelText = function (text) {
        Laya.Tween.clearAll(this.mc_dispelText);
        this.mc_dispelText.scaleX = this.mc_dispelText.scaleY = 0.4;
        this.txt_dispelText.text = text;
        switch (text.length) {
            case 1:
                this.txt_dispelText.fontSize = 120;
                this.txt_dispelText.size(120, 120);
                break;
            case 2:
                this.txt_dispelText.fontSize = 60;
                this.txt_dispelText.size(120, 60);
                break;
            case 3:
                this.txt_dispelText.fontSize = 40;
                this.txt_dispelText.size(120, 40);
                break;
            case 4:
                this.txt_dispelText.fontSize = 30;
                this.txt_dispelText.size(120, 30);
                break;
        }
        Laya.Tween.to(this.mc_dispelText, { scaleX: 1, scaleY: 1 }, 300);
    };
    MainGameScene.prototype.setStar = function (star) {
        var list = [];
        while (star > 0 || list.length < 5) {
            if (star > 0)
                list.push(true);
            else
                list.push(false);
            star--;
        }
        this.list_star.dataSource = list;
    };
    MainGameScene.prototype.updateNuQi = function () {
        if (this._nuQi >= 13) {
            //触发怒气，随机消除一行一列
            var fontsArr = this.getAllFonts();
            if (fontsArr.length > 0) {
                var score = 100;
                var nuQiFontInfo = this.getRandomElement(fontsArr);
                var arr = [];
                for (var i_1 = 0; i_1 < this.list_grids.repeatX; i_1++) {
                    if (this._fonts[i_1][nuQiFontInfo.y] != null) {
                        score += 10;
                    }
                    arr.push(new Laya.Point(i_1, nuQiFontInfo.y));
                }
                for (var i_2 = 0; i_2 < this.list_grids.repeatY; i_2++) {
                    if (i_2 != nuQiFontInfo.x) {
                        arr.push(new Laya.Point(nuQiFontInfo.x, i_2));
                        if (this._fonts[nuQiFontInfo.x][i_2] != null) {
                            score += 10;
                        }
                    }
                }
                this._score += score;
                SoundTool_1.default.playTeJiEffect();
                this.playNuQiEffect(arr);
                this._nuQi = 0;
            }
        }
        var list = [];
        var i = this._nuQi;
        while (i > 0 || list.length < 13) {
            if (i > 0)
                list.push(true);
            else
                list.push(false);
            i--;
        }
        list = list.reverse();
        this.list_nuQi.dataSource = list;
    };
    MainGameScene.prototype.playNuQiEffect = function (points) {
        var _this = this;
        this.playEffectInc();
        points.forEach(function (element) {
            var tempFontGrid = _this.getFontScript(element.x, element.y);
            if (tempFontGrid != null) {
                tempFontGrid.playHeChengEffect();
                // console.log("怒气消除: ("+element.x+","+element.y+")");
            }
        });
        Laya.timer.once(500, this, function () {
            var _this = this;
            points.forEach(function (element) {
                var tempFontInfo = _this.getFontInfo(element.x, element.y);
                if (tempFontInfo == null) {
                    return;
                }
                _this.dispelFont(tempFontInfo);
                if (tempFontInfo.isStuntFont) {
                    _this._stuntFontsCheckArr1.push({ fontInfo: tempFontInfo, id: tempFontInfo.id });
                }
            });
            this.renderGridList();
        });
        Laya.timer.once(650, this, function () {
            this.endEffectInc();
            this.updateScore();
            this.setStar(this._myPlayerInfo.getStarInfo(this._score).star_num);
            this._nuQi++;
        });
    };
    MainGameScene.prototype.randomNextFont = function () {
        if (this._debugMode) {
            var txt = this._debugDropFonts.shift();
            this._nextDropingFontInfo = MapFontInfo_1.default.create({ text: txt });
            if (this._nextDropingFontInfo.text != null) {
                return;
            }
        }
        if (Math.random() * 100 > this.buShouRate) {
            this.buShouRate = Math.min(this.buShouRate + 1, 5);
        }
        else {
            this.buShouRate = 0;
            var txt = this.getRandomElement(MapFontInfo_1.default.DataSource["stunt_font"]);
            this._nextDropingFontInfo = MapFontInfo_1.default.create({ text: txt });
            if (this._nextDropingFontInfo.text != null) {
                this._nextDropingFontInfo.isStuntFont = true;
                return;
            }
        }
        if (this._guideDropFonts.length > 0) {
            var txt = this._guideDropFonts.shift();
            this._nextDropingFontInfo = MapFontInfo_1.default.create({ text: txt });
            if (this._nextDropingFontInfo.text != null) {
                return;
            }
        }
        if (this._splitFontWords.length > 0) {
            this._nextDropingFontInfo = this.getRandomElement(this._splitFontWords);
            this._splitFontWords.splice(this._splitFontWords.indexOf(this._nextDropingFontInfo), 1);
            if (this._nextDropingFontInfo != null) {
                return;
            }
        }
        if (this._splitGroupWords.length > 0) {
            this._nextDropingFontInfo = this.getRandomElement(this._splitGroupWords);
            this._splitGroupWords.splice(this._splitGroupWords.indexOf(this._nextDropingFontInfo), 1);
            if (this._nextDropingFontInfo != null) {
                return;
            }
        }
        //根据当前格子数以及当前星级 获得一个困难系数 比如是50
        var kunNan = this.getNanDuXiShu() * this._myPlayerInfo.getStarInfo(this._score).split_rate;
        var result = Math.min(100, Math.floor(this.heCizuRate * kunNan / 10000));
        if (this.getRandomResult(result)) { //随机到出左边词组相关联汉字
            this.hanZiRate += 10; // 接下来出现无关联汉字概率加10
            this.ciZuRate += 10; // 接下来出现无关联汉字并与5列能合成词的概率加10
            this.heCizuRate = 10;
            if (this._words.length == 0) {
                this.heCiSplitTimes++;
                this._words = this.splitGroupToFontInfos(this._popularGroup, null, this.heCiSplitTimes > 2 ? "special" : "commen");
            }
            this._nextDropingFontInfo = this.getRandomElement(this._words);
            this._words.splice(this._words.indexOf(this._nextDropingFontInfo), 1);
            if (this._nextDropingFontInfo != null) {
                return;
            }
        }
        this.heCizuRate += 15;
        var topFontInfos = this.getTopFontInfos();
        if (topFontInfos.length > 0) {
            var topFontInfo = this.getRandomElement(topFontInfos);
            if (topFontInfo.canHeChengFont && this.getRandomResult(this.hanZiRate * kunNan / 10000)) {
                //随机到要进行可汉字拆分
                this.hanZiRate = 20;
                this.ciZuRate += 10;
                var fontInfos = topFontInfo.canHeChengFontInfos;
                var splitFontInfo = this.getRandomElement(fontInfos);
                this._splitFontWords = this.splitFontToFontInfos(splitFontInfo, topFontInfo.id);
                this._nextDropingFontInfo = this.getRandomElement(this._splitFontWords);
                this._splitFontWords.splice(this._splitFontWords.indexOf(this._nextDropingFontInfo), 1);
                if (this._nextDropingFontInfo != null) {
                    return;
                }
            }
            if (topFontInfo.canHeChengGroup && this.getRandomResult(this.ciZuRate * kunNan / 10000)) {
                //随机到要进行拆分词组
                this.hanZiRate += 15;
                this.ciZuRate = 10;
                var groups = topFontInfo.canHeChengGroups;
                var splitGroup = this.getRandomElement(groups);
                this._splitGroupWords = this.splitGroupToFontInfos(splitGroup, topFontInfo.text, "sp");
                this._nextDropingFontInfo = this.getRandomElement(this._splitGroupWords);
                this._splitGroupWords.splice(this._splitGroupWords.indexOf(this._nextDropingFontInfo), 1);
                if (this._nextDropingFontInfo != null) {
                    return;
                }
            }
        }
        this.ciZuRate += 10;
        this.hanZiRate += 15;
        //随机从汉字库抽一个汉字
        var fontDataArr = this.getRandomElement(MapFontInfo_1.default.DataSource["font"]);
        var mapFontInfo = MapFontInfo_1.default.create();
        mapFontInfo.setDataByValueArr(fontDataArr);
        this._nextDropingFontInfo = mapFontInfo;
    };
    MainGameScene.prototype.getTopFontInfos = function () {
        var cout = [];
        var font = null;
        for (var i = 0; i < this.list_grids.repeatX; i++) {
            font = null;
            for (var j = 0; j < this.list_grids.repeatY; j++) {
                if (this._fonts[i][j] != null) {
                    font = this._fonts[i][j];
                    break;
                }
            }
            if (font != null) {
                cout.push(font);
            }
        }
        return cout;
    };
    /**
     *
     * @param str 需要拆分的字符串
     * @param splitType 拆分方式 commen随机拆分 spcial不拆分
     */
    MainGameScene.prototype.splitGroupToFontInfos = function (str, removeFontText, splitType) {
        var _this = this;
        if (removeFontText === void 0) { removeFontText = null; }
        if (splitType === void 0) { splitType = "commen"; }
        var cout = [];
        str.split('').forEach(function (element) {
            if (element == removeFontText) {
                return;
            }
            var fontInfo = MapFontInfo_1.default.create({ text: element });
            if (fontInfo.id == null) {
                console.log("lack font:" + element);
                return;
            }
            if (splitType == "commen") {
                cout = cout.concat(_this.splitFontToFontInfos(fontInfo, null, splitType));
            }
            else {
                cout.push(fontInfo);
            }
        });
        return cout;
    };
    MainGameScene.prototype.splitFontToFontInfos = function (fontTxt, removeFontId, splitType) {
        if (removeFontId === void 0) { removeFontId = null; }
        if (splitType === void 0) { splitType = "commen"; }
        var fontInfo;
        if (fontTxt instanceof MapFontInfo_1.default) {
            fontInfo = fontTxt;
        }
        else {
            fontInfo = MapFontInfo_1.default.create({ text: fontTxt });
        }
        if (splitType != "commen") {
            return [fontInfo];
        }
        var cout = [];
        var structInfos = fontInfo.structInfo.split(",");
        var structInfo = structInfos[Math.floor(Math.random() * structInfos.length)];
        if (structInfo == fontInfo.id.toString()) {
            cout.push(fontInfo);
        }
        else {
            structInfo.split("_").forEach(function (element2) {
                if (element2 == "" || (removeFontId != null && element2 == removeFontId.toString())) {
                    return;
                }
                var splitFontInfo = MapFontInfo_1.default.create({ id: element2 });
                if (splitFontInfo.id == null) {
                    console.log("lack font id:" + element2);
                    return;
                }
                cout.push(splitFontInfo);
            });
        }
        return cout;
    };
    MainGameScene.prototype.getRandomResult = function (val) {
        if (Math.floor(Math.random() * 100) < val) {
            return true;
        }
        return false;
    };
    /**
     * 获取难度系数
     */
    MainGameScene.prototype.getNanDuXiShu = function () {
        var fontGridNum = 0;
        for (var i = 0; i < this.list_grids.repeatX; i++) {
            for (var j = 0; j < this.list_grids.repeatY; j++) {
                if (this._fonts[i][j] != null) {
                    fontGridNum += this.list_grids.repeatY - j;
                    break;
                }
            }
        }
        return MapFontInfo_1.default.DataSource["degree_difficulty"][fontGridNum];
    };
    MainGameScene.prototype.getRandomElement = function (arr) {
        if (arr.length == 0)
            return null;
        return arr[Math.floor(Math.random() * arr.length)];
    };
    MainGameScene.prototype.playEffectInc = function () {
        this._playerEffectInd++;
        this.changeGameStatue(GameState.EffectPause);
    };
    MainGameScene.prototype.endEffectInc = function () {
        this._playerEffectInd--;
        if (this._playerEffectInd < 0) {
            this._playerEffectInd = 0;
        }
        if (this._playerEffectInd == 0 && this._gameState == GameState.EffectPause) {
            this.changeGameStatue(GameState.Playing);
            this.checkSysDropFonts();
            this._sysDispelFontInfoStack = [];
            if (this._sysDropingFontInfos.length == 0) {
                this.invokeStuntFont();
            }
        }
    };
    return MainGameScene;
}(SceneBase_1.default));
exports.default = MainGameScene;
var SearchInfo = /** @class */ (function () {
    function SearchInfo() {
        this.currentPoint = new Laya.Point();
        this._openList = [];
        this._openObj = {};
        this._sureList = [];
        this._sureObj = {};
    }
    SearchInfo.prototype.setOpenList = function (points) {
        var _this = this;
        points.forEach(function (element) {
            _this.open(element.x, element.y);
        });
    };
    SearchInfo.prototype.getOpenList = function () {
        return this._openList;
    };
    SearchInfo.prototype.setSureList = function (points) {
        var _this = this;
        points.forEach(function (element) {
            _this.sure(element.x, element.y);
        });
    };
    SearchInfo.prototype.getSureList = function () {
        return this._sureList;
    };
    SearchInfo.prototype.open = function (x, y, isOpen) {
        if (isOpen === void 0) { isOpen = true; }
        var key = x.toString() + "_" + y.toString();
        if (isOpen) {
            var point = new Laya.Point(x, y);
            this._openList.push(point);
            this._openObj[key] = point;
        }
        else {
            if (this._openObj[key] != null) {
                this._openList.splice(this._openList.indexOf(this._openObj[key]), 1);
                delete this._openObj[key];
            }
        }
    };
    SearchInfo.prototype.isOpen = function (x, y) {
        var key = x.toString() + "_" + y.toString();
        return this._openObj[key] != null;
    };
    SearchInfo.prototype.sure = function (x, y) {
        var key = x.toString() + "_" + y.toString();
        var point = new Laya.Point(x, y);
        this._sureList.push(point);
        this._sureObj[key] = point;
    };
    SearchInfo.prototype.isSure = function (x, y) {
        var key = x.toString() + "_" + y.toString();
        return this._sureObj[key] != null;
    };
    return SearchInfo;
}());

},{"../../AppConfig":1,"../controller/ControllerMgr":12,"../controller/PlayerController":13,"../controller/TipController":14,"../model/MapFontInfo":15,"../prefeb/FontGrid":19,"../prefeb/GameResult":20,"../prefeb/GameSetting":21,"../prefeb/StartGame":23,"../tool/NativeBridge4399":29,"../tool/SoundTool":30,"./SceneBase":27}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("../../GameConfig");
var WXTool_1 = require("../tool/WXTool");
var SceneMgr_1 = require("./SceneMgr");
var SceneBase = /** @class */ (function (_super) {
    __extends(SceneBase, _super);
    function SceneBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneBase.prototype.onAwake = function () {
        SceneMgr_1.default.curSceneScript = this;
        this.createWxOpenDataViewer();
        var arr = Object.getOwnPropertyNames(this.owner);
        var self = this;
        arr.forEach(function (element) {
            if (element.indexOf("_") == -1) {
                return;
            }
            var tempPropertyStr = element.toString();
            var tempPropertyList = tempPropertyStr.split("_");
            switch (tempPropertyList[0]) {
                case "list":
                case "txt":
                case "img":
                case "btn":
                case "mc":
                    self[tempPropertyStr] = self.owner[tempPropertyStr];
                    break;
                default:
                    break;
            }
        });
    };
    SceneBase.prototype.addPopUp = function (sign, content, isCenter, isShowAlphaSpr, isEnableAlphaClose) {
        if (isCenter === void 0) { isCenter = true; }
        if (isShowAlphaSpr === void 0) { isShowAlphaSpr = true; }
        if (isEnableAlphaClose === void 0) { isEnableAlphaClose = false; }
        this._popUpSign = sign;
        this._popUpContent = content;
        if (this._popUpSpr == null) {
            this._popUpSpr = new Laya.Sprite();
            Laya.stage.addChild(this._popUpSpr);
        }
        else {
            this._popUpSpr.visible = true;
        }
        if (isCenter) {
            if (content instanceof Laya.Sprite) {
                content.x = (GameConfig_1.default.width - content.width) / 2;
                content.y = (GameConfig_1.default.height - content.height) / 2;
            }
            else {
                content.centerX = 0;
                content.centerY = 0;
            }
        }
        if (isShowAlphaSpr) {
            if (this._alphaSpr == null) {
                this._alphaSpr = new Laya.Sprite();
                this._alphaSpr.width = GameConfig_1.default.width;
                this._alphaSpr.height = GameConfig_1.default.height;
                this._alphaSpr.graphics.drawRect(0, 0, GameConfig_1.default.width, GameConfig_1.default.height, "#000000");
                this._alphaSpr.alpha = 0.4;
                this._popUpSpr.addChild(this._alphaSpr);
            }
            if (isEnableAlphaClose) {
                this._alphaSpr.on(Laya.Event.CLICK, this, this.hidePopUp);
            }
        }
        else if (this._alphaSpr) {
            this._alphaSpr.visible = false;
        }
        this._popUpSpr.addChild(this._popUpContent);
    };
    SceneBase.prototype.hidePopUp = function () {
        if (this._popUpSpr) {
            this._popUpSpr.visible = false;
        }
        if (this._popUpContent) {
            if (this._popUpContent == this._dataViewer) {
                this._popUpContent.visible = false;
            }
            else {
                this._popUpContent.destroy();
            }
        }
        this._popUpSign = null;
    };
    SceneBase.prototype.addDialog = function (content, isCenter, isShowAlphaSpr, isEnableAlphaClose) {
        if (isCenter === void 0) { isCenter = true; }
        if (isShowAlphaSpr === void 0) { isShowAlphaSpr = true; }
        if (isEnableAlphaClose === void 0) { isEnableAlphaClose = false; }
        this._dialogContent = content;
        if (this._dialogSpr == null) {
            this._dialogSpr = new Laya.Sprite();
            Laya.stage.addChild(this._dialogSpr);
        }
        else {
            this._dialogSpr.visible = true;
        }
        if (isCenter) {
            content.x = (GameConfig_1.default.width - content.width) / 2;
            content.y = (GameConfig_1.default.height - content.height) / 2;
        }
        if (isShowAlphaSpr) {
            if (this._alphaDialogSpr == null) {
                this._alphaDialogSpr = new Laya.Sprite();
                this._alphaDialogSpr.width = GameConfig_1.default.width;
                this._alphaDialogSpr.height = GameConfig_1.default.height;
                this._alphaDialogSpr.graphics.drawRect(0, 0, GameConfig_1.default.width, GameConfig_1.default.height, "#000000");
                this._alphaDialogSpr.alpha = 0.4;
                this._alphaDialogSpr.mouseEnabled = true;
                this._alphaDialogSpr.mouseThrough = false;
                this._dialogSpr.addChild(this._alphaDialogSpr);
            }
            if (isEnableAlphaClose) {
                this._alphaDialogSpr.on(Laya.Event.CLICK, this, this.hideDialog);
            }
        }
        else if (this._alphaDialogSpr) {
            this._alphaDialogSpr.visible = false;
        }
        this._dialogSpr.addChild(this._dialogContent);
    };
    SceneBase.prototype.hideDialog = function () {
        if (this._dialogSpr) {
            this._dialogSpr.visible = false;
        }
        if (this._dialogContent) {
            if (this._dialogContent == this._dataViewer) {
                this._dialogContent.visible = false;
                WXTool_1.default.showAllBtn();
            }
            else {
                this._dialogContent.destroy();
            }
        }
    };
    SceneBase.prototype.createWxOpenDataViewer = function () {
        if (this._dataViewer == null) {
            this._dataViewer = new Laya.WXOpenDataViewer();
            this._dataViewer.width = 610;
            this._dataViewer.height = 757;
            this._dataViewer.visible = false;
        }
    };
    SceneBase.prototype.showRank = function () {
        this._dataViewer.visible = true;
        this._dataViewer.postMsg({ cmd: "refreshRankList" });
        this.addDialog(this._dataViewer, true, true, true);
        WXTool_1.default.hideAllBtn();
    };
    return SceneBase;
}(Laya.Script));
exports.default = SceneBase;

},{"../../GameConfig":3,"../tool/WXTool":31,"./SceneMgr":28}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SceneMgr = /** @class */ (function (_super) {
    __extends(SceneMgr, _super);
    function SceneMgr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SceneMgr;
}(Laya.Script));
exports.default = SceneMgr;

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NativeBridge4399 = /** @class */ (function (_super) {
    __extends(NativeBridge4399, _super);
    function NativeBridge4399() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeBridge4399.showBannerAd = function (bo) {
        var os = Laya.Browser.window.conchConfig.getOS();
        var bridge;
        var obj = {};
        if (os == "Conch-ios") {
            bridge = Laya.Browser.window.PlatformClass.createClass("JSBridge"); //创建脚步代理
        }
        else if (os == "Conch-android") {
            //需要完整的类路径，注意与iOS的不同
            bridge = Laya.Browser.window.PlatformClass.createClass("demo.JSBridge"); //创建脚步代理
        }
        if (os == "Conch-ios") {
            //iOS注意函数签名，注意与Android的不同
            bridge.call("setBannerAdVisible:", bo);
        }
        else if (os == "Conch-android") {
            bridge.call("setBannerAdVisible", bo);
        }
    };
    return NativeBridge4399;
}(Laya.Script));
exports.default = NativeBridge4399;

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URI_1 = require("../../URI");
var SoundTool = /** @class */ (function () {
    function SoundTool() {
    }
    SoundTool.playBgMusic = function () {
        Laya.SoundManager.playMusic(URI_1.default.soundUrl + "bg_music.wav");
    };
    SoundTool.playXiaoChuEffect = function () {
        Laya.SoundManager.playSound(URI_1.default.soundUrl + "xiaochu.wav");
    };
    SoundTool.playHeChengEffect = function () {
        Laya.SoundManager.playSound(URI_1.default.soundUrl + "hecheng.wav");
    };
    SoundTool.playTeJiEffect = function () {
        Laya.SoundManager.playSound(URI_1.default.soundUrl + "teji.wav");
    };
    SoundTool.playXiaHuaEffect = function () {
        Laya.SoundManager.playSound(URI_1.default.soundUrl + "xiahua.wav");
    };
    SoundTool.playYiDongEffect = function () {
        Laya.SoundManager.playSound(URI_1.default.soundUrl + "yidong.wav");
    };
    SoundTool.getSoundVolume = function () {
        return SoundTool._soundVolume;
    };
    SoundTool.setSoundVolume = function (value) {
        if (value === void 0) { value = 0.2; }
        if (Number["isNaN"](value)) {
            value = 0.2;
        }
        SoundTool._soundVolume = value;
        Laya.SoundManager.setSoundVolume(value);
        Laya.LocalStorage.setItem("soundVolume", (value * 100).toString());
    };
    SoundTool.getMusicVolume = function () {
        return SoundTool._musicVolume;
    };
    SoundTool.setMusicVolume = function (value) {
        if (value === void 0) { value = 0.2; }
        if (Number["isNaN"](value)) {
            value = 0.2;
        }
        SoundTool._musicVolume = value;
        Laya.SoundManager.setMusicVolume(value);
        Laya.LocalStorage.setItem("musicVolume", (value * 100).toString());
    };
    SoundTool.init = function () {
        SoundTool.setSoundVolume(parseInt(Laya.LocalStorage.getItem("soundVolume")) / 100);
        SoundTool.setMusicVolume(parseInt(Laya.LocalStorage.getItem("musicVolume")) / 100);
    };
    return SoundTool;
}());
exports.default = SoundTool;

},{"../../URI":6}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WXTool = /** @class */ (function (_super) {
    __extends(WXTool, _super);
    function WXTool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WXTool.addBtn = function (btn) {
        this._btns.push(btn);
    };
    WXTool.removeBtn = function (btn) {
        this._btns.slice(this._btns.indexOf(btn), 1);
    };
    WXTool.hideAllBtn = function () {
        this._btns.forEach(function (element) {
            element.style.hidden = true;
        });
    };
    WXTool.showAllBtn = function () {
        this._btns.forEach(function (element) {
            element.style.hidden = false;
        });
    };
    WXTool._btns = [];
    return WXTool;
}(Laya.Script));
exports.default = WXTool;

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = Laya.Scene;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var test;
    (function (test) {
        var TestSceneUI = /** @class */ (function (_super) {
            __extends(TestSceneUI, _super);
            function TestSceneUI() {
                return _super.call(this) || this;
            }
            TestSceneUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("test/TestScene");
            };
            return TestSceneUI;
        }(Scene));
        test.TestSceneUI = TestSceneUI;
        REG("ui.test.TestSceneUI", TestSceneUI);
    })(test = ui.test || (ui.test = {}));
})(ui = exports.ui || (exports.ui = {}));

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0xheWEvTGF5YUFpcklERV8yLjEuMGJldGExLmFwcC9Db250ZW50cy9SZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQXBwQ29uZmlnLnRzIiwic3JjL0NvZGVFeHBhbmQudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9NYWluLnRzIiwic3JjL1Jlc01nci50cyIsInNyYy9VUkkudHMiLCJzcmMvc2NyaXB0L0J1bGxldC50cyIsInNyYy9zY3JpcHQvRHJvcEJveC50cyIsInNyYy9zY3JpcHQvR2FtZUNvbnRyb2wudHMiLCJzcmMvc2NyaXB0L0dhbWVVSS50cyIsInNyYy9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyQmFzZS50cyIsInNyYy9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyTWdyLnRzIiwic3JjL3NjcmlwdC9jb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIudHMiLCJzcmMvc2NyaXB0L2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlci50cyIsInNyYy9zY3JpcHQvbW9kZWwvTWFwRm9udEluZm8udHMiLCJzcmMvc2NyaXB0L21vZGVsL01hcFN0YXJJbmZvLnRzIiwic3JjL3NjcmlwdC9tb2RlbC9Nb2RlbEJhc2UudHMiLCJzcmMvc2NyaXB0L21vZGVsL1BsYXllckluZm8udHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9Gb250R3JpZC50cyIsInNyYy9zY3JpcHQvcHJlZmViL0dhbWVSZXN1bHQudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9HYW1lU2V0dGluZy50cyIsInNyYy9zY3JpcHQvcHJlZmViL1ByZWZlYkJhc2UudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9TdGFydEdhbWUudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9UaXBJdGVtLnRzIiwic3JjL3NjcmlwdC9zY2VuZS9Mb2FkaW5nU2NlbmUudHMiLCJzcmMvc2NyaXB0L3NjZW5lL01haW5HYW1lU2NlbmUudHMiLCJzcmMvc2NyaXB0L3NjZW5lL1NjZW5lQmFzZS50cyIsInNyYy9zY3JpcHQvc2NlbmUvU2NlbmVNZ3IudHMiLCJzcmMvc2NyaXB0L3Rvb2wvTmF0aXZlQnJpZGdlNDM5OS50cyIsInNyYy9zY3JpcHQvdG9vbC9Tb3VuZFRvb2wudHMiLCJzcmMvc2NyaXB0L3Rvb2wvV1hUb29sLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSw2QkFBd0I7QUFFeEI7SUFBdUMsNkJBQVc7SUFBbEQ7O0lBb0VBLENBQUM7SUFsRWlCLDRCQUFrQixHQUFoQztRQUVJLElBQUcsU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQzdCO1lBQ0ksT0FBTztnQkFDSCxxQkFBcUI7Z0JBQ3JCLGVBQWU7Z0JBQ2YsOENBQThDO2dCQUM5QyxhQUFHLENBQUMsUUFBUSxHQUFHLDRCQUE0QjtnQkFDM0Msc0RBQXNEO2dCQUN0RCxhQUFHLENBQUMsUUFBUSxHQUFHLG9DQUFvQztnQkFDbkQsc0JBQXNCO2dCQUN0QixvQkFBb0I7Z0JBQ3BCLG1CQUFtQjtnQkFDbkIsZ0JBQWdCO2dCQUNoQixrQkFBa0I7Z0JBQ2xCLG1CQUFtQjtnQkFDbkIsa0JBQWtCO2FBQ3JCLENBQUE7U0FDSjthQUVEO1lBQ0ksT0FBTztnQkFDSCxlQUFlO2dCQUNmLGFBQUcsQ0FBQyxRQUFRLEdBQUcsMkJBQTJCO2dCQUMxQyxhQUFHLENBQUMsUUFBUSxHQUFHLG1DQUFtQztnQkFDbEQsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLGdCQUFnQjtnQkFDaEIsa0JBQWtCO2dCQUNsQixtQkFBbUI7Z0JBQ25CLGtCQUFrQjthQUNyQixDQUFBO1NBQ0o7SUFDTCxDQUFDO0lBRUQsV0FBVztJQUNHLHFCQUFXLEdBQXpCO1FBRUksSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FB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LE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFYSxpQkFBVSxHQUF4QjtRQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBbkJjLFlBQUssR0FBVyxFQUFFLENBQUM7SUFvQnRDLGFBQUM7Q0FyQkQsQUFxQkMsQ0FyQm1DLElBQUksQ0FBQyxNQUFNLEdBcUI5QztrQkFyQm9CLE1BQU07Ozs7O0FDRzNCLElBQU8sS0FBSyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDeEIsSUFBSSxHQUFHLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7QUFDN0MsSUFBYyxFQUFFLENBV2Y7QUFYRCxXQUFjLEVBQUU7SUFBQyxJQUFBLElBQUksQ0FXcEI7SUFYZ0IsV0FBQSxJQUFJO1FBQ2pCO1lBQWlDLCtCQUFLO1lBR2xDO3VCQUFlLGlCQUFPO1lBQUEsQ0FBQztZQUN2QixvQ0FBYyxHQUFkO2dCQUNJLGlCQUFNLGNBQWMsV0FBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckMsQ0FBQztZQUNMLGtCQUFDO1FBQUQsQ0FSQSxBQVFDLENBUmdDLEtBQUssR0FRckM7UUFSWSxnQkFBVyxjQVF2QixDQUFBO1FBQ0QsR0FBRyxDQUFDLHFCQUFxQixFQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUMsRUFYZ0IsSUFBSSxHQUFKLE9BQUksS0FBSixPQUFJLFFBV3BCO0FBQUQsQ0FBQyxFQVhhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQVdmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBVUkkgZnJvbSBcIi4vVVJJXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBDb25maWcgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbml0TG9hZGluZ1VybHMoKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBcInJlcy9hdGxhcy9tYXAuYXRsYXNcIixcclxuICAgICAgICAgICAgICAgIFwicmVzL2RhdGEuanNvblwiLFxyXG4gICAgICAgICAgICAgICAgLy8gVVJJLnNwaW5lVXJsICsgXCJvdGhlcl90YW96aHVhbmd4aXRvbmcxLnNrXCIsXHJcbiAgICAgICAgICAgICAgICBVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3Rhb3podWFuZ3hpdG9uZzEucG5nXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3d1cGluZ2h1YW5yYW9fa2luX2xpdHRsZS5za1wiLFxyXG4gICAgICAgICAgICAgICAgVVJJLnNwaW5lVXJsICsgXCJvdGhlcl93dXBpbmdodWFucmFvX2tpbl9saXR0bGUucG5nXCIsXHJcbiAgICAgICAgICAgICAgICBcInJlcy9hdGxhcy90ZXN0LmF0bGFzXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL2JnX211c2ljLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC9oZWNoZW5nLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC90ZWppLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC94aWFodWEud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3hpYW9jaHUud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3lpZG9uZy53YXZcIlxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgXCJyZXMvZGF0YS5qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3Rhb3podWFuZ3hpdG9uZzEuc2tcIixcclxuICAgICAgICAgICAgICAgIFVSSS5zcGluZVVybCArIFwib3RoZXJfd3VwaW5naHVhbnJhb19raW5fbGl0dGxlLnNrXCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL2JnX211c2ljLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC9oZWNoZW5nLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC90ZWppLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC94aWFodWEud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3hpYW9jaHUud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3lpZG9uZy53YXZcIlxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5piv5ZCm5bey57uP5paw5omL5byV5a+86L+HXHJcbiAgICBwdWJsaWMgc3RhdGljIGhhZEd1aWRhbmNlKCkgOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJndWlkZVwiKTtcclxuICAgICAgICBpZihibyA9PSBcInRydWVcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRHdWlkYW5jZSh2YWx1ZSA6IGJvb2xlYW4pIDogdm9pZHtcclxuICAgICAgICBpZih2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ3VpZGVcIixcInRydWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImd1aWRlXCIsXCJmYWxzZVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwb29scyA9IHt9O1xyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgcGxhdGZvcm0gPSBcInRlc3RcIjsgLy9sYXlh5rWL6K+VXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXRmb3JtID0gXCJ3eFwiOyAvL+W+ruS/oea1i+ivlVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBwbGF0Zm9ybSA9IFwiYW5kcm9pZFwiOyAvL2FuZHJvaWQgbmF0aXZlXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIHBsYXRmb3JtID0gXCJhbmRyb2lkNDM5OVwiOyAvL2FuZHJvaWQgbmF0aXZlNDM5OVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBwbGF0Zm9ybSA9IFwiaW9zXCI7IC8vaW9zIG5hdGl2ZVxyXG4gICAgcHVibGljIHN0YXRpYyB2ZXJzaW9uID0gXCIxLjhcIjtcclxufSIsIi8qKlxyXG4qIOa6kOS7o+eggeaLk+WxlVxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlRXhwYW5ke1xyXG5cdHB1YmxpYyBzdGF0aWMgaW5pdCgpIDogdm9pZHtcclxuXHRcdC8vIExheWEuU3ByaXRl5ouT5bGVXHJcblx0XHR2YXIgc3ByaXRlUHJvdG86IExheWEuU3ByaXRlID0gTGF5YS5TcHJpdGUucHJvdG90eXBlO1xyXG5cdFx0Ly8g5re75Yqg54K55Ye757yp5pS+55qE55uR5ZCsXHJcblx0XHRzcHJpdGVQcm90b1tcInpvb21PblwiXSA9IGZ1bmN0aW9uKGhhbmRsZXI6IExheWEuSGFuZGxlciwgc2NhbGU6IG51bWJlciA9IDEuMSkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdGlmICghc2VsZltcImluaXRTWFwiXSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGZbXCJpbml0U1hcIl0gPSBzZWxmLnNjYWxlWDtcclxuXHRcdFx0XHRzZWxmW1wiaW5pdFNZXCJdID0gc2VsZi5zY2FsZVk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHNjYWxlID4gMCAmJiBzY2FsZSAhPSAxKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIGNlbnRlclggPSBzZWxmLmdldENlbnRlclgoKTtcclxuXHRcdFx0XHR2YXIgY2VudGVyWSA9IHNlbGYuZ2V0Q2VudGVyWSgpO1xyXG5cdFx0XHRcdHNlbGYucGl2b3RYID0gc2VsZi53aWR0aCAvIDI7XHJcblx0XHRcdFx0c2VsZi5waXZvdFkgPSBzZWxmLmhlaWdodCAvIDI7XHJcblx0XHRcdFx0c2VsZi5wb3MoY2VudGVyWCwgY2VudGVyWSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHNlbGYuaGFzTGlzdGVuZXIoXCJwcmVzc1wiKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGYub2ZmKExheWEuRXZlbnQuTU9VU0VfRE9XTiwgc2VsZiwgc2VsZltcIm1vdXNlRG93blwiXSk7XHJcblx0XHRcdFx0c2VsZi5vZmYoTGF5YS5FdmVudC5NT1VTRV9VUCwgc2VsZiwgc2VsZltcIm1vdXNlVXBcIl0pO1xyXG5cdFx0XHRcdHNlbGYub2ZmKExheWEuRXZlbnQuTU9VU0VfTU9WRSwgc2VsZiwgc2VsZltcIm1vdXNlTW92ZVwiXSk7XHJcblx0XHRcdFx0c2VsZi5vZmYoTGF5YS5FdmVudC5NT1VTRV9PVVQsIHNlbGYsIHNlbGZbXCJtb3VzZU91dFwiXSk7XHJcblx0XHRcdFx0c2VsZi5vZmYoTGF5YS5FdmVudC5NT1VTRV9PVkVSLCBzZWxmLCBzZWxmW1wibW91c2VPdmVyXCJdKTtcclxuXHRcdFx0XHRzZWxmLm9mZihcInByZXNzXCIsIHNlbGYsIHNlbGZbXCJwcmVzc1wiXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2VsZltcIm1vdXNlRG93blwiXSA9IGZ1bmN0aW9uKGV2ZW50OiBMYXlhLkV2ZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHNlbGZbXCJpc0Rvd25cIl0pIHJldHVybjtcclxuXHRcdFx0XHRzZWxmLnNjYWxlKHNlbGZbXCJpbml0U1hcIl0gKiBzY2FsZSwgc2VsZltcImluaXRTWVwiXSAqIHNjYWxlKTtcclxuXHRcdFx0XHRzZWxmW1wiaXNEb3duXCJdID0gdHJ1ZTtcclxuXHRcdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIucnVuV2l0aChldmVudCk7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChzZWxmW1wiaXNEb3duXCJdKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZWxmLmV2ZW50KFwicHJlc3NcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgMjAwKTtcclxuXHJcblx0XHRcdFx0Ly8gaWYgKGdhbWUuQXBwQ29uZmlnLnNvdW5kRWZmZWN0KVxyXG5cdFx0XHRcdC8vIHtcclxuXHRcdFx0XHQvLyBcdExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChnYW1lLlVSSS5hdWRpb1VybCArIFwiVUkvYnV0dG9uLndhdlwiLCAxKTtcclxuXHRcdFx0XHQvLyB9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzZWxmW1wibW91c2VVcFwiXSA9IGZ1bmN0aW9uKGV2ZW50OiBMYXlhLkV2ZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKCFzZWxmW1wiaXNEb3duXCJdKSByZXR1cm47XHJcblx0XHRcdFx0c2VsZi5zY2FsZShzZWxmW1wiaW5pdFNYXCJdLCBzZWxmW1wiaW5pdFNZXCJdKTtcclxuXHRcdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIucnVuV2l0aChldmVudCk7XHJcblx0XHRcdFx0c2VsZltcImlzRG93blwiXSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmW1wibW91c2VNb3ZlXCJdID0gZnVuY3Rpb24oZXZlbnQ6IExheWEuRXZlbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoc2VsZltcImlzRG93blwiXSkge1xyXG5cdFx0XHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyLnJ1bldpdGgoZXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVx0XHJcblxyXG5cdFx0XHRzZWxmW1wibW91c2VPdmVyXCJdID0gZnVuY3Rpb24oZXZlbnQ6IExheWEuRXZlbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIucnVuV2l0aChldmVudCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGZbXCJtb3VzZU91dFwiXSA9IGZ1bmN0aW9uKGV2ZW50OiBMYXlhLkV2ZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHNlbGZbXCJpc0Rvd25cIl0pIHtcclxuXHRcdFx0XHRcdHNlbGYuc2NhbGUoc2VsZltcImluaXRTWFwiXSwgc2VsZltcImluaXRTWVwiXSk7XHJcblx0XHRcdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIucnVuV2l0aChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNlbGZbXCJpc0Rvd25cIl0gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZltcInByZXNzXCJdID0gZnVuY3Rpb24oZXZlbnQ6IExheWEuRXZlbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgZXZlbnQgPSBuZXcgTGF5YS5FdmVudCgpO1xyXG5cdFx0XHRcdGV2ZW50LnR5cGUgPSBcInByZXNzXCI7XHJcblx0XHRcdFx0ZXZlbnQuY3VycmVudFRhcmdldCA9IHNlbGY7XHJcblx0XHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyLnJ1bldpdGgoZXZlbnQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLm9uKFwicHJlc3NcIiwgdGhpcywgc2VsZltcInByZXNzXCJdKTtcclxuXHRcdFx0c2VsZi5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIHNlbGZbXCJtb3VzZURvd25cIl0pO1xyXG5cdFx0XHRzZWxmLm9uKExheWEuRXZlbnQuTU9VU0VfVVAsIHRoaXMsIHNlbGZbXCJtb3VzZVVwXCJdKTtcclxuXHRcdFx0c2VsZi5vbihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHNlbGZbXCJtb3VzZU1vdmVcIl0pO1xyXG5cdFx0XHRzZWxmLm9uKExheWEuRXZlbnQuTU9VU0VfT1ZFUiwgdGhpcywgc2VsZltcIm1vdXNlT3ZlclwiXSk7XHJcblx0XHRcdHNlbGYub24oTGF5YS5FdmVudC5NT1VTRV9PVVQsIHRoaXMsIHNlbGZbXCJtb3VzZU91dFwiXSk7XHJcblx0XHRcdC8vIGlmIChzZWxmW1widG9wXCJdKVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdC8vIFx0c2VsZi55ID0gc2VsZltcInRvcFwiXSArIHNlbGYucGl2b3RZO1xyXG5cdFx0XHQvLyBcdHNlbGZbXCJ0b3BcIl0gPSBOYU47XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gaWYgKHNlbGZbXCJib3R0b21cIl0pXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0Ly8gXHRzZWxmLnkgPSAoc2VsZi5wYXJlbnQgYXMgTGF5YS5TcHJpdGUpLmhlaWdodCAtIHNlbGZbXCJib3R0b21cIl0gLSBzZWxmLmhlaWdodCArIHNlbGYucGl2b3RZO1xyXG5cdFx0XHQvLyBcdHNlbGZbXCJib3R0b21cIl0gPSBOYU47XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gaWYgKHNlbGZbXCJsZWZ0XCJdKVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdC8vIFx0c2VsZi54ID0gc2VsZltcImxlZnRcIl0gKyBzZWxmLnBpdm90WDtcclxuXHRcdFx0Ly8gXHRzZWxmW1wibGVmdFwiXSA9IE5hTjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyBpZiAoc2VsZltcInJpZ2h0XCJdKVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdC8vIFx0c2VsZi54ID0gKHNlbGYucGFyZW50IGFzIExheWEuU3ByaXRlKS53aWR0aCAtIHNlbGZbXCJyaWdodFwiXSAtIHNlbGYud2lkdGggKyBzZWxmLnBpdm90WDtcclxuXHRcdFx0Ly8gXHRzZWxmW1wicmlnaHRcIl0gPSBOYU47XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJnZXRMZWZ0XCJdID0gZnVuY3Rpb24oKTogbnVtYmVyXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdGlmIChzZWxmW1wiYW5jaG9yWFwiXSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGYucGl2b3RYID0gc2VsZi53aWR0aCAqIHNlbGZbXCJhbmNob3JYXCJdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzZWxmLnggLSBzZWxmLnBpdm90WCAqIHNlbGYuc2NhbGVYO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiZ2V0UmlnaHRcIl0gPSBmdW5jdGlvbigpOiBudW1iZXJcclxuXHRcdHtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0cmV0dXJuIHNlbGYuZ2V0TGVmdCgpICsgc2VsZi53aWR0aCAqIHNlbGYuc2NhbGVYO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiZ2V0VG9wXCJdID0gZnVuY3Rpb24oKTogbnVtYmVyXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdGlmIChzZWxmW1wiYW5jaG9yWVwiXSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNlbGYucGl2b3RZID0gc2VsZi5oZWlnaHQgKiBzZWxmW1wiYW5jaG9yWVwiXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gc2VsZi55IC0gc2VsZi5waXZvdFkgKiBzZWxmLnNjYWxlWTtcclxuXHRcdH1cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImdldEJvdHRvbVwiXSA9IGZ1bmN0aW9uKCk6IG51bWJlclxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5nZXRUb3AoKSArIHNlbGYuaGVpZ2h0ICogc2VsZi5zY2FsZVk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJnZXRDZW50ZXJYXCJdID0gZnVuY3Rpb24oKTogbnVtYmVyXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdHJldHVybiBzZWxmLmdldExlZnQoKSArIHNlbGYud2lkdGggLyAyICogc2VsZi5zY2FsZVg7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJnZXRDZW50ZXJZXCJdID0gZnVuY3Rpb24oKTogbnVtYmVyXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdHJldHVybiBzZWxmLmdldFRvcCgpICsgc2VsZi5oZWlnaHQgLyAyICogc2VsZi5zY2FsZVk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJjbG9uZVwiXSA9IGZ1bmN0aW9uKCk6IExheWEuU3ByaXRlXHJcblx0XHR7XHJcblx0XHRcdGlmICghdGhpc1tcInVpRGF0YVwiXSkgcmV0dXJuIG51bGw7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdGxldCBjbG9uZTogTGF5YS5TcHJpdGUgPSBMYXlhLlNjZW5lVXRpbHMuY3JlYXRlQ29tcChzZWxmW1widWlEYXRhXCJdKTtcclxuXHRcdFx0Ly8gaWYgKHNlbGZbXCJ1aURhdGFcIl0pXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0Ly8gXHRmb3IgKHZhciBrZXkgaW4gc2VsZltcInVpRGF0YVwiXVtcInByb3BzXCJdKSB7XHJcblx0XHRcdC8vIFx0XHRpZiAoc2VsZltcInVpRGF0YVwiXVtcInByb3BzXCJdLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0Ly8gXHRcdFx0dmFyIGVsZW1lbnQgPSBzZWxmW2tleV07XHJcblx0XHRcdC8vIFx0XHRcdGNsb25lW1wia2V5XCJdID0gZWxlbWVudDtcclxuXHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIFx0c2VsZi5jaGlsZHJlbihbXSkuZm9yRWFjaChjaGlsZCA9PiB7XHJcblx0XHRcdC8vIFx0XHR2YXIgaW5kZXggPSBzZWxmLmdldENoaWxkSW5kZXgoY2hpbGQpXHJcblx0XHRcdC8vIFx0XHRjbG9uZS5yZW1vdmVDaGlsZEF0KGluZGV4KTtcclxuXHRcdFx0Ly8gXHRcdGNsb25lLmFkZENoaWxkQXQoKGNoaWxkIGFzIExheWEuU3ByaXRlKS5jbG9uZSgpLCBpbmRleCk7XHJcblx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Y2xvbmUudmlzaWJsZSA9IHNlbGYudmlzaWJsZTtcclxuXHRcdFx0cmV0dXJuIGNsb25lO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFN0cmluZ+aLk+WxlVxyXG5cdFx0dmFyIHN0cmluZ1Byb3RvOiBTdHJpbmcgPSBTdHJpbmcucHJvdG90eXBlO1xyXG5cdFx0Ly8g5a2X56ym5Liy5qC85byP5YyWKOWPquWBmuS6hueugOWNleeahCVkLCVz5Yy56YWN77yM5pyq5YGa5Y+C5pWw5Liq5pWw5ZKM57G75Z6L5Yik5pat77yM5LmL5ZCO5LyY5YyW5a6M5ZaEKVxyXG5cdFx0U3RyaW5nW1wiZm9ybWF0XCJdID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG5cdFx0XHR2YXIgc3RyOiBzdHJpbmcgPSBhcmdzWzBdO1xyXG5cdFx0XHRhcmdzID0gYXJncy5zbGljZSgxLCBhcmdzLmxlbmd0aCk7XHJcblx0XHRcdHZhciBtYXRjaCA9IGZ1bmN0aW9uKG1TdHJpbmc6IHN0cmluZywgbUFyZ3M6IEFycmF5PGFueT4pIHtcclxuXHRcdFx0XHR2YXIgaW5kZXg6IG51bWJlciA9IDA7XHJcblx0XHRcdFx0dmFyIHJlc3VsdDogQXJyYXk8YW55PiA9IG1TdHJpbmcubWF0Y2gobmV3IFJlZ0V4cChcIiVbZCxzXStcIikpO1xyXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbVN0cmluZztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bVN0cmluZyA9IG1TdHJpbmcucmVwbGFjZShyZXN1bHRbMF0sIG1BcmdzWzBdKTtcclxuXHRcdFx0XHRcdG1BcmdzID0gbUFyZ3Muc2xpY2UoMSwgbUFyZ3MubGVuZ3RoKTtcclxuXHRcdFx0XHRcdHJldHVybiBtYXRjaChtU3RyaW5nLCBtQXJncylcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG1hdGNoKHN0ciwgYXJncylcclxuXHRcdH1cclxuXHJcblx0XHRTdHJpbmdbXCJpc0Vtb2ppQ2hhcmFjdGVyXCJdID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG5cdFx0XHR2YXIgc3Vic3RyaW5nOiBzdHJpbmcgPSBhcmdzWzBdO1xyXG5cdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBzdWJzdHJpbmcubGVuZ3RoOyBpKyspIHsgIFxyXG5cdFx0XHRcdHZhciBocyA9IHN1YnN0cmluZy5jaGFyQ29kZUF0KGkpOyAgXHJcblx0XHRcdFx0aWYgKDB4ZDgwMCA8PSBocyAmJiBocyA8PSAweGRiZmYpIHsgIFxyXG5cdFx0XHRcdFx0aWYgKHN1YnN0cmluZy5sZW5ndGggPiAxKSB7ICBcclxuXHRcdFx0XHRcdFx0dmFyIGxzID0gc3Vic3RyaW5nLmNoYXJDb2RlQXQoaSArIDEpOyAgXHJcblx0XHRcdFx0XHRcdHZhciB1YyA9ICgoaHMgLSAweGQ4MDApICogMHg0MDApICsgKGxzIC0gMHhkYzAwKSArIDB4MTAwMDA7ICBcclxuXHRcdFx0XHRcdFx0aWYgKDB4MWQwMDAgPD0gdWMgJiYgdWMgPD0gMHgxZjc3ZikgeyAgXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdFx0fSAgXHJcblx0XHRcdFx0XHR9ICBcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHN1YnN0cmluZy5sZW5ndGggPiAxKSB7ICBcclxuXHRcdFx0XHRcdHZhciBscyA9IHN1YnN0cmluZy5jaGFyQ29kZUF0KGkgKyAxKTsgIFxyXG5cdFx0XHRcdFx0aWYgKGxzID09IDB4MjBlMykgeyAgXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHR9ICBcclxuXHRcdFx0XHR9IGVsc2UgeyAgXHJcblx0XHRcdFx0XHRpZiAoMHgyMTAwIDw9IGhzICYmIGhzIDw9IDB4MjdmZikgeyAgXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKDB4MkIwNSA8PSBocyAmJiBocyA8PSAweDJiMDcpIHsgIFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICgweDI5MzQgPD0gaHMgJiYgaHMgPD0gMHgyOTM1KSB7ICBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoMHgzMjk3IDw9IGhzICYmIGhzIDw9IDB4MzI5OSkgeyAgXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGhzID09IDB4YTkgfHwgaHMgPT0gMHhhZSB8fCBocyA9PSAweDMwM2QgfHwgaHMgPT0gMHgzMDMwICBcclxuXHRcdFx0XHRcdFx0XHR8fCBocyA9PSAweDJiNTUgfHwgaHMgPT0gMHgyYjFjIHx8IGhzID09IDB4MmIxYiAgXHJcblx0XHRcdFx0XHRcdFx0fHwgaHMgPT0gMHgyYjUwKSB7ICBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdH0gIFxyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH0gXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQXJyYXnmi5PlsZVcclxuXHRcdHZhciBhcnJheVByb3RvOiBhbnkgPSBBcnJheS5wcm90b3R5cGU7XHJcblx0XHQvLyBhcnJheeWtl+auteaOkuW6jyAx77yaYXJyLnNvcnRPbihbW1wia2V5MVwiLCBcInVwXCJdLCBbXCJrZXkyXCIsIFwiZG93blwiXV0pIDLvvJphcnIuc29ydE9uKFwidXBcIilcclxuXHRcdC8vIOWkjeWQiOaOkuW6jyBmaWVsZExpc3TljIXlkKvlpJrkuKrliJfooajvvIzmr4/kuKrliJfooajljIXlkKsy5Liq5YC877yM56ys5LiA5Liq6KGo56S66KaB5o6S5bqP55qEa2V5LOesrOS6jOS4quihqOekuuimgeaOkuW6j+eahOexu+Wei++8iOWNh+mZjeW6j1xyXG5cdFx0Ly8g5YC85o6S5bqPIOWPquS8oOS4gOS4quWtl+espuS4suihqOekuuWvueWAvOWIl+ihqOi/m+ihjOaOkuW6j1xyXG5cdFx0YXJyYXlQcm90b1tcInNvcnRPblwiXSA9IGZ1bmN0aW9uKGZpZWxkTGlzdDogYW55KTogdm9pZCB7XHJcblx0XHRcdGxldCBpbmRleDogbnVtYmVyID0gMDtcclxuXHRcdFx0dmFyIGNvbXBhcmUgPSBmdW5jdGlvbihhOiBPYmplY3QsIGI6IE9iamVjdCk6IG51bWJlciB7XHJcblx0XHRcdFx0dmFyIHJlc3VsdDogbnVtYmVyID0gMDtcclxuXHRcdFx0XHR2YXIga2V5OiBzdHJpbmcgPSBmaWVsZExpc3RbaW5kZXhdWzBdO1xyXG5cdFx0XHRcdHZhciBzb3J0VHlwZTogc3RyaW5nID0gZmllbGRMaXN0W2luZGV4XVsxXSB8fCBcInVwXCI7XHJcblx0XHRcdFx0dmFyIHZhbHVlQSA9IGFba2V5XTtcclxuXHRcdFx0XHR2YXIgdmFsdWVCID0gYltrZXldO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YodmFsdWVBKSA9PSBcImJvb2xlYW5cIilcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YWx1ZUEgPSB2YWx1ZUEgPyAxIDogMDtcclxuXHRcdFx0XHRcdHZhbHVlQiA9IHZhbHVlQiA/IDEgOiAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodmFsdWVBID4gdmFsdWVCKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBzb3J0VHlwZSA9PSBcInVwXCIgPyAxIDogLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHZhbHVlQSA8IHZhbHVlQikge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gc29ydFR5cGUgPT0gXCJ1cFwiID8gLTEgOiAxO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpbmRleCsrO1xyXG5cdFx0XHRcdFx0aWYgKGZpZWxkTGlzdFtpbmRleF0pXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjb21wYXJlKGEsIGIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpbmRleCA9IDA7XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYgKHR5cGVvZihmaWVsZExpc3QpID09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0XHQodGhpcyBhcyBBcnJheTxhbnk+KS5zb3J0KGZ1bmN0aW9uKGE6IGFueSwgYjogYW55KTogbnVtYmVyIHtcclxuXHRcdFx0XHRcdHZhciByZXN1bHQ6IG51bWJlciA9IDA7XHJcblx0XHRcdFx0XHRpZiAoYSA+IGIpIHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gZmllbGRMaXN0ID09IFwidXBcIiA/IDEgOiAtMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGEgPCBiKSB7XHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGZpZWxkTGlzdCA9PSBcInVwXCIgPyAtMSA6IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0KHRoaXMgYXMgQXJyYXk8YW55Pikuc29ydChjb21wYXJlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGFycmF5UHJvdG9bXCJnZXRJbmRleFwiXSA9IGZ1bmN0aW9uKHZhbHVlIDogYW55KTogbnVtYmVyIHtcclxuXHRcdFx0dmFyIGkgPSAtMTtcclxuXHJcblx0XHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHRoaXNbaV0gPT0gdmFsdWUpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIUludDMyQXJyYXlbXCJwcm90b3R5cGVcIl1bXCJmaWxsXCJdKVxyXG5cdFx0e1xyXG5cdFx0XHRJbnQzMkFycmF5W1wicHJvdG90eXBlXCJdW1wiZmlsbFwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0dmFyIGkgPSAwO1xyXG5cclxuXHRcdFx0XHR3aGlsZSh0eXBlb2YgdGhpc1tpXSAhPSBcInVuZGVmaW5lZFwiKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRoaXNbaV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGkrKztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFOdW1iZXJbXCJpc0Zpbml0ZVwiXSlcclxuXHRcdHtcclxuXHRcdFx0TnVtYmVyW1wiaXNGaW5pdGVcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHJldHVybiAodHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIpICYmICh2YWx1ZSAhPSBOYU4pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xyXG5pbXBvcnQgTG9hZGluZ1NjZW5lIGZyb20gXCIuL3NjcmlwdC9zY2VuZS9Mb2FkaW5nU2NlbmVcIlxuaW1wb3J0IE1haW5HYW1lU2NlbmUgZnJvbSBcIi4vc2NyaXB0L3NjZW5lL01haW5HYW1lU2NlbmVcIlxuaW1wb3J0IEZvbnRHcmlkIGZyb20gXCIuL3NjcmlwdC9wcmVmZWIvRm9udEdyaWRcIlxuaW1wb3J0IEdhbWVVSSBmcm9tIFwiLi9zY3JpcHQvR2FtZVVJXCJcbmltcG9ydCBHYW1lQ29udHJvbCBmcm9tIFwiLi9zY3JpcHQvR2FtZUNvbnRyb2xcIlxuaW1wb3J0IEJ1bGxldCBmcm9tIFwiLi9zY3JpcHQvQnVsbGV0XCJcbmltcG9ydCBEcm9wQm94IGZyb20gXCIuL3NjcmlwdC9Ecm9wQm94XCJcbmltcG9ydCBHYW1lUmVzdWx0IGZyb20gXCIuL3NjcmlwdC9wcmVmZWIvR2FtZVJlc3VsdFwiXG5pbXBvcnQgR2FtZVNldHRpbmcgZnJvbSBcIi4vc2NyaXB0L3ByZWZlYi9HYW1lU2V0dGluZ1wiXG5pbXBvcnQgU3RhcnRHYW1lIGZyb20gXCIuL3NjcmlwdC9wcmVmZWIvU3RhcnRHYW1lXCJcbmltcG9ydCBUaXBJdGVtIGZyb20gXCIuL3NjcmlwdC9wcmVmZWIvVGlwSXRlbVwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj02NDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJzaG93YWxsXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJ2ZXJ0aWNhbFwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJtaWRkbGVcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwiY2VudGVyXCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTphbnk9XCJsb2FkaW5nL0xvYWRpbmcuc2NlbmVcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG4gICAgICAgIHJlZyhcInNjcmlwdC9zY2VuZS9Mb2FkaW5nU2NlbmUudHNcIixMb2FkaW5nU2NlbmUpO1xuICAgICAgICByZWcoXCJzY3JpcHQvc2NlbmUvTWFpbkdhbWVTY2VuZS50c1wiLE1haW5HYW1lU2NlbmUpO1xuICAgICAgICByZWcoXCJzY3JpcHQvcHJlZmViL0ZvbnRHcmlkLnRzXCIsRm9udEdyaWQpO1xuICAgICAgICByZWcoXCJzY3JpcHQvR2FtZVVJLnRzXCIsR2FtZVVJKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L0dhbWVDb250cm9sLnRzXCIsR2FtZUNvbnRyb2wpO1xuICAgICAgICByZWcoXCJzY3JpcHQvQnVsbGV0LnRzXCIsQnVsbGV0KTtcbiAgICAgICAgcmVnKFwic2NyaXB0L0Ryb3BCb3gudHNcIixEcm9wQm94KTtcbiAgICAgICAgcmVnKFwic2NyaXB0L3ByZWZlYi9HYW1lUmVzdWx0LnRzXCIsR2FtZVJlc3VsdCk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9wcmVmZWIvR2FtZVNldHRpbmcudHNcIixHYW1lU2V0dGluZyk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9wcmVmZWIvU3RhcnRHYW1lLnRzXCIsU3RhcnRHYW1lKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L3ByZWZlYi9UaXBJdGVtLnRzXCIsVGlwSXRlbSk7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuL0FwcENvbmZpZ1wiO1xyXG5pbXBvcnQgTWFwRm9udEluZm8gZnJvbSBcIi4vc2NyaXB0L21vZGVsL01hcEZvbnRJbmZvXCI7XHJcbmltcG9ydCBQbGF5ZXJDb250cm9sbGVyIGZyb20gXCIuL3NjcmlwdC9jb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IENvZGVFeHBhbmQgZnJvbSBcIi4vQ29kZUV4cGFuZFwiO1xyXG5pbXBvcnQgeyBSZXNNZ3IgfSBmcm9tIFwiLi9SZXNNZ3JcIjtcclxuaW1wb3J0IFVSSSBmcm9tIFwiLi9VUklcIjtcclxuaW1wb3J0IFRpcENvbnRyb2xsZXIgZnJvbSBcIi4vc2NyaXB0L2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgQ29udHJvbGxlck1nciBmcm9tIFwiLi9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyTWdyXCI7XHJcbmltcG9ydCBTY2VuZU1nciBmcm9tIFwiLi9zY3JpcHQvc2NlbmUvU2NlbmVNZ3JcIjtcclxuaW1wb3J0IExvYWRpbmdTY2VuZSBmcm9tIFwiLi9zY3JpcHQvc2NlbmUvTG9hZGluZ1NjZW5lXCI7XHJcbmltcG9ydCBTb3VuZFRvb2wgZnJvbSBcIi4vc2NyaXB0L3Rvb2wvU291bmRUb29sXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHQvLyBsZXQgc3RyID0gXCJcIjtcclxuXHRcdC8vIGxldCBhcnIgPSBzdHIuc3BsaXQoXCIsXCIpO1xyXG5cdFx0Ly8gbGV0IGNvdXRBcnIgPSBbXTtcclxuXHRcdC8vIGxldCBjb3V0ID0gXCJcIjtcclxuXHRcdC8vIGFyci5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0Ly8gXHRsZXQgZWxlbWVudFN0ciA9IGVsZW1lbnQudHJpbSgpO1xyXG5cdFx0Ly8gXHRpZihlbGVtZW50U3RyID09IFwiXCIpXHJcblx0XHQvLyBcdHtcclxuXHRcdC8vIFx0XHRyZXR1cm47XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0aWYoY291dEFyci5pbmRleE9mKGVsZW1lbnRTdHIpICE9IC0xKVxyXG5cdFx0Ly8gXHR7XHJcblx0XHQvLyBcdFx0cmV0dXJuO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdGlmKGNvdXQgIT0gXCJcIilcclxuXHRcdC8vIFx0e1xyXG5cdFx0Ly8gXHRcdGNvdXQgKz0gXCIsXCJcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHRjb3V0QXJyLnB1c2goZWxlbWVudFN0cik7XHJcblx0XHQvLyBcdGNvdXQgKz0gXCJcXFwiXCIgK2VsZW1lbnRTdHIgKyBcIlxcXCJcIjtcclxuXHRcdC8vIH0pXHJcblx0XHRMYXlhLmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsXCJ3ZWJnbFwiKTtcclxuXHRcdC8vIExheWEuaW5pdCg2NDAsIDExMzYpO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdC8vIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcblx0XHQvLyB7XHJcblx0XHQvLyBcdC8vIExheWEuVVJMLmJhc2VQYXRoID0gXCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vd3VwZWkxOTg3L2ZvbnQtZ2FtZS13eC1hc3NldC9tYXN0ZXIvXCI7XHJcblx0XHQvLyBcdHd4LnNldEVuYWJsZURlYnVnKHtcclxuXHRcdC8vIFx0XHRlbmFibGVEZWJ1ZzogdHJ1ZSxcclxuXHRcdC8vIFx0XHRzdWNjZXNzOiAocmVzdWx0OiBfc2V0RW5hYmxlRGVidWdTdWNjZXNzT2JqZWN0KSA9PiB2b2lke30sXHJcblx0XHQvLyBcdFx0ZmFpbDogKCkgPT4gdm9pZHt9LFxyXG5cdFx0Ly8gXHRcdGNvbXBsZXRlOiAoKSA9PiB2b2lke30sXHJcblx0XHQvLyBcdCAgfSlcclxuXHRcdC8vIH1cclxuXHRcdGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcblx0XHR7XHJcblx0XHRcdFxyXG5cdFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IFwiZml4d2lkdGhcIjtcclxuXHRcdFx0TGF5YS5VUkwuYmFzZVBhdGggPSBcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS93dXBlaTE5ODcvZm9udC1nYW1lLXd4LWFzc2V0L21hc3Rlci9cIjtcclxuXHRcdFx0TGF5YS5NaW5pQWRwdGVyLm5hdGl2ZWZpbGVzID0gW1xyXG5cdFx0XHRcdFwiYnRuX3N0YXJ0R2FtZS5wbmdcIlxyXG5cdFx0XHRdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBcclxuXHRcdHtcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHYW1lQ29uZmlnLnNjYWxlTW9kZTtcclxuXHRcdH1cclxuXHRcdC8vIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLmFsaWduViA9IEdhbWVDb25maWcuYWxpZ25WO1xyXG5cdFx0TGF5YS5zdGFnZS5hbGlnbkggPSBHYW1lQ29uZmlnLmFsaWduSDtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuXHRcdExheWEuc3RhZ2UuZnJhbWVSYXRlID0gXCJzbG93XCI7XHJcblx0XHQvLyBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdC8vIExheWEuQnJvd3Nlci53aW5kb3cuc2hvd0FsZXJ0T25Kc0V4Y2VwdGlvbihmYWxzZSk7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdENvZGVFeHBhbmQuaW5pdCgpO1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHRcdFxyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/mv4DmtLvlpKflsI/lm77mmKDlsITvvIzliqDovb3lsI/lm77nmoTml7blgJnvvIzlpoLmnpzlj5HnjrDlsI/lm77lnKjlpKflm77lkIjpm4bph4zpnaLvvIzliJnkvJjlhYjliqDovb3lpKflm77lkIjpm4bvvIzogIzkuI3mmK/lsI/lm75cclxuXHRcdExheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XHJcblx0fVxyXG5cclxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcclxuXHRcdExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUsdHJ1ZSxudWxsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZGluZ0xvYWQpKVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5pu05paw6L+b5bqm5p2hXHJcblx0ICogQHBhcmFtIHBlcmNlbnQg55m+5YiG5q+UIDAtMTAwXHJcblx0ICovXHJcblx0cHJpdmF0ZSB1cGRhdGVMb2FkaW5nUHJvZ3Jlc3MocGVyY2VudCA6IG51bWJlcikgIDp2b2lke1xyXG5cdFx0cGVyY2VudCA9IE1hdGguZmxvb3IocGVyY2VudCk7XHJcblx0XHRpZihTY2VuZU1nci5jdXJTY2VuZVNjcmlwdCAhPSBudWxsICYmIFNjZW5lTWdyLmN1clNjZW5lU2NyaXB0IGluc3RhbmNlb2YgTG9hZGluZ1NjZW5lKVxyXG5cdFx0e1xyXG5cdFx0XHRTY2VuZU1nci5jdXJTY2VuZVNjcmlwdC51cGRhdGVQZXJjZW50KHBlcmNlbnQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uTG9hZGluZ0xvYWQoKSA6IHZvaWR7XHJcblx0XHRpZihMYXlhLkJyb3dzZXIud2luZG93LmxvYWRpbmdWaWV3KXtcclxuXHRcdFx0TGF5YS5Ccm93c2VyLndpbmRvdy5sb2FkaW5nVmlldy5oaWRlTG9hZGluZ1ZpZXcoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTG9hZGluZ1Byb2dyZXNzKDApO1xyXG5cdFx0TGF5YS5sb2FkZXIubG9hZChBcHBDb25maWcuZ2V0SW5pdExvYWRpbmdVcmxzKCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMubG9hZFN0YXJ0U2NlbmUpLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihwcm9ncmVzcyA6IG51bWJlcikgOiB2b2lke1xyXG5cdFx0XHR0aGlzLnVwZGF0ZUxvYWRpbmdQcm9ncmVzcyhwcm9ncmVzcyAqIDkwKTtcclxuXHRcdH0pKTtcclxuXHR9XHJcblxyXG5cdGxvYWRTdGFydFNjZW5lKCkgOiB2b2lke1xyXG5cdFx0bGV0IGRhdGEgPSBMYXlhLmxvYWRlci5nZXRSZXMoXCJyZXMvZGF0YS5qc29uXCIpO1xyXG5cdFx0TWFwRm9udEluZm8uRGF0YVNvdXJjZSA9IGRhdGE7XHJcblx0XHRMYXlhLlNjZW5lLm9wZW4oXCJtYWluL01haW5HYW1lLnNjZW5lXCIsdHJ1ZSxudWxsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uR2FtZVN0YXJ0KSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkdhbWVMb2FkUHJvZ3Jlc3MsW10sZmFsc2UpKTtcclxuXHRcdGlmKExheWEuQnJvd3Nlci5vbk1pbmlHYW1lKVxyXG5cdFx0e1xyXG5cdFx0XHRMYXlhLk1pbmlBZHB0ZXIuc2VuZEF0bGFzVG9PcGVuRGF0YUNvbnRleHQoXCJyZXMvYXRsYXMvdGVzdC5hdGxhc1wiKVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uR2FtZUxvYWRQcm9ncmVzcyh2YWx1ZSA6IG51bWJlcikgOiB2b2lke1xyXG5cdFx0aWYoTGF5YS5Ccm93c2VyLndpbmRvdy5sb2FkaW5nVmlldyl7XHJcblx0XHRcdExheWEuQnJvd3Nlci53aW5kb3cubG9hZGluZ1ZpZXcubG9hZGluZyh2YWx1ZSAqIDEwMCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUxvYWRpbmdQcm9ncmVzcyg5MCArIHZhbHVlICogMTApO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkdhbWVTdGFydCgpIDogdm9pZHtcclxuXHRcdENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoVGlwQ29udHJvbGxlcikuaW5pdCgpO1xyXG5cdFx0U291bmRUb29sLmluaXQoKTtcclxuXHRcdFNvdW5kVG9vbC5wbGF5QmdNdXNpYygpO1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJcbmludGVyZmFjZSBsb2FkSXRlbXtcbiAgICB1cmxzIDogc3RyaW5nW10sXG4gICAgY2FsbGVyIDogYW55LFxuICAgIGluZGV4IDogbnVtYmVyLFxuICAgIG9uUHJvZ3Jlc3MgOiAoaW5kZXggOiBudW1iZXIsIHRvdGFsIDogbnVtYmVyKSA9PiB2b2lkLFxuICAgIG9uQ29tcGxldGUgOiAoKSA9PiB2b2lkXG59XG5cbmV4cG9ydCBjbGFzcyBSZXNNZ3Ige1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlID0gbnVsbDtcbiAgICBwcml2YXRlIHNwaW5lTGlzdCAgICAgICA6IE9iamVjdCA9IHt9O1xuICAgIHByaXZhdGUgdGV4dHVyZUxpc3QgICAgIDogT2JqZWN0ID0ge307XG4gICAgcHJpdmF0ZSBhbmltYXRpb25MaXN0ICAgOiBPYmplY3QgPSB7fTtcbiAgICBwcml2YXRlIG1vZGVsRGVsYXlMaXN0ICA6IE9iamVjdCA9IHt9O1xuXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZSgpIDogUmVzTWdyIHtcbiAgICAgICAgaWYgKFJlc01nci5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBSZXNNZ3IuaW5zdGFuY2UgPSBuZXcgUmVzTWdyKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVzTWdyLmluc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVsZWFzZVNwaW5lKHVybCA6IHN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBpZiAodGhpcy5zcGluZUxpc3RbdXJsXSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHNwaW5lIDogTGF5YS5UZW1wbGV0ID0gdGhpcy5zcGluZUxpc3RbdXJsXTtcbiAgICAgICAgICAgIC8vIHNwaW5lLnJlbGVhc2VSZXNvdXJjZSh0cnVlKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGluZVtcIl9sb2FkTGlzdFwiXS5sZW5ndGg7IGkrKykgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHR1cmUgOiBMYXlhLlRleHR1cmUgPSBzcGluZS5nZXRUZXh0dXJlKHNwaW5lW1wiX2xvYWRMaXN0XCJdW2ldKTtcblxuICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZS5kaXNwb3NlQml0bWFwKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3BpbmUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICBMYXlhLmxvYWRlci5jbGVhclJlcyh1cmwpO1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5lTGlzdFt1cmxdID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkU3BpbmUodXJsIDogYW55LCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIpIDogYW55IHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgbnVtICA9IDA7XG5cbiAgICAgICAgdmFyIGxvYWRGdW5jID0gZnVuY3Rpb24oc3BpbmUpIHtcbiAgICAgICAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3BpbmVMaXN0W3NwaW5lXSA9IGZhY3Rvcnk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKHVybCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgICAgICBudW0gKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bSA9PSB1cmwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmYWN0b3J5ID0gbmV3IExheWEuVGVtcGxldCgpO1xuICAgICAgICAgICAgZmFjdG9yeS5vbihMYXlhLkV2ZW50LkNPTVBMRVRFLCBzZWxmLCBjb21wbGV0ZSk7XG4gICAgICAgICAgICAvLyBmYWN0b3J5Lm9uKEV2ZW50LkVSUk9SLCB0aGlzLCB0aGlzLm9uRXJyb3IpO1xuICAgICAgICAgICAgZmFjdG9yeS5sb2FkQW5pKHNwaW5lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgodXJsIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVybC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxvYWRGdW5jKHVybFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsb2FkRnVuYyh1cmwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRUZXh0dXJlKHVybCA6IGFueSwgY2FsbGJrIDogTGF5YS5IYW5kbGVyKSA6IGFueSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoKHVybCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1cmwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAodXJsLmxlbmd0aCAtIDEpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTGF5YS5UZXh0dXJlMkQubG9hZCh1cmxbaV0sIGNhbGxiayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIExheWEuVGV4dHVyZTJELmxvYWQodXJsW2ldLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBMYXlhLlRleHR1cmUyRC5sb2FkKHVybCwgY2FsbGJrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIChjYWxsYmsgIT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRQTkcodXJsIDogYW55LCBjYWxsYmsgOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpLnJlbGVhc2VkID09IHRydWUpXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgbGV0IHRleHR1cmUgOiBMYXlhLlRleHR1cmUgPSBMYXlhLmxvYWRlci5nZXRSZXModXJsKTtcbiAgICAgICAgICAgIC8vICAgICB0ZXh0dXJlLmJpdG1hcC5vbihMYXlhLkV2ZW50LlJFQ09WRVJFRCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xuICAgICAgICAgICAgLy8gICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAgICAgLy8gICAgIHRleHR1cmUuYWN0aXZlKCk7XG4gICAgICAgICAgICAvLyAgICAgLy8gdGV4dHVyZS5sb2FkKHVybCk7XG4gICAgICAgICAgICAvLyAgICAgLy8gY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gZWxzZSBcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmwsIGNhbGxiaywgbnVsbCwgXCJpbWFnZVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UE5HKHVybCA6IHN0cmluZykgOiBMYXlhLlRleHR1cmUge1xuICAgICAgICByZXR1cm4gTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgYXMgTGF5YS5UZXh0dXJlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOagueaNruWbvueJh+WcsOWdgOWIm+W7unNwcml0ZVxuICAgICAqIEBwYXJhbSB1cmwg5Zu+54mH5Zyw5Z2AXG4gICAgICogQHBhcmFtIHNwcml0ZSDpu5jorqTkuLrnqbog5aaC5p6c5LiN5Li656m6IOebtOaOpeWcqOatpHNwcml0ZeS4iue7mOWItiBcbiAgICAgKi9cbiAgICBwdWJsaWMgY3JlYXRlU3ByaXRlKHVybCA6IHN0cmluZywgc3ByaXRlPzogTGF5YS5TcHJpdGUpIDogTGF5YS5TcHJpdGV7XG4gICAgICAgIGxldCBzcCA6IExheWEuU3ByaXRlID0gc3ByaXRlIHx8IG5ldyBMYXlhLlNwcml0ZSgpO1xuICAgICAgICBsZXQgdGV4OiBMYXlhLlRleHR1cmU7XG4gICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpID09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubG9hZFBORyh1cmwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xuICAgICAgICAgICAgICAgIHRleCA9IHRoaXMuZ2V0UE5HKHVybCk7XG4gICAgICAgICAgICAgICAgc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUodGV4KTtcbiAgICAgICAgICAgICAgICBpZiAodGV4KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc3Auc2l6ZSh0ZXguc291cmNlV2lkdGgsIHRleC5zb3VyY2VIZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXggPSB0aGlzLmdldFBORyh1cmwpO1xuICAgICAgICAgICAgc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUodGV4KTtcbiAgICAgICAgICAgIGlmICh0ZXgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3Auc2l6ZSh0ZXguc291cmNlV2lkdGgsIHRleC5zb3VyY2VIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcDtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlSW1nKHVybDogc3RyaW5nLCBpbWc/OiBMYXlhLkltYWdlKTogTGF5YS5JbWFnZVxuICAgIHtcbiAgICAgICAgaWYgKCFpbWcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGltZyA9IG5ldyBMYXlhLkltYWdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkUE5HKHVybCwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGltZy5za2luID0gdXJsO1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBpbWc7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRNb2RlbCh1cmwgOiBhbnksIGNhbGxiayA6IGFueSkgOiBhbnkge1xuICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKSAmJiBMYXlhLmxvYWRlci5nZXRSZXModXJsKVtcIl9jaGlsZHJlblwiXSAmJiBMYXlhLmxvYWRlci5nZXRSZXModXJsKS5nZXRDaGlsZEF0KDApKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIExheWEubG9hZGVyLmNyZWF0ZSh1cmwsIGNhbGxiayk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQodXJsIDogc3RyaW5nLCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIpIDogdm9pZHtcbiAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsLGNhbGxiayk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRKc29uKHVybCA6IGFueSwgY2FsbGJrIDogTGF5YS5IYW5kbGVyKSA6IHZvaWR7XG4gICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybCwgY2FsbGJrLG51bGwsIExheWEuTG9hZGVyLkpTT04pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkQXRsYXModXJsIDogYW55LCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIpIDogdm9pZFxuICAgIHtcbiAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsLGNhbGxiayxudWxsLExheWEuTG9hZGVyLkFUTEFTKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZEFuaW1hdGlvbihhbmlVcmw6IHN0cmluZywgYXRsYXNVcmw6IHN0cmluZywgY2FsbGJrOiBMYXlhLkhhbmRsZXIpOiB2b2lkXG4gICAge1xuICAgICAgICBpZiAoYXRsYXNVcmwgIT0gXCJcIiAmJiBhdGxhc1VybCAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXMoYW5pVXJsKSAhPSBudWxsICYmIExheWEubG9hZGVyLmdldFJlcyhhdGxhc1VybCkgIT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKGFuaVVybCkgIT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoYW5pVXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGF0bGFzVXJsICE9IG51bGwgJiYgYXRsYXNVcmwgIT0gXCJcIilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKGF0bGFzVXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uTGlzdFthbmlVcmxdID0gYXRsYXNVcmw7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgICAgICB9KSwgbnVsbCwgTGF5YS5Mb2FkZXIuQVRMQVMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBudWxsLCBmYWxzZSksIG51bGwsIExheWEuTG9hZGVyLkpTT04pO1xuICAgIH1cblxuICAgIFxuICAgIHB1YmxpYyBnZXRTcGluZSh1cmwgOiBzdHJpbmcpIDogTGF5YS5UZW1wbGV0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BpbmVMaXN0W3VybF07XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVNwaW5lKHVybCA6IHN0cmluZywgYW5pbWF0aW9uPzogc3RyaW5nLCBsb29wIDogYm9vbGVhbiA9IHRydWUsIGNhbGxiayA6IExheWEuSGFuZGxlciA9IG51bGwpIDogTGF5YS5Ta2VsZXRvbiB7XG4gICAgICAgIHZhciBzazogTGF5YS5Ta2VsZXRvbjtcbiAgICAgICAgaWYgKHRoaXMuc3BpbmVMaXN0W3VybF0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNrID0gdGhpcy5zcGluZUxpc3RbdXJsXS5idWlsZEFybWF0dXJlKDApO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbiAhPSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNrLnBsYXkoYW5pbWF0aW9uLCBsb29wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhbGxiayAhPSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhbGxiay5ydW5XaXRoKHNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNrID0gbmV3IExheWEuU2tlbGV0b24oKTtcbiAgICAgICAgICAgIHRoaXMubG9hZFNwaW5lKHVybCwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2suaW5pdCh0aGlzLnNwaW5lTGlzdFt1cmxdLCAwKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uICE9IG51bGwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzay5wbGF5KGFuaW1hdGlvbiwgbG9vcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiayAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJrLnJ1bldpdGgoc2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBza1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVBbmltYXRpb24odXJsOiBzdHJpbmcsIGFuaW1hdGlvbj86IHN0cmluZyk6IExheWEuQW5pbWF0aW9uXG4gICAge1xuICAgICAgICB2YXIgYW5pOiBMYXlhLkFuaW1hdGlvbiA9IG5ldyBMYXlhLkFuaW1hdGlvbigpO1xuICAgICAgICBhbmkuc291cmNlID0gdXJsO1xuICAgICAgICBpZiAoYW5pbWF0aW9uKVxuICAgICAgICB7XG4gICAgICAgICAgICBhbmkucGxheShudWxsLCB0cnVlLCBhbmltYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0VGV4dHVyZSh1cmwgOiBzdHJpbmcsIGNhbGxiayA6IExheWEuSGFuZGxlcikgOiB2b2lkIHtcbiAgICAgICAgbGV0IHJlcyA9IExheWEubG9hZGVyLmdldFJlcyh1cmwpO1xuXG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIGNhbGxiay5ydW5XaXRoKHJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRUZXh0dXJlKHVybCwgY2FsbGJrKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cnlHZXRUZXh0dXJlKHVybCA6IHN0cmluZykgOiBMYXlhLlRleHR1cmUyRCB7XG4gICAgICAgIGxldCByZXMgPSBMYXlhLmxvYWRlci5nZXRSZXModXJsKTtcblxuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlkeCA6IG51bWJlciA9IDA7XG4gICAgcHVibGljIGxvYWRMaXN0KHVybHMgOiBzdHJpbmdbXSxjYWxsZXIgOiBhbnksIG9uUHJvZ3Jlc3MgOiAoaW5kZXggOiBudW1iZXIsIHRvdGFsIDogbnVtYmVyKSA9PiB2b2lkLCBvbkNvbXBsZXRlIDogKCkgPT4gdm9pZCkgOiBSZXNNZ3JcbiAgICB7XG4gICAgICAgIGlmKHVybHMubGVuZ3RoID09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUuY2FsbChjYWxsZXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpdGVtICA9IHtcbiAgICAgICAgICAgIGlkIDogdGhpcy5pZHgsXG4gICAgICAgICAgICB1cmxzIDogdXJscyxcbiAgICAgICAgICAgIGNhbGxlciA6IGNhbGxlcixcbiAgICAgICAgICAgIGluZGV4IDogMCxcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3M6b25Qcm9ncmVzcyxcbiAgICAgICAgICAgIG9uQ29tcGxldGUgOiBvbkNvbXBsZXRlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pZHggKys7XG4gICAgICAgIHRoaXMuc3RhcnRMb2FkKGl0ZW0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRMb2FkIChpdGVtIDogbG9hZEl0ZW0pIDogdm9pZFxuICAgIHtcbiAgICAgICAgaWYoaXRlbS51cmxzLmxlbmd0aCA8PSBpdGVtLmluZGV4KVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihpdGVtLm9uQ29tcGxldGUgIT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpdGVtLm9uQ29tcGxldGUuY2FsbChpdGVtLmNhbGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVybCA9IGl0ZW0udXJsc1tpdGVtLmluZGV4XTtcbiAgICAgICAgXG4gICAgICAgIGl0ZW0uaW5kZXgrKztcbiAgICAgICAgaWYoaXRlbS5vblByb2dyZXNzICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGl0ZW0ub25Qcm9ncmVzcy5jYWxsKGl0ZW0uY2FsbGVyLGl0ZW0uaW5kZXgsaXRlbS51cmxzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkT25jZSh1cmwsIHRoaXMuc3RhcnRMb2FkLCBpdGVtKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRPbmNlKHVybCA6IGFueSwgY2FsbEJhY2sgOiAoaXRlbSA6IGxvYWRJdGVtKSA9PiB2b2lkLGl0ZW0gOiBsb2FkSXRlbSkgOiB2b2lkXG4gICAge1xuICAgICAgICBpZih1cmwgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVybCA9IHVybC51cmw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGUgOiBzdHJpbmcgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcuJykgKyAxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgZiAgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24ocGFyX2NhbGxCayxwYXJfdGhpcyxwYXJfaXRlbSxwYXJfdXJsKSA6IHZvaWR7XG4gICAgICAgICAgICBwYXJfY2FsbEJrLmNhbGwocGFyX3RoaXMscGFyX2l0ZW0pO1xuICAgICAgICB9LFtjYWxsQmFjayx0aGlzLGl0ZW0sdXJsXSk7XG4gICAgICAgIHN3aXRjaCh0eXBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIFwicG5nXCI6XG4gICAgICAgICAgICAgICAgaWYodXJsLmluZGV4T2YoXCJ0ZXh0dXJlL1wiKSA9PSAtMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQTkcodXJsLGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dHVyZSh1cmwsZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNrXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3BpbmUodXJsLCBmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsaFwiOlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZE1vZGVsKHVybCwgZik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICAgICAgY2FzZSBcImxhbmdcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRKc29uKHVybCxmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhdGxhc1wiOlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEF0bGFzKHVybCxmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhbmlcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRBbmltYXRpb24odXJsLCBudWxsLCBmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKHVybCxmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBVUkkgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHByZWZhYlVybCAgPSBcInByZWZhYi9cIjtcclxuICAgIHB1YmxpYyBzdGF0aWMgc3BpbmVVcmwgID0gXCJyZXMvc3BpbmUvXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNvdW5kVXJsICA9IFwic291bmQvXCI7XHJcbn0iLCIvKipcclxuICog5a2Q5by56ISa5pys77yM5a6e546w5a2Q5by56aOe6KGM6YC76L6R5Y+K5a+56LGh5rGg5Zue5pS25py65Yi2XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWxsZXQgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8v6K6+572u5Yid5aeL6YCf5bqmXHJcbiAgICAgICAgdmFyIHJpZzogTGF5YS5SaWdpZEJvZHkgPSB0aGlzLm93bmVyLmdldENvbXBvbmVudChMYXlhLlJpZ2lkQm9keSk7XHJcbiAgICAgICAgcmlnLnNldFZlbG9jaXR5KHsgeDogMCwgeTogLTEwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVHJpZ2dlckVudGVyKG90aGVyOiBhbnksIHNlbGY6IGFueSwgY29udGFjdDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgLy/lpoLmnpzooqvnorDliLDvvIzliJnnp7vpmaTlrZDlvLlcclxuICAgICAgICB0aGlzLm93bmVyLnJlbW92ZVNlbGYoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvL+WmguaenOWtkOW8uei2heWHuuWxj+W5le+8jOWImeenu+mZpOWtkOW8uVxyXG4gICAgICAgIGlmICgodGhpcy5vd25lciBhcyBMYXlhLlNwcml0ZSkueSA8IC0xMCkge1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLnJlbW92ZVNlbGYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8v5a2Q5by56KKr56e76Zmk5pe277yM5Zue5pS25a2Q5by55Yiw5a+56LGh5rGg77yM5pa55L6/5LiL5qyh5aSN55So77yM5YeP5bCR5a+56LGh5Yib5bu65byA6ZSAXHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJidWxsZXRcIiwgdGhpcy5vd25lcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZVVJIGZyb20gXCIuL0dhbWVVSVwiO1xyXG4vKipcclxuICog5o6J6JC955uS5a2Q6ISa5pys77yM5a6e546w55uS5a2Q56Kw5pKe5Y+K5Zue5pS25rWB56iLXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcm9wQm94IGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgLyoq55uS5a2Q562J57qnICovXHJcbiAgICBsZXZlbDogbnVtYmVyID0gMTtcclxuICAgIC8qKuetiee6p+aWh+acrOWvueixoeW8leeUqCAqL1xyXG4gICAgcHJpdmF0ZSBfdGV4dDogTGF5YS5UZXh0O1xyXG4gICAgLyoq5Yia5L2T5a+56LGh5byV55SoICovXHJcbiAgICBwcml2YXRlIF9yaWc6IExheWEuUmlnaWRCb2R5XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8qKuiOt+W+l+e7hOS7tuW8leeUqO+8jOmBv+WFjeavj+asoeiOt+WPlue7hOS7tuW4puadpeS4jeW/heimgeeahOafpeivouW8gOmUgCAqL1xyXG4gICAgICAgIHRoaXMuX3JpZyA9IHRoaXMub3duZXIuZ2V0Q29tcG9uZW50KExheWEuUmlnaWRCb2R5KTtcclxuICAgICAgICB0aGlzLmxldmVsID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogNSkgKyAxO1xyXG4gICAgICAgIHRoaXMuX3RleHQgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKFwibGV2ZWxUeHRcIikgYXMgTGF5YS5UZXh0O1xyXG4gICAgICAgIHRoaXMuX3RleHQudGV4dCA9IHRoaXMubGV2ZWwgKyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8v6K6p5oyB57ut55uS5a2Q5peL6L2sXHJcbiAgICAgICAgKHRoaXMub3duZXIgYXMgTGF5YS5TcHJpdGUpLnJvdGF0aW9uKys7XHJcbiAgICB9XHJcblxyXG4gICAgb25UcmlnZ2VyRW50ZXIob3RoZXI6IGFueSwgc2VsZjogYW55LCBjb250YWN0OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB2YXIgb3duZXI6IExheWEuU3ByaXRlID0gdGhpcy5vd25lciBhcyBMYXlhLlNwcml0ZTtcclxuICAgICAgICBpZiAob3RoZXIubGFiZWwgPT09IFwiYnV0dGxlXCIpIHtcclxuICAgICAgICAgICAgLy/norDmkp7liLDlrZDlvLnlkI7vvIzlop7liqDnp6/liIbvvIzmkq3mlL7lo7Dpn7PnibnmlYhcclxuICAgICAgICAgICAgaWYgKHRoaXMubGV2ZWwgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxldmVsLS07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0LmNoYW5nZVRleHQodGhpcy5sZXZlbCArIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgb3duZXIuZ2V0Q29tcG9uZW50KExheWEuUmlnaWRCb2R5KS5zZXRWZWxvY2l0eSh7IHg6IDAsIHk6IC0xMCB9KTtcclxuICAgICAgICAgICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChcInNvdW5kL2hpdC53YXZcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3duZXIucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVmZmVjdDogTGF5YS5BbmltYXRpb24gPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiZWZmZWN0XCIsIHRoaXMuY3JlYXRlRWZmZWN0LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBlZmZlY3QucG9zKG93bmVyLngsIG93bmVyLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLnBhcmVudC5hZGRDaGlsZChlZmZlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdC5wbGF5KDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLnJlbW92ZVNlbGYoKTtcclxuICAgICAgICAgICAgICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoXCJzb3VuZC9kZXN0cm95LndhdlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBHYW1lVUkuaW5zdGFuY2UuYWRkU2NvcmUoMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvdGhlci5sYWJlbCA9PT0gXCJncm91bmRcIikge1xyXG4gICAgICAgICAgICAvL+WPquimgeacieS4gOS4quebkuWtkOeisOWIsOWcsOadv++8jOWImeWBnOatoua4uOaIj1xyXG4gICAgICAgICAgICBvd25lci5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgICAgIEdhbWVVSS5pbnN0YW5jZS5zdG9wR2FtZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirkvb/nlKjlr7nosaHmsaDliJvlu7rniIbngrjliqjnlLsgKi9cclxuICAgIGNyZWF0ZUVmZmVjdCgpOiBMYXlhLkFuaW1hdGlvbiB7XHJcbiAgICAgICAgbGV0IGFuaTogTGF5YS5BbmltYXRpb24gPSBuZXcgTGF5YS5BbmltYXRpb24oKTtcclxuICAgICAgICBhbmkubG9hZEFuaW1hdGlvbihcInRlc3QvVGVzdEFuaS5hbmlcIik7XHJcbiAgICAgICAgYW5pLm9uKExheWEuRXZlbnQuQ09NUExFVEUsIG51bGwsIHJlY292ZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlY292ZXIoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGFuaS5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFwiZWZmZWN0XCIsIGFuaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbmk7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIC8v55uS5a2Q6KKr56e76Zmk5pe277yM5Zue5pS255uS5a2Q5Yiw5a+56LGh5rGg77yM5pa55L6/5LiL5qyh5aSN55So77yM5YeP5bCR5a+56LGh5Yib5bu65byA6ZSA44CCXHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJkcm9wQm94XCIsIHRoaXMub3duZXIpO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCBEcm9wQm94IGZyb20gXCIuL0Ryb3BCb3hcIjtcclxuaW1wb3J0IEJ1bGxldCBmcm9tIFwiLi9CdWxsZXRcIjtcclxuLyoqXHJcbiAqIOa4uOaIj+aOp+WItuiEmuacrOOAguWumuS5ieS6huWHoOS4qmRyb3BCb3jvvIxidWxsZXTvvIxjcmVhdGVCb3hJbnRlcnZhbOetieWPmOmHj++8jOiDveWkn+WcqElEReaYvuekuuWPiuiuvue9ruivpeWPmOmHj1xyXG4gKiDmm7TlpJrnsbvlnovlrprkuYnvvIzor7flj4LogIPlrpjmlrnmlofmoaNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb250cm9sIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOmRyb3BCb3gsdGlwczpcIuaOieiQveWuueWZqOmihOWItuS9k+WvueixoVwiLHR5cGU6UHJlZmFifSovXHJcbiAgICBkcm9wQm94OiBMYXlhLlByZWZhYjtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpidWxsZXQsdGlwczpcIuWtkOW8uemihOWItuS9k+WvueixoVwiLHR5cGU6UHJlZmFifSovXHJcbiAgICBidWxsZXQ6IExheWEuUHJlZmFiO1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOmNyZWF0ZUJveEludGVydmFsLHRpcHM6XCLpl7TpmpTlpJrlsJHmr6vnp5LliJvlu7rkuIDkuKrkuIvot4znmoTlrrnlmahcIix0eXBlOmludCxkZWZhdWx0OjEwMDB9Ki9cclxuICAgIGNyZWF0ZUJveEludGVydmFsOiBudW1iZXIgPSAxMDAwO1xyXG4gICAgLyoq5byA5aeL5pe26Ze0Ki9cclxuICAgIHByaXZhdGUgX3RpbWU6IG51bWJlciA9IDA7XHJcbiAgICAvKirmmK/lkKblt7Lnu4/lvIDlp4vmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgX3N0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKuWtkOW8ueWSjOebkuWtkOaJgOWcqOeahOWuueWZqOWvueixoSAqL1xyXG4gICAgcHJpdmF0ZSBfZ2FtZUJveDogTGF5YS5TcHJpdGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl90aW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLl9nYW1lQm94ID0gdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZShcImdhbWVCb3hcIikgYXMgTGF5YS5TcHJpdGU7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy/mr4/pl7TpmpTkuIDmrrXml7bpl7TliJvlu7rkuIDkuKrnm5LlrZBcclxuICAgICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBpZiAobm93IC0gdGhpcy5fdGltZSA+IHRoaXMuY3JlYXRlQm94SW50ZXJ2YWwmJnRoaXMuX3N0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZSA9IG5vdztcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVCb3goKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQm94KCk6IHZvaWQge1xyXG4gICAgICAgIC8v5L2/55So5a+56LGh5rGg5Yib5bu655uS5a2QXHJcbiAgICAgICAgbGV0IGJveDogTGF5YS5TcHJpdGUgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiZHJvcEJveFwiLCB0aGlzLmRyb3BCb3guY3JlYXRlLCB0aGlzLmRyb3BCb3gpO1xyXG4gICAgICAgIGJveC5wb3MoTWF0aC5yYW5kb20oKSAqIChMYXlhLnN0YWdlLndpZHRoIC0gMTAwKSwgLTEwMCk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJveC5hZGRDaGlsZChib3gpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3RhZ2VDbGljayhlOiBMYXlhLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgLy/lgZzmraLkuovku7blhpLms6HvvIzmj5Dpq5jmgKfog73vvIzlvZPnhLbkuZ/lj6/ku6XkuI3opoFcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIC8v6Iie5Y+w6KKr54K55Ye75ZCO77yM5L2/55So5a+56LGh5rGg5Yib5bu65a2Q5by5XHJcbiAgICAgICAgbGV0IGZseWVyOiBMYXlhLlNwcml0ZSA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJidWxsZXRcIiwgdGhpcy5idWxsZXQuY3JlYXRlLCB0aGlzLmJ1bGxldCk7XHJcbiAgICAgICAgZmx5ZXIucG9zKExheWEuc3RhZ2UubW91c2VYLCBMYXlhLnN0YWdlLm1vdXNlWSk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJveC5hZGRDaGlsZChmbHllcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5byA5aeL5ri45oiP77yM6YCa6L+H5r+A5rS75pys6ISa5pys5pa55byP5byA5aeL5ri45oiPKi9cclxuICAgIHN0YXJ0R2FtZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKue7k+adn+a4uOaIj++8jOmAmui/h+mdnua/gOa0u+acrOiEmuacrOWBnOatoua4uOaIjyAqL1xyXG4gICAgc3RvcEdhbWUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQm94SW50ZXJ2YWwgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCb3gucmVtb3ZlQ2hpbGRyZW4oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4vLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBHYW1lQ29udHJvbCBmcm9tIFwiLi9HYW1lQ29udHJvbFwiXHJcbi8qKlxyXG4gKiDmnKznpLrkvovph4fnlKjpnZ7ohJrmnKznmoTmlrnlvI/lrp7njrDvvIzogIzkvb/nlKjnu6fmib/pobXpnaLln7rnsbvvvIzlrp7njrDpobXpnaLpgLvovpHjgILlnKhJREXph4zpnaLorr7nva7lnLrmma/nmoRSdW50aW1l5bGe5oCn5Y2z5Y+v5ZKM5Zy65pmv6L+b6KGM5YWz6IGUXHJcbiAqIOebuOavlOiEmuacrOaWueW8j++8jOe7p+aJv+W8j+mhtemdouexu++8jOWPr+S7peebtOaOpeS9v+eUqOmhtemdouWumuS5ieeahOWxnuaAp++8iOmAmui/h0lEReWGhXZhcuWxnuaAp+WumuS5ie+8ie+8jOavlOWmgnRoaXMudGlwTGJsbO+8jHRoaXMuc2NvcmVMYmzvvIzlhbfmnInku6PnoIHmj5DnpLrmlYjmnpxcclxuICog5bu66K6u77ya5aaC5p6c5piv6aG16Z2i57qn55qE6YC76L6R77yM6ZyA6KaB6aKR57mB6K6/6Zeu6aG16Z2i5YaF5aSa5Liq5YWD57Sg77yM5L2/55So57un5om/5byP5YaZ5rOV77yM5aaC5p6c5piv54us56uL5bCP5qih5Z2X77yM5Yqf6IO95Y2V5LiA77yM5bu66K6u55So6ISa5pys5pa55byP5a6e546w77yM5q+U5aaC5a2Q5by56ISa5pys44CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lVUkgZXh0ZW5kcyB1aS50ZXN0LlRlc3RTY2VuZVVJIHtcclxuICAgIC8qKuiuvue9ruWNleS+i+eahOW8leeUqOaWueW8j++8jOaWueS+v+WFtuS7luexu+W8leeUqCAqL1xyXG4gICAgc3RhdGljIGluc3RhbmNlOiBHYW1lVUk7XHJcbiAgICAvKirlvZPliY3muLjmiI/np6/liIblrZfmrrUgKi9cclxuICAgIHByaXZhdGUgX3Njb3JlOiBudW1iZXI7XHJcbiAgICAvKirmuLjmiI/mjqfliLbohJrmnKzlvJXnlKjvvIzpgb/lhY3mr4/mrKHojrflj5bnu4Tku7bluKbmnaXkuI3lv4XopoHnmoTmgKfog73lvIDplIAgKi9cclxuICAgIHByaXZhdGUgX2NvbnRyb2w6IEdhbWVDb250cm9sO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgR2FtZVVJLmluc3RhbmNlID0gdGhpcztcclxuICAgICAgICAvL+WFs+mXreWkmueCueinpuaOp++8jOWQpuWImeWwseaXoOaVjOS6hlxyXG4gICAgICAgIExheWEuTW91c2VNYW5hZ2VyLm11bHRpVG91Y2hFbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbCA9IHRoaXMuZ2V0Q29tcG9uZW50KEdhbWVDb250cm9sKTtcclxuICAgICAgICAvL+eCueWHu+aPkOekuuaWh+Wtl++8jOW8gOWni+a4uOaIj1xyXG4gICAgICAgIHRoaXMudGlwTGJsbC5vbihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLm9uVGlwQ2xpY2spO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVGlwQ2xpY2soZTogTGF5YS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudGlwTGJsbC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuc2NvcmVMYmwudGV4dCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbC5zdGFydEdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlop7liqDliIbmlbAgKi9cclxuICAgIGFkZFNjb3JlKHZhbHVlOiBudW1iZXIgPSAxKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2NvcmUgKz0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zY29yZUxibC5jaGFuZ2VUZXh0KFwi5YiG5pWw77yaXCIgKyB0aGlzLl9zY29yZSk7XHJcbiAgICAgICAgLy/pmo/nnYDliIbmlbDotorpq5jvvIzpmr7luqblop7lpKdcclxuICAgICAgICBpZiAodGhpcy5fY29udHJvbC5jcmVhdGVCb3hJbnRlcnZhbCA+IDYwMCAmJiB0aGlzLl9zY29yZSAlIDIwID09IDApIHRoaXMuX2NvbnRyb2wuY3JlYXRlQm94SW50ZXJ2YWwgLT0gMjA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5YGc5q2i5ri45oiPICovXHJcbiAgICBzdG9wR2FtZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRpcExibGwudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy50aXBMYmxsLnRleHQgPSBcIua4uOaIj+e7k+adn+S6hu+8jOeCueWHu+Wxj+W5lemHjeaWsOW8gOWni1wiO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2wuc3RvcEdhbWUoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJCYXNlIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NvbnRyb2xsZXJPYmpzID0ge307XHJcbiAgICBwdWJsaWMgZ2V0U2lnbigpIDogc3RyaW5nXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCJfX3Byb3RvX19cIl0uY29uc3RydWN0b3IubmFtZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2U8VD4oYyA6IG5ldygpID0+IFQpIDogVFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGxldCBzaWduID0gY1tcIm5hbWVcIl07XHJcbiAgICAvLyAgICAgbGV0IGl0ZW0gPSBDb250cm9sbGVyQmFzZS5fY29udHJvbGxlck9ianNbc2lnbl07XHJcbiAgICAvLyAgICAgaWYoaXRlbSA9PSBudWxsKVxyXG4gICAgLy8gICAgIHtcclxuICAgIC8vICAgICAgICAgaXRlbSA9IG5ldyBjKCk7XHJcbiAgICAvLyAgICAgICAgIENvbnRyb2xsZXJCYXNlLl9jb250cm9sbGVyT2Jqc1tzaWduXSA9IGl0ZW07XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHJldHVybiBpdGVtO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBzaG93KCkgOiB2b2lke1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKSA6IHZvaWR7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95KCkgOiB2b2lke1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvbnRyb2xsZXJCYXNlIGZyb20gXCIuL0NvbnRyb2xsZXJCYXNlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyTWdyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9jb250cm9sbGVyT2JqcyA9IHt9O1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZTxUIGV4dGVuZHMgQ29udHJvbGxlckJhc2U+KGMgOiBuZXcoKSA9PiBUKSA6IFRcclxuICAgIHtcclxuICAgICAgICBsZXQgc2lnbiA9IGNbXCJuYW1lXCJdO1xyXG4gICAgICAgIGxldCBpdGVtID0gQ29udHJvbGxlck1nci5fY29udHJvbGxlck9ianNbc2lnbl07XHJcbiAgICAgICAgaWYoaXRlbSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXRlbSA9IG5ldyBjKCk7XHJcbiAgICAgICAgICAgIENvbnRyb2xsZXJNZ3IuX2NvbnRyb2xsZXJPYmpzW3NpZ25dID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ29udHJvbGxlckJhc2UgZnJvbSBcIi4vQ29udHJvbGxlckJhc2VcIjtcclxuaW1wb3J0IFBsYXllckluZm8gZnJvbSBcIi4uL21vZGVsL1BsYXllckluZm9cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckNvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyQmFzZSB7XHJcbiAgICBwdWJsaWMgbXlQbGF5ZXJJbmZvID0gbmV3IFBsYXllckluZm8oKTtcclxufSIsImltcG9ydCBDb250cm9sbGVyQmFzZSBmcm9tIFwiLi9Db250cm9sbGVyQmFzZVwiO1xyXG5pbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi4vLi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgVGlwSXRlbSBmcm9tIFwiLi4vcHJlZmViL1RpcEl0ZW1cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpcENvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyQmFzZSB7XHJcbiAgICBwcml2YXRlIF90aXBTcHIgOiBMYXlhLlNwcml0ZTtcclxuICAgIHB1YmxpYyBnZXQgdGlwU3ByKCkgOiBMYXlhLlNwcml0ZVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aXBTcHI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaW5pdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3RpcFNwciA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3RpcFNwci5uYW1lID0gXCJUaXBTcHJcIjtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX3RpcFNwcik7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChcInByZWZhYi9UaXBJdGVtLmpzb25cIixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWRUaXBJdGVtQ29tcGxldGUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF90aXBJdGVtUHJlZmFiIDogTGF5YS5QcmVmYWI7XHJcbiAgICBwcml2YXRlIG9uTG9hZFRpcEl0ZW1Db21wbGV0ZSgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl90aXBJdGVtUHJlZmFiID0gbmV3IExheWEuUHJlZmFiKCk7XHJcbiAgICAgICAgdGhpcy5fdGlwSXRlbVByZWZhYi5qc29uID0gTGF5YS5sb2FkZXIuZ2V0UmVzKFwicHJlZmFiL1RpcEl0ZW0uanNvblwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9sYWJlbHMgOiBMYXlhLkxhYmVsW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3N0YXJ0WSA9IDk2MDtcclxuICAgIHB1YmxpYyBzaG93TGVmdEJvdHRvbVRpcCh0ZXh0IDogc3RyaW5nKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gbmV3IExheWEuTGFiZWwoKTtcclxuICAgICAgICBsYWJlbC5jb2xvciA9IFwiIzIwNDgwMFwiO1xyXG4gICAgICAgIGxhYmVsLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIGxhYmVsLmZvbnQgPSBcIlNpbUhlaVwiO1xyXG4gICAgICAgIGxhYmVsLmZvbnRTaXplID0gMzA7XHJcbiAgICAgICAgbGFiZWwuYW5jaG9yWSA9IDE7XHJcbiAgICAgICAgbGFiZWwueSA9IHRoaXMuX3N0YXJ0WTtcclxuICAgICAgICB0aGlzLl90aXBTcHIuYWRkQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgIHRoaXMuX2xhYmVscy5wdXNoKGxhYmVsKTtcclxuICAgICAgICB0aGlzLnNvcnRMYWJlbHMoKTtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICBMYXlhLlR3ZWVuLnRvKGxhYmVsLHthbHBoYSA6IDB9LDMwMClcclxuICAgICAgICB9KTtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTMwMCx0aGlzLCBmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgdGhpcy5fbGFiZWxzLnNwbGljZSh0aGlzLl9sYWJlbHMuaW5kZXhPZihsYWJlbCksMSlcclxuICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhckFsbChsYWJlbCk7XHJcbiAgICAgICAgICAgIGxhYmVsLmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNvcnRMYWJlbHMoKSA6IHZvaWR7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyOyBpIDwgdGhpcy5fbGFiZWxzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5fbGFiZWxzW2ldO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0WSA9IHRoaXMuX3N0YXJ0WSAtIDQwICogaTtcclxuICAgICAgICAgICAgTGF5YS5Ud2Vlbi50byhsYWJlbCx7eSA6IHRhcmdldFl9LDEwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RpcEl0ZW1zID0gW107XHJcbiAgICBwcml2YXRlIF90aXBJdGVtU3RhcnRZICA9IDU1MDtcclxuICAgIHB1YmxpYyBzaG93VGlwKHR4dCA6IHN0cmluZykgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX3RpcEl0ZW1QcmVmYWIgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0aXBJdGVtU3ByID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcIlRpcEl0ZW1cIix0aGlzLl90aXBJdGVtUHJlZmFiLmNyZWF0ZSx0aGlzLl90aXBJdGVtUHJlZmFiKTtcclxuICAgICAgICAgICAgbGV0IHRpcEl0ZW1TY3JpcHQgPSB0aXBJdGVtU3ByLmdldENvbXBvbmVudChUaXBJdGVtKSBhcyBUaXBJdGVtO1xyXG4gICAgICAgICAgICB0aXBJdGVtU2NyaXB0LnRleHQgPSB0eHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpcFNwci5hZGRDaGlsZCh0aXBJdGVtU3ByKTtcclxuICAgICAgICAgICAgdGlwSXRlbVNwci54ID0gKEdhbWVDb25maWcud2lkdGggLSB0aXBJdGVtU3ByLndpZHRoKSAvIDI7XHJcbiAgICAgICAgICAgIHRpcEl0ZW1TcHIueSA9IHRoaXMuX3RpcEl0ZW1TdGFydFkgLSA2MDtcclxuICAgICAgICAgICAgdGhpcy5fdGlwSXRlbXMucHVzaCh0aXBJdGVtU3ByKTtcclxuICAgICAgICAgICAgdGhpcy5zb3J0VGlwSXRlbXMoKTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIExheWEuVHdlZW4udG8odGlwSXRlbVNwcix7YWxwaGEgOiAwfSwzMDApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTMwMCx0aGlzLCBmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpcEl0ZW1zLnNwbGljZSh0aGlzLl90aXBJdGVtcy5pbmRleE9mKHRpcEl0ZW1TcHIpLDEpXHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRpcEl0ZW1TcHIpO1xyXG4gICAgICAgICAgICAgICAgdGlwSXRlbVNwci5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNvcnRUaXBJdGVtcygpIDogdm9pZHtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5fdGlwSXRlbXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLl90aXBJdGVtc1tpXTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFkgPSB0aGlzLl90aXBJdGVtU3RhcnRZIC0gNjAgKiAodGhpcy5fdGlwSXRlbXMubGVuZ3RoIC0gaSk7XHJcbiAgICAgICAgICAgIExheWEuVHdlZW4udG8obGFiZWwse3kgOiB0YXJnZXRZfSwxMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiXHJcbmltcG9ydCBNb2RlbEJhc2UgZnJvbSBcIi4vTW9kZWxCYXNlXCI7XHJcbmltcG9ydCB7IFJlc01nciB9IGZyb20gXCIuLi8uLi9SZXNNZ3JcIjtcclxuaW1wb3J0IFVSSSBmcm9tIFwiLi4vLi4vVVJJXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEZvbnRJbmZvIGV4dGVuZHMgTW9kZWxCYXNle1xyXG4gICAgcHVibGljIHN0YXRpYyBEYXRhU291cmNlIDogb2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2dyb3VwQ2FjaGUgPSB7fTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0R3JvdXAoZm9udCA6IHN0cmluZykgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIGlmKE1hcEZvbnRJbmZvLl9ncm91cENhY2hlW2ZvbnRdID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZ3JvdXBcIl0ubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wR3JvdXAgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZ3JvdXBcIl1baV07XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wR3JvdXAuaW5kZXhPZihmb250KSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh0ZW1wR3JvdXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE1hcEZvbnRJbmZvLl9ncm91cENhY2hlW2ZvbnRdID0gYXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uX2dyb3VwQ2FjaGVbZm9udF07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaWQgOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdGV4dCA6IHN0cmluZztcclxuICAgIHB1YmxpYyBzdHJ1Y3RJbmZvIDogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyB4IDogbnVtYmVyO1xyXG4gICAgcHVibGljIHkgOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9xdWFsaXR5IDogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBnZXQgcXVhbGl0eSAoKSA6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5fcXVhbGl0eTtcclxuICAgIH1cclxuICAgIC8vMSwyLDMsNCDliJ3lp4vkuLox77yM5rKh5ZCI5oiQ5LiA5qyh5Y2H57qn77yM5pyA6auYNOe6p1xyXG4gICAgcHVibGljIHNldCBxdWFsaXR5KHZhbHVlIDogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICBpZih2YWx1ZSA+IDQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3F1YWxpdHkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIF9wb29sID0gW107XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkYXRhPyA6IE9iamVjdCkgOiBNYXBGb250SW5mb1xyXG4gICAge1xyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wb29sc1snTWFwRm9udEluZm8nXSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBGb250SW5mbyddID0ge3NpZ24gOiAnTWFwRm9udEluZm8nLCBwb29sIDogTWFwRm9udEluZm8uX3Bvb2wsIGNyZWF0ZUNvdW50IDogMCwgcmVjb3ZlckNvdW50IDogMH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwRm9udEluZm8nXS5jcmVhdGVDb3VudCArKztcclxuICAgICAgICBsZXQgY291dDtcclxuICAgICAgICBpZihNYXBGb250SW5mby5fcG9vbC5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dCA9IE1hcEZvbnRJbmZvLl9wb29sLnBvcCgpO1xyXG4gICAgICAgICAgICBjb3V0LmlzUmVjb3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dCA9IG5ldyBNYXBGb250SW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkYXRhICE9IG51bGwpXHJcbiAgICAgICAgICAgIGNvdXQuc2V0RGF0YUJ5S2V5KGRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2hlQ2hlbmdDaVp1T2JqID0ge307XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWPr+WQiOaIkOivjee7hFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGNhbkhlQ2hlbmdHcm91cCgpIDogYm9vbGVhbntcclxuICAgICAgICBpZihNYXBGb250SW5mby5faGVDaGVuZ0NpWnVPYmpbdGhpcy50ZXh0XSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNvdXQgPSBbXTtcclxuICAgICAgICAgICAgTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImdyb3VwXCJdLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50LmluZGV4T2YodGhpcy50ZXh0KSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3V0LnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBNYXBGb250SW5mby5faGVDaGVuZ0NpWnVPYmpbdGhpcy50ZXh0XSA9IGNvdXQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uX2hlQ2hlbmdDaVp1T2JqW3RoaXMudGV4dF0ubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNhbkhlQ2hlbmdHcm91cHMoKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5jYW5IZUNoZW5nR3JvdXApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uX2hlQ2hlbmdDaVp1T2JqW3RoaXMudGV4dF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrmZvbnRJZCzmib7lh7rkvb/nlKjov5nkuKppZOeahOe7hOWQiOWIl+ihqCzmnKrkvKDlhaVmb250SWTvvIzliJnovpPlh7rmiYDmnInnu4TlkIjliJfooahcclxuICAgICAqIEBwYXJhbSBpZCBmb250IGlkXHJcbiAgICAgKiBAcGFyYW0gaXNFeGNlcHRTZWxmIOaYr+WQpuaOkumZpOiHquW3sVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0U3RydWN0SW5mb3MoZm9udElkIDogbnVtYmVyID0gbnVsbCxpc0V4Y2VwdFNlbGYgOiBib29sZWFuID0gdHJ1ZSkgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIGxldCBjb3V0ID0gW107XHJcbiAgICAgICAgaWYoZm9udElkID09IHRoaXMuaWQgJiYgaXNFeGNlcHRTZWxmID09IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dC5wdXNoKGZvbnRJZC50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RydWN0SW5mby5zcGxpdChcIixcIikuZm9yRWFjaChlbGVtZW50ID0+e1xyXG4gICAgICAgICAgICAgICAgaWYoZm9udElkID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWxlbWVudCA9PSB0aGlzLmlkLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvdXQucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihpc0V4Y2VwdFNlbGYgJiYgZWxlbWVudCA9PSBmb250SWQudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWxlbWVudC5zcGxpdChcIl9cIikuaW5kZXhPZihmb250SWQudG9TdHJpbmcoKSkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3V0LnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9oZUNoZW5nSGFuWmlPYmogPSB7fTtcclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5Y+v5ZCI5oiQ5YW25LuW5rGJ5a2QXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgY2FuSGVDaGVuZ0ZvbnQoKSA6IGJvb2xlYW57XHJcbiAgICAgICAgaWYoTWFwRm9udEluZm8uX2hlQ2hlbmdIYW5aaU9ialt0aGlzLnRleHRdID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgY291dCA9IFtdO1xyXG4gICAgICAgICAgICBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udFwiXS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBmb250SW5mby5zZXREYXRhQnlWYWx1ZUFycihlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJ1Y3RJbmZvcyA9IGZvbnRJbmZvLmdldFN0cnVjdEluZm9zKHRoaXMuaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RydWN0SW5mb3MubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3V0LnB1c2goZm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTWFwRm9udEluZm8uX2hlQ2hlbmdIYW5aaU9ialt0aGlzLnRleHRdID0gY291dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLl9oZUNoZW5nSGFuWmlPYmpbdGhpcy50ZXh0XS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY2FuSGVDaGVuZ0ZvbnRJbmZvcygpIDogTWFwRm9udEluZm9bXXtcclxuICAgICAgICBpZih0aGlzLmNhbkhlQ2hlbmdGb250KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLl9oZUNoZW5nSGFuWmlPYmpbdGhpcy50ZXh0XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5piv54m55oqA5qC85a2Q77yM54m55oqA5qC85a2Q77ya6KKr5raI6Zmk5oiW5ZCI5oiQ55qE5pe25YCZ77yM5Lya6Kem5Y+R5bGP5bmV5LiK5omA5pyJ5pyJ6L+Z5Liq5rGJ5a2Q55qE5qC85a2Q5raI6ZmkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1N0dW50Rm9udCA6IGJvb2xlYW47XHJcblxyXG4gICAgcHJpdmF0ZSBfc3R1bnRGb250RWZmZWN0IDogTGF5YS5Ta2VsZXRvbjtcclxuICAgIHB1YmxpYyBnZXRTdHVudEZvbnRFZmZlY3QgKCkgOiBMYXlhLlNrZWxldG9uXHJcbiAgICB7IFxyXG4gICAgICAgIGlmKCF0aGlzLmlzU3R1bnRGb250KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3N0dW50Rm9udEVmZmVjdCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0ID0gUmVzTWdyLkluc3RhbmNlKCkuY3JlYXRlU3BpbmUoVVJJLnNwaW5lVXJsICsgXCJvdGhlcl93dXBpbmdodWFucmFvX2tpbl9saXR0bGUuc2tcIixcImFuaW1hdGlvblwiLHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3QueCA9IHRoaXMuX3N0dW50Rm9udEVmZmVjdC55ID0gNDQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdC5zY2FsZVggPSB0aGlzLl9zdHVudEZvbnRFZmZlY3Quc2NhbGVZID0gMS4zO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fc3R1bnRGb250RWZmZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95U3R1bnRFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fc3R1bnRGb250RWZmZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0LmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdHJ1Y3QoKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250X3N0cnVjdFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSZWNvdmVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9zdHVudEZvbnRFZmZlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3QuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0ID0gbnVsbDtcclxuICAgICAgICBpZihBcHBDb25maWcucG9vbHNbJ01hcEZvbnRJbmZvJ10gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwRm9udEluZm8nXSA9IHtzaWduIDogJ01hcEZvbnRJbmZvJywgcG9vbCA6IE1hcEZvbnRJbmZvLl9wb29sLCBjcmVhdGVDb3VudCA6IDAsIHJlY292ZXJDb3VudCA6IDB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcEZvbnRJbmZvJ10ucmVjb3ZlckNvdW50ICsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIE1hcEZvbnRJbmZvLl9wb29sLnB1c2godGhpcyk7XHJcbiAgICAgICAgdGhpcy5pc1JlY292ZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREYXRhQnlWYWx1ZUFycihkYXRhQXJyKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGZvbnRTdHJ1Y3QgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udF9zdHJ1Y3RcIl07XHJcbiAgICAgICAgbGV0IG9iajtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgZGF0YUFyci5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGZvbnRTdHJ1Y3QubGVuZ3RoID4gaSlcclxuICAgICAgICAgICAgICAgIHRoaXNbZm9udFN0cnVjdFtpXV0gPSBkYXRhQXJyW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGF0YUJ5S2V5KHZhbHVlIDogb2JqZWN0KSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IG9iajtcclxuICAgICAgICBsZXQgZm9udFN0cnVjdCA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250X3N0cnVjdFwiXTtcclxuICAgICAgICBsZXQgZm9udERhdGFzID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRcIl07XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IGZvbnREYXRhcy5sZW5ndGggOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZm9udEFyciA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250XCJdW2ldO1xyXG4gICAgICAgICAgICBsZXQgaXNNZWV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yKGxldCB0ZW1wUHJvcGVydHkgaW4gdmFsdWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlW3RlbXBQcm9wZXJ0eV0gIT0gZm9udEFycltmb250U3RydWN0LmluZGV4T2YodGVtcFByb3BlcnR5KV0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNNZWV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoaXNNZWV0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDA7IGogPCBmb250U3RydWN0Lmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtmb250U3RydWN0W2pdXSA9IGZvbnRBcnJbal07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmogIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiXHJcbmltcG9ydCBNb2RlbEJhc2UgZnJvbSBcIi4vTW9kZWxCYXNlXCI7XHJcbmltcG9ydCBNYXBGb250SW5mbyBmcm9tIFwiLi9NYXBGb250SW5mb1wiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBTdGFySW5mbyBleHRlbmRzIE1vZGVsQmFzZXtcclxuICAgIHB1YmxpYyBzdGFyX251bSA6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzcGVlZF9yYXRlIDogbnVtYmVyO1xyXG4gICAgcHVibGljIHNwbGl0X3JhdGUgOiBudW1iZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBfcG9vbCA9IFtdO1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZGF0YT8gOiBPYmplY3QpIDogTWFwU3RhckluZm9cclxuICAgIHtcclxuICAgICAgICBpZihBcHBDb25maWcucG9vbHNbJ01hcFN0YXJJbmZvJ10gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwU3RhckluZm8nXSA9IHtzaWduIDogJ01hcFN0YXJJbmZvJywgcG9vbCA6IE1hcFN0YXJJbmZvLl9wb29sLCBjcmVhdGVDb3VudCA6IDAsIHJlY292ZXJDb3VudCA6IDB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcFN0YXJJbmZvJ10uY3JlYXRlQ291bnQgKys7XHJcbiAgICAgICAgbGV0IGNvdXQ7XHJcbiAgICAgICAgaWYoTWFwU3RhckluZm8uX3Bvb2wubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQgPSBNYXBTdGFySW5mby5fcG9vbC5wb3AoKTtcclxuICAgICAgICAgICAgY291dC5pc1JlY292ZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQgPSBuZXcgTWFwU3RhckluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICBjb3V0LnNldERhdGFCeUtleShkYXRhKVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdHJ1Y3QoKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJzdGFyX3N0cnVjdFwiXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSZWNvdmVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihBcHBDb25maWcucG9vbHNbJ01hcFN0YXJJbmZvJ10gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwU3RhckluZm8nXSA9IHtzaWduIDogJ01hcFN0YXJJbmZvJywgcG9vbCA6IE1hcFN0YXJJbmZvLl9wb29sLCBjcmVhdGVDb3VudCA6IDAsIHJlY292ZXJDb3VudCA6IDB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcFN0YXJJbmZvJ10ucmVjb3ZlckNvdW50ICsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIE1hcFN0YXJJbmZvLl9wb29sLnB1c2godGhpcyk7XHJcbiAgICAgICAgdGhpcy5pc1JlY292ZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREYXRhQnlLZXkodmFsdWUgOiBvYmplY3QpIDogdm9pZHtcclxuICAgICAgICBsZXQgb2JqO1xyXG4gICAgICAgIGxldCBzdHJ1Y3QgPSB0aGlzLmdldFN0cnVjdCgpO1xyXG4gICAgICAgIGxldCBkYXRhcyA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJzdGFyXCJdO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBkYXRhcy5sZW5ndGggOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZm9udEFyciA9IGRhdGFzW2ldO1xyXG4gICAgICAgICAgICBsZXQgaXNNZWV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yKGxldCB0ZW1wUHJvcGVydHkgaW4gdmFsdWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlW3RlbXBQcm9wZXJ0eV0gIT0gZm9udEFycltzdHJ1Y3QuaW5kZXhPZih0ZW1wUHJvcGVydHkpXSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpc01lZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpc01lZXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMDsgaiA8IHN0cnVjdC5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbc3RydWN0W2pdXSA9IGZvbnRBcnJbal07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmogIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsQmFzZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1vZGVsSWRJbmNyZWFzZSA6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9fX19faWQgOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuX19fX19pZCA9IE1vZGVsQmFzZS5tb2RlbElkSW5jcmVhc2U7XHJcbiAgICAgICAgTW9kZWxCYXNlLm1vZGVsSWRJbmNyZWFzZSArKztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX3Bvb2wgPSBbXTtcclxuICAgIHB1YmxpYyBpc1JlY292ZXIgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfc2lnbiA6IHN0cmluZztcclxuICAgIHB1YmxpYyBzZXREYXRhKG9iaiA6IGFueSkgOiB2b2lke1xyXG4gICAgICAgIGxldCBzdHJ1Y3QgPSB0aGlzLmdldFN0cnVjdCgpO1xyXG4gICAgICAgIGlmKG9iaiBpbnN0YW5jZW9mIEFycmF5ICYmIHN0cnVjdCAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHN0cnVjdC5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tzdHJ1Y3RbaV1dID0gb2JqW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IHRlbXBQcm8gaW4gb2JqKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW3RlbXBQcm9dID0gb2JqW3RlbXBQcm9dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdHJ1Y3QoKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRTaWduKCkgOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLl9zaWduID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9zaWduID0gdGhpc1tcIl9fcHJvdG9fX1wiXS5jb25zdHJ1Y3Rvci5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2lnbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkYXRhPyA6IE9iamVjdCkgOiBNb2RlbEJhc2VcclxuICAgIHtcclxuICAgICAgICBpZihBcHBDb25maWcucG9vbHNbJ01vZGVsQmFzZSddID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBcHBDb25maWcucG9vbHNbJ01vZGVsQmFzZSddID0ge3NpZ24gOiAnTW9kZWxCYXNlJywgcG9vbCA6IE1vZGVsQmFzZS5fcG9vbCwgY3JlYXRlQ291bnQgOiAwLCByZWNvdmVyQ291bnQgOiAwfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNb2RlbEJhc2UnXS5jcmVhdGVDb3VudCArKztcclxuICAgICAgICBsZXQgY291dDtcclxuICAgICAgICBpZihNb2RlbEJhc2UuX3Bvb2wubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQgPSBNb2RlbEJhc2UuX3Bvb2wucG9wKCk7XHJcbiAgICAgICAgICAgIGNvdXQuaXNSZWNvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0ID0gbmV3IE1vZGVsQmFzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkYXRhICE9IG51bGwpXHJcbiAgICAgICAgICAgIGNvdXQuc2V0RGF0YUJ5S2V5KGRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY292ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmlzUmVjb3ZlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBvb2xzWydNb2RlbEJhc2UnXSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNb2RlbEJhc2UnXSA9IHtzaWduIDogJ01vZGVsQmFzZScsIHBvb2wgOiBNb2RlbEJhc2UuX3Bvb2wsIGNyZWF0ZUNvdW50IDogMCwgcmVjb3ZlckNvdW50IDogMH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFwcENvbmZpZy5wb29sc1snTW9kZWxCYXNlJ10ucmVjb3ZlckNvdW50ICsrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIE1vZGVsQmFzZS5fcG9vbC5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaXNSZWNvdmVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGF0YUJ5S2V5KHZhbHVlIDogb2JqZWN0KSA6IHZvaWR7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTW9kZWxCYXNlIGZyb20gXCIuL01vZGVsQmFzZVwiO1xyXG5pbXBvcnQgTWFwU3RhckluZm8gZnJvbSBcIi4vTWFwU3RhckluZm9cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllckluZm8gZXh0ZW5kcyBNb2RlbEJhc2Uge1xyXG4gICAgcHVibGljIG5hbWUgOiBzdHJpbmcgPSBcInRlc3RcIjtcclxuICAgIHB1YmxpYyB1cmwgOiBzdHJpbmcgPSBcImh0dHA6Ly9jZG4uZHVpdGFuZy5jb20vdXBsb2Fkcy9pdGVtLzIwMTQxMC8wOC8yMDE0MTAwODE1MDAxNV9kUDh5Si50aHVtYi43MDBfMC5qcGVnXCI7XHJcbiAgICBwcml2YXRlIF9zdGFySW5mbyA6IE1hcFN0YXJJbmZvO1xyXG4gICAgcHVibGljIGdldFN0YXJJbmZvKHNjb3JlIDogbnVtYmVyKSA6IE1hcFN0YXJJbmZve1xyXG4gICAgICAgIGxldCBzdGFyTnVtO1xyXG4gICAgICAgIGlmKHNjb3JlIDwgMzAwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXJOdW0gPTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2NvcmUgPCA4MDAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3Rhck51bSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2NvcmUgPCAxMjAwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXJOdW0gPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNjb3JlIDwgMzAwMDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFyTnVtID0gMztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzY29yZSA8IDYwMDAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3Rhck51bSA9IDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFyTnVtID0gNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc3RhckluZm8gPT0gbnVsbCB8fCB0aGlzLl9zdGFySW5mby5zdGFyX251bSAhPSBzdGFyTnVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhckluZm8gPSBNYXBTdGFySW5mby5jcmVhdGUoKTtcclxuICAgICAgICAgICAgaWYodGhpcy5fc3RhckluZm8uc3Rhcl9udW0gIT0gc3Rhck51bSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhckluZm8uc2V0RGF0YUJ5S2V5KHtzdGFyX251bSA6IHN0YXJOdW19KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhckluZm87XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUHJlZmViQmFzZSBmcm9tIFwiLi9QcmVmZWJCYXNlXCJcclxuaW1wb3J0IHsgUmVzTWdyIH0gZnJvbSBcIi4uLy4uL1Jlc01nclwiO1xyXG5pbXBvcnQgVVJJIGZyb20gXCIuLi8uLi9VUklcIjtcclxuaW1wb3J0IE1hcEZvbnRJbmZvIGZyb20gXCIuLi9tb2RlbC9NYXBGb250SW5mb1wiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb250R3JpZCBleHRlbmRzIFByZWZlYkJhc2Uge1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOmZvbnQsIHRpcHM6XCLmmL7npLrmloflrZdcIiwgdHlwZTpTdHJpbmcsIGRlZmF1bHQ6XCJcIn0qL1xyXG4gICAgcHVibGljIGZvbnQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAvKiogQHByb3Age25hbWU6bnVtVHlwZSwgdGlwczpcIui0qOmHjyDok50x77yM57qiMu+8jOe0qzPvvIzph5E0XCIsIHR5cGU6TnVtYmVyLCBkZWZhdWx0OjF9Ki9cclxuICAgIHB1YmxpYyBxdWFsaXR5OiBudW1iZXIgPSAxO1xyXG5cclxuICAgIHByaXZhdGUgY29sb3JBcnIgPSBbXCJibHVlXCIsXCJyZWRcIixcInB1cGxlXCIsXCJ5ZWxsb3dcIl07XHJcblxyXG4gICAgcHJpdmF0ZSBfZWZmZWN0cyA6IExheWEuU2tlbGV0b25bXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBhZGRFZmZlY3QoZWZmZWN0IDogTGF5YS5Ta2VsZXRvbikgOiB2b2lke1xyXG4gICAgICAgIGlmKGVmZmVjdCA9PSBudWxsKXJldHVybjtcclxuICAgICAgICB0aGlzLm93bmVyLmFkZENoaWxkKGVmZmVjdCk7XHJcbiAgICAgICAgdGhpcy5fZWZmZWN0cy5wdXNoKGVmZmVjdCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBjbGVhckVmZmVjdHMoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fZWZmZWN0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2VmZmVjdHMgPSBbXTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcbiAgICBcclxuICAgIG9uVXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBpbWdfYmcgPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKFwiaW1nX2JnXCIpIGFzIExheWEuSW1hZ2U7XHJcbiAgICAgICAgaWYodGhpcy5mb250ICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKFwidHh0XCIpW1widGV4dFwiXSA9IHRoaXMuZm9udDtcclxuICAgICAgICAgICAgaW1nX2JnLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpbWdfYmcuc2tpbiA9IFwibWFwL2ltZ19cIit0aGlzLmdldFF1YWxpdHlTaWduKCkrXCJHcmlkQmcucG5nXCI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZShcInR4dFwiKVtcInRleHRcIl0gPSBcIlwiO1xyXG4gICAgICAgICAgICBpbWdfYmcudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UXVhbGl0eVNpZ24oKSA6IHN0cmluZ3tcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xvckFyclt0aGlzLnF1YWxpdHkgLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25SZXNldCgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLnF1YWxpdHkgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlY292ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGxheUhlQ2hlbmdFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IHNrID0gUmVzTWdyLkluc3RhbmNlKCkuY3JlYXRlU3BpbmUoVVJJLnNwaW5lVXJsICsgXCJvdGhlcl90YW96aHVhbmd4aXRvbmcxLnNrXCIsXCJhbmltYXRpb25cIixmYWxzZSk7XHJcbiAgICAgICAgc2sueCA9IHNrLnkgPSA0NDtcclxuICAgICAgICBzay5zY2FsZVggPSBzay5zY2FsZVkgPSAxLjc7XHJcbiAgICAgICAgdGhpcy5vd25lci5hZGRDaGlsZChzayk7XHJcbiAgICAgICAgc2sub24oTGF5YS5FdmVudC5TVE9QUEVELCB0aGlzLCBmdW5jdGlvbiAocGFyX3NrKSB7XHJcbiAgICAgICAgICAgIHBhcl9zay5kZXN0cm95KCk7XHJcbiAgICAgICAgfSxbc2tdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5xdWFsaXR5ID0gMTtcclxuICAgICAgICB0aGlzLmNsZWFyRWZmZWN0cygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByZWZlYkJhc2UgZnJvbSBcIi4vUHJlZmViQmFzZVwiO1xyXG5pbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVSZXN1bHQgZXh0ZW5kcyBQcmVmZWJCYXNlIHtcclxuICAgIHB1YmxpYyBzaG93SG9tZUhhbmRsZXIgOiBMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgcmVzdGFydEhhbmRsZXIgOiBMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgc2NvcmUgOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIHR4dF9zY29yZSA6IExheWEuVGV4dDtcclxuICAgIHB1YmxpYyBpbWdfcmFua0JnIDogTGF5YS5JbWFnZTtcclxuICAgIHB1YmxpYyB0eHRfc2hvd1JhbmsgOiBMYXlhLlRleHQ7XHJcbiAgICBwdWJsaWMgYnRuX2hvbWUgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHB1YmxpYyBidG5fdHJ5QWdhaW4gOiBMYXlhLkJ1dHRvbjtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XHJcbiAgICAgICAgdGhpcy50eHRfc2NvcmUudGV4dCA9IHRoaXMuc2NvcmUudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLmJ0bl9ob21lLmNsaWNrSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgdGhpcy5zaG93SG9tZUhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmJ0bl90cnlBZ2Fpbi5jbGlja0hhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RhcnRIYW5kbGVyLnJ1bldpdGgoMSk7XHJcbiAgICAgICAgICAgICAgICB3eFtcInNoYXJlQXBwTWVzc2FnZVwiXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiAn5oiR5Zyo6L+Z5Liq5ri45oiP6YeM6Z2i5b6X5LqGJyArIHRoaXMuc2NvcmUgK1wi5YiGXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmwgOiBcImh0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL2lhVVZ1eEFyRTlMOUcyOEY2WHJ4S0FJRXRKT3M5eDFZY20yTVltQzJVejVUOU80UkxxMGVqdkczaWMyS2xVQmlhVmYvMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsSWQgOiBcIk5lbGVuSFBMUlhLMS1BV0VObjBhWndcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RhcnRIYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYnRuX2hvbWUub2ZmQWxsKCk7XHJcbiAgICAgICAgdGhpcy5idG5fdHJ5QWdhaW4ub2ZmQWxsKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUHJlZmViQmFzZSBmcm9tIFwiLi9QcmVmZWJCYXNlXCI7XHJcbmltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiO1xyXG5pbXBvcnQgQ29udHJvbGxlck1nciBmcm9tIFwiLi4vY29udHJvbGxlci9Db250cm9sbGVyTWdyXCI7XHJcbmltcG9ydCBUaXBDb250cm9sbGVyIGZyb20gXCIuLi9jb250cm9sbGVyL1RpcENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IFNvdW5kVG9vbCBmcm9tIFwiLi4vdG9vbC9Tb3VuZFRvb2xcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVTZXR0aW5nIGV4dGVuZHMgUHJlZmViQmFzZSB7XHJcbiAgICBwdWJsaWMgc2hvd0hvbWVIYW5kbGVyIDogTGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIHJlc3RhcnRIYW5kbGVyIDogTGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9uQ2xvc2VIYW5kbGVyIDogTGF5YS5IYW5kbGVyO1xyXG5cclxuICAgIHB1YmxpYyBwcm9ncmVzc19tdXNpYyA6IExheWEuUHJvZ3Jlc3NCYXI7XHJcbiAgICBwdWJsaWMgcHJvZ3Jlc3NfZWZmZWN0IDogTGF5YS5Qcm9ncmVzc0JhcjtcclxuICAgIHB1YmxpYyBidG5faG9tZSA6IExheWEuQnV0dG9uO1xyXG4gICAgcHVibGljIGJ0bl90cnlBZ2FpbiA6IExheWEuQnV0dG9uO1xyXG4gICAgcHVibGljIGJ0bl9zaGFyZSA6IExheWEuQnV0dG9uO1xyXG4gICAgcHVibGljIGJ0bl9jbG9zZSA6IExheWEuQnV0dG9uO1xyXG4gICAgcHVibGljIGJ0bl9tdXNpYyA6IExheWEuQnV0dG9uO1xyXG4gICAgcHVibGljIGJ0bl9lZmZlY3QgOiBMYXlhLkJ1dHRvbjtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XHJcbiAgICAgICAgdGhpcy5idG5faG9tZS5jbGlja0hhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0hvbWVIYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgIH0sbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5idG5fdHJ5QWdhaW4uY2xpY2tIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RhcnRIYW5kbGVyLnJ1bldpdGgoMSk7XHJcbiAgICAgICAgICAgICAgICB3eFtcInNoYXJlQXBwTWVzc2FnZVwiXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiAn5Y+R546w5pyJ5Liq5pyJ6Laj55qE5ri45oiPJyxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybCA6IFwiaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvaWFVVnV4QXJFOUw5RzI4RjZYcnhLQUlFdEpPczl4MVljbTJNWW1DMlV6NVQ5TzRSTHEwZWp2RzNpYzJLbFVCaWFWZi8wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmxJZCA6IFwiTmVsZW5IUExSWEsxLUFXRU5uMGFad1wiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydEhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LG51bGwsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYnRuX3NoYXJlLmNsaWNrSGFuZGxlciA9IChMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICAgICAgLy8gaWYoZS50eXBlICE9IExheWEuRXZlbnQuTU9VU0VfVVApcmV0dXJuO1xyXG4gICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3eFtcInNoYXJlQXBwTWVzc2FnZVwiXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiAn5Y+R546w5pyJ5Liq5pyJ6Laj55qE5ri45oiPJyxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybCA6IFwiaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvaWFVVnV4QXJFOUw5RzI4RjZYcnhLQUlFdEpPczl4MVljbTJNWW1DMlV6NVQ5TzRSTHEwZWp2RzNpYzJLbFVCaWFWZi8wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmxJZCA6IFwiTmVsZW5IUExSWEsxLUFXRU5uMGFad1wiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoVGlwQ29udHJvbGxlcikuc2hvd1RpcChcIuWwveaDheacn+W+hVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sbnVsbCxmYWxzZSkpO1xyXG4gICAgICAgIHRoaXMuYnRuX2Nsb3NlLmNsaWNrSGFuZGxlciA9IChMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICAgICAgLy8gaWYoZS50eXBlICE9IExheWEuRXZlbnQuTU9VU0VfVVApcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlSGFuZGxlci5ydW4oKTtcclxuICAgICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgICAgICB0aGlzLmJ0bl9tdXNpYy5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLm9uRHJhZ01vdXNlRG93bik7XHJcbiAgICAgICAgdGhpcy5idG5fZWZmZWN0Lm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMub25EcmFnTW91c2VEb3duKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZHJhZ1RhcmdldCA6IExheWEuQnV0dG9uXHJcbiAgICBvbkRyYWdNb3VzZURvd24oZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9kcmFnVGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IGFzIExheWEuQnV0dG9uO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9VUCx0aGlzLHRoaXMub25TdGFnZU1vdXNlVXAyKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfTU9WRSx0aGlzLHRoaXMub25TdGFnZU1vdXNlTW92ZTIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3RhZ2VNb3VzZVVwMihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2RyYWdUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWEuRXZlbnQuTU9VU0VfVVAsdGhpcyx0aGlzLm9uU3RhZ2VNb3VzZVVwMik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vblN0YWdlTW91c2VNb3ZlMik7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdGFnZU1vdXNlTW92ZTIoZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBuZXcgTGF5YS5Qb2ludChlLnN0YWdlWCxlLnN0YWdlWSk7XHJcbiAgICAgICAgbGV0IHByb2dyZXNzIDogTGF5YS5Qcm9ncmVzc0JhcjtcclxuICAgICAgICBpZih0aGlzLl9kcmFnVGFyZ2V0ID09IHRoaXMuYnRuX2VmZmVjdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzID0gdGhpcy5wcm9ncmVzc19lZmZlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3NfbXVzaWM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvaW50ID0gdGhpcy5fZHJhZ1RhcmdldC5wYXJlbnRbXCJnbG9iYWxUb0xvY2FsXCJdKHBvaW50KTtcclxuICAgICAgICBsZXQgeCA9IHBvaW50LnggLSBwcm9ncmVzcy54IC0gdGhpcy5fZHJhZ1RhcmdldC53aWR0aCAvIDI7XHJcbiAgICAgICAgaWYoeCA8IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoeCA+IHByb2dyZXNzLndpZHRoIC0gdGhpcy5fZHJhZ1RhcmdldC53aWR0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHggPSBwcm9ncmVzcy53aWR0aCAtIHRoaXMuX2RyYWdUYXJnZXQud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBudW0gPSB4IC8gKHByb2dyZXNzLndpZHRoIC0gdGhpcy5fZHJhZ1RhcmdldC53aWR0aCk7XHJcbiAgICAgICAgcHJvZ3Jlc3MudmFsdWUgPSBudW07XHJcbiAgICAgICAgaWYocHJvZ3Jlc3MgPT0gdGhpcy5wcm9ncmVzc19lZmZlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTb3VuZFRvb2wuc2V0U291bmRWb2x1bWUobnVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNvdW5kVG9vbC5zZXRNdXNpY1ZvbHVtZShudW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaCgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLnByb2dyZXNzX2VmZmVjdC52YWx1ZSA9IFNvdW5kVG9vbC5nZXRTb3VuZFZvbHVtZSgpO1xyXG4gICAgICAgIHRoaXMuYnRuX2VmZmVjdC54ID0gdGhpcy5wcm9ncmVzc19lZmZlY3QueCArICh0aGlzLnByb2dyZXNzX2VmZmVjdC53aWR0aCAtIHRoaXMuYnRuX2VmZmVjdC53aWR0aCkgKiB0aGlzLnByb2dyZXNzX2VmZmVjdC52YWx1ZSArIHRoaXMuYnRuX2VmZmVjdC53aWR0aC8yO1xyXG5cclxuICAgICAgICB0aGlzLnByb2dyZXNzX211c2ljLnZhbHVlID0gU291bmRUb29sLmdldE11c2ljVm9sdW1lKCk7XHJcbiAgICAgICAgdGhpcy5idG5fbXVzaWMueCA9IHRoaXMucHJvZ3Jlc3NfbXVzaWMueCArICh0aGlzLnByb2dyZXNzX211c2ljLndpZHRoLSB0aGlzLmJ0bl9tdXNpYy53aWR0aCkgKiB0aGlzLnByb2dyZXNzX211c2ljLnZhbHVlICsgdGhpcy5idG5fbXVzaWMud2lkdGgvMjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYnRuX2hvbWUub2ZmQWxsKCk7XHJcbiAgICAgICAgdGhpcy5idG5fdHJ5QWdhaW4ub2ZmQWxsKCk7XHJcbiAgICAgICAgdGhpcy5idG5fc2hhcmUub2ZmQWxsKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVmZWJCYXNlIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3ByZWZlYiA6IExheWEuUHJlZmFiO1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXRQcmVmZWIodmFsdWUgOiBMYXlhLlByZWZhYil7XHJcbiAgICAgICAgUHJlZmViQmFzZS5fcHJlZmViID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5vd25lci5udW1DaGlsZHJlbjsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLm93bmVyLmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQubmFtZSA9PSBcIlwiIHx8IGVsZW1lbnQubmFtZS5pbmRleE9mKFwiX1wiKSA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHRlbXBQcm9wZXJ0eUxpc3QgPSBlbGVtZW50Lm5hbWUuc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICBzd2l0Y2godGVtcFByb3BlcnR5TGlzdFswXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImxpc3RcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0eHRcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJpbWdcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJidG5cIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJwcm9ncmVzc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UHJlZmViKCkgOiBMYXlhLlByZWZhYlxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcmVmZWI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTaWduKCkgOiBzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCJfX3Byb3RvX19cIl0uY29uc3RydWN0b3IubmFtZVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCkgOiBMYXlhLlNjcmlwdHtcclxuICAgICAgICByZXR1cm4gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihQcmVmZWJCYXNlLmdldFNpZ24oKSxQcmVmZWJCYXNlLl9wcmVmZWIuY3JlYXRlLFByZWZlYkJhc2UuX3ByZWZlYik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY292ZXIoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoUHJlZmViQmFzZS5nZXRTaWduKCksdGhpcyk7XHJcbiAgICB9XHJcbn1cclxuICAgICIsImltcG9ydCBQcmVmZWJCYXNlIGZyb20gXCIuL1ByZWZlYkJhc2VcIjtcclxuaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCI7XHJcbmltcG9ydCBDb250cm9sbGVyTWdyIGZyb20gXCIuLi9jb250cm9sbGVyL0NvbnRyb2xsZXJNZ3JcIjtcclxuaW1wb3J0IFRpcENvbnRyb2xsZXIgZnJvbSBcIi4uL2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgV1hUb29sIGZyb20gXCIuLi90b29sL1dYVG9vbFwiO1xyXG5pbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi4vLi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgUGxheWVyQ29udHJvbGxlciBmcm9tIFwiLi4vY29udHJvbGxlci9QbGF5ZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFydEdhbWUgZXh0ZW5kcyBQcmVmZWJCYXNlIHtcclxuICAgIHB1YmxpYyBoYW5kbGVyOiBMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25TaG93UmFuayA6IExheWEuSGFuZGxlcjtcclxuICAgIHByaXZhdGUgYnRuX3N0YXJ0R2FtZSA6IExheWEuQnV0dG9uO1xyXG4gICAgcHJpdmF0ZSBidG5fc2hvd1JhbmsgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHByaXZhdGUgYnRuX3NoYXJlIDogTGF5YS5CdXR0b247XHJcblxyXG4gICAgcHJpdmF0ZSBfcmFua1ZpZXcgOiBMYXlhLldYT3BlbkRhdGFWaWV3ZXI7XHJcbiAgICBwcml2YXRlIF93eFN0YXJ0QnV0dG9uXHJcbiAgICAvLyDmm7TlpJrlj4LmlbDor7TmmI7or7forr/pl646IGh0dHBzOi8vbGRjMi5sYXlhYm94LmNvbS9kb2MvP25hdj16aC1hcy0yLTQtMFxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVYID0gTGF5YS5NaW5pQWRwdGVyLndpbmRvdy5zY3JlZW4uYXZhaWxXaWR0aCAvIDY0MDtcclxuICAgICAgICAgICAgbGV0IHNjYWxlWSA9IExheWEuTWluaUFkcHRlci53aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0KiAoR2FtZUNvbmZpZy5oZWlnaHQgLyBMYXlhLnN0YWdlLmhlaWdodCkgLyAxMTM2O1xyXG4gICAgICAgICAgICAvLyBsZXQgc2NhbGVYID0gTGF5YS5zdGFnZS53aWR0aCAvIDY0MDtcclxuICAgICAgICAgICAgLy8gbGV0IHNjYWxlWSA9IExheWEuc3RhZ2UuaGVpZ2h0IC8gMTEzNjtcclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHd4W1wiY3JlYXRlVXNlckluZm9CdXR0b25cIl0oe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICAgICAgICAgIGltYWdlOiAnYnRuX3N0YXJ0R2FtZS5wbmcnLFxyXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuYnRuX3N0YXJ0R2FtZS54ICogc2NhbGVYLFxyXG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLmJ0bl9zdGFydEdhbWUueSAqIHNjYWxlWSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmJ0bl9zdGFydEdhbWUud2lkdGggKiBzY2FsZVgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuYnRuX3N0YXJ0R2FtZS5oZWlnaHQgKiBzY2FsZVksXHJcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGJ1dHRvbi5vblRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFBsYXllckNvbnRyb2xsZXIpLm15UGxheWVySW5mby5uYW1lID0gcmVzLnVzZXJJbmZvLm5pY2tOYW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5idG5fc3RhcnRHYW1lLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5idG5fc3RhcnRHYW1lID0gYnV0dG9uO1xyXG4gICAgICAgICAgICBXWFRvb2wuYWRkQnRuKHRoaXMuYnRuX3N0YXJ0R2FtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9zdGFydEdhbWUuem9vbU9uKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgaWYoZS50eXBlID09IExheWEuRXZlbnQuTU9VU0VfVVApXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgICAgICB9LG51bGwsZmFsc2UpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnRuX3Nob3dSYW5rLnpvb21PbihMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oZSkgOiB2b2lke1xyXG4gICAgICAgICAgICBpZihlLnR5cGUgIT0gTGF5YS5FdmVudC5NT1VTRV9VUClyZXR1cm47XHJcbiAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TaG93UmFuay5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFRpcENvbnRyb2xsZXIpLnNob3dUaXAoXCLlsL3mg4XmnJ/lvoVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSxudWxsLGZhbHNlKSk7XHJcbiAgICAgICAgdGhpcy5idG5fc2hhcmUuem9vbU9uKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgICAgICBpZihlLnR5cGUgIT0gTGF5YS5FdmVudC5NT1VTRV9VUClyZXR1cm47XHJcbiAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHd4W1wic2hhcmVBcHBNZXNzYWdlXCJdKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA6ICflj5HnjrDmnInkuKrmnInotqPnmoTmuLjmiI8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsIDogXCJodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9pYVVWdXhBckU5TDlHMjhGNlhyeEtBSUV0Sk9zOXgxWWNtMk1ZbUMyVXo1VDlPNFJMcTBlanZHM2ljMktsVUJpYVZmLzBcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybElkIDogXCJOZWxlbkhQTFJYSzEtQVdFTm4wYVp3XCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlck1nci5nZXRJbnN0YW5jZShUaXBDb250cm9sbGVyKS5zaG93VGlwKFwi5bC95oOF5pyf5b6FXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgV1hUb29sLnJlbW92ZUJ0bih0aGlzLmJ0bl9zdGFydEdhbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9zdGFydEdhbWUuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX3N0YXJ0R2FtZS5vZmZBbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFByZWZlYkJhc2UgZnJvbSBcIi4vUHJlZmViQmFzZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlwSXRlbSBleHRlbmRzIFByZWZlYkJhc2Uge1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOnRleHQsIHRpcHM6XCLlrZfnrKbkuLLnsbvlnovnpLrkvotcIiwgdHlwZTpTdHJpbmcsIGRlZmF1bHQ6XCJkXCJ9Ki9cclxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSBcImRcIjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgdHh0X3RleHQgOiBMYXlhLlRleHQ7XHJcbiAgICBwcm90ZWN0ZWQgaW1nX2JnIDogTGF5YS5JbWFnZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgICAgICB0aGlzLnR4dF90ZXh0LnRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICAgICAgdGhpcy5pbWdfYmcud2lkdGggPSB0aGlzLnR4dF90ZXh0LmRpc3BsYXlXaWR0aCArIDM2O1xyXG4gICAgICAgIHRoaXMub3duZXJbXCJ3aWR0aFwiXSA9IHRoaXMuaW1nX2JnLndpZHRoOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNjZW5lQmFzZSBmcm9tIFwiLi9TY2VuZUJhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmdTY2VuZSAgZXh0ZW5kcyBTY2VuZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSB0eHRfcHJvZ3Jlc3MgOiBMYXlhLlRleHQ7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOi/m+W6puadoeeZvuWIhuavlFxyXG4gICAgICogQHBhcmFtIHZhbHVlIOeZvuWIhuavlCAwLTEwMFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlUGVyY2VudCh2YWx1ZSA6IG51bWJlcikgOiB2b2lke1xyXG4gICAgICAgIHRoaXMudHh0X3Byb2dyZXNzLnRleHQgPSBcIuato+WcqOWKoOi9vei1hOa6kCBcIiArIHZhbHVlICsgXCIlXCI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTWFwRm9udEluZm8gZnJvbSBcIi4uL21vZGVsL01hcEZvbnRJbmZvXCI7XHJcbmltcG9ydCBTdGFydEdhbWUgZnJvbSBcIi4uL3ByZWZlYi9TdGFydEdhbWVcIjtcclxuaW1wb3J0IFNjZW5lQmFzZSBmcm9tIFwiLi9TY2VuZUJhc2VcIjtcclxuaW1wb3J0IEZvbnRHcmlkIGZyb20gXCIuLi9wcmVmZWIvRm9udEdyaWRcIjtcclxuaW1wb3J0IFBsYXllckluZm8gZnJvbSBcIi4uL21vZGVsL1BsYXllckluZm9cIjtcclxuaW1wb3J0IFBsYXllckNvbnRyb2xsZXIgZnJvbSBcIi4uL2NvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgR2FtZVJlc3VsdCBmcm9tIFwiLi4vcHJlZmViL0dhbWVSZXN1bHRcIjtcclxuaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCI7XHJcbmltcG9ydCB7IFJlc01nciB9IGZyb20gXCIuLi8uLi9SZXNNZ3JcIjtcclxuaW1wb3J0IFVSSSBmcm9tIFwiLi4vLi4vVVJJXCI7XHJcbmltcG9ydCBUaXBDb250cm9sbGVyIGZyb20gXCIuLi9jb250cm9sbGVyL1RpcENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IENvbnRyb2xsZXJNZ3IgZnJvbSBcIi4uL2NvbnRyb2xsZXIvQ29udHJvbGxlck1nclwiO1xyXG5pbXBvcnQgTmF0aXZlQnJpZGdlNDM5OSBmcm9tIFwiLi4vdG9vbC9OYXRpdmVCcmlkZ2U0Mzk5XCI7XHJcbmltcG9ydCBTb3VuZFRvb2wgZnJvbSBcIi4uL3Rvb2wvU291bmRUb29sXCI7XHJcbmltcG9ydCBHYW1lU2V0dGluZyBmcm9tIFwiLi4vcHJlZmViL0dhbWVTZXR0aW5nXCI7XHJcblxyXG5lbnVtIEdhbWVTdGF0ZXtcclxuICAgIEVuZCA9IDAsXHJcbiAgICBQYXVzZSA9IDEsXHJcbiAgICBQbGF5aW5nID0gMixcclxuICAgIGluaXQgPSAzLFxyXG4gICAgRWZmZWN0UGF1c2UgPSA0IC8v6YeK5pS+54m55pWI5a+86Ie055qE5pqC5YGcXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1haW5HYW1lU2NlbmUgZXh0ZW5kcyBTY2VuZUJhc2Uge1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOnByZWZhYl9zdGFydEdhbWUsdGlwczpcIuW8gOWni+a4uOaIj3ByZWZhYlwiLHR5cGU6UHJlZmFifSovXHJcbiAgICBwcmVmYWJfc3RhcnRHYW1lOiBMYXlhLlByZWZhYjtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpwcmVmYWJfZ2FtZVJlc3VsdCx0aXBzOlwi5ri45oiP57uT5p6ccHJlZmFiXCIsdHlwZTpQcmVmYWJ9Ki9cclxuICAgIHByZWZhYl9nYW1lUmVzdWx0OiBMYXlhLlByZWZhYjtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpwcmVmYWJfZ2FtZVNldHRpbmcsdGlwczpcIua4uOaIj+iuvue9rlwiLHR5cGU6UHJlZmFifSovXHJcbiAgICBwcmVmYWJfZ2FtZVNldHRpbmc6IExheWEuUHJlZmFiO1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOnByZWZhYl9mb250R3JpZCx0aXBzOlwi5qC85a2QcHJlZmFiXCIsdHlwZTpQcmVmYWJ9Ki9cclxuICAgIHByZWZhYl9mb250R3JpZDogTGF5YS5QcmVmYWI7XHJcbiAgICBwcml2YXRlIF9mb250cyA9IFtdO1xyXG4gICAgcHJpdmF0ZSBsaXN0X2dyaWRzIDogTGF5YS5MaXN0O1xyXG4gICAgcHJpdmF0ZSBsaXN0X3N0YXIgOiBMYXlhLkxpc3Q7XHJcbiAgICBwcml2YXRlIHR4dF9uZXh0Rm9udCA6IExheWEuVGV4dDtcclxuICAgIHByaXZhdGUgdHh0X3BsYXllck5hbWUgOiBMYXlhLlRleHQ7XHJcbiAgICBwcml2YXRlIHR4dF9zY29yZSA6IExheWEuVGV4dDtcclxuICAgIHByaXZhdGUgdHh0X3BvcHVsYXJHcm91cCA6IExheWEuVGV4dDtcclxuICAgIHByaXZhdGUgaW1nX3BvcHVsYXJHcm91cEJnIDogTGF5YS5JbWFnZTtcclxuICAgIHByaXZhdGUgbWNfZGlzcGVsVGV4dCA6IExheWEuU3ByaXRlXHJcbiAgICBwcml2YXRlIHR4dF9kaXNwZWxUZXh0IDogTGF5YS5UZXh0O1xyXG4gICAgcHJpdmF0ZSB0eHRfY3VycmVudFBpbllpbiA6IExheWEuVGV4dDtcclxuICAgIHByaXZhdGUgYnRuX3BhdXNlT3JTdGFydCA6IExheWEuQnV0dG9uO1xyXG4gICAgcHJpdmF0ZSBidG5fc2V0dGluZyA6IExheWEuQnV0dG9uO1xyXG4gICAgcHJpdmF0ZSBsaXN0X251UWkgOiBMYXlhLkxpc3Q7XHJcbiAgICBwcml2YXRlIF9nYW1lU3RhdGUgOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9kcm9waW5nRm9udEluZm8gOiBNYXBGb250SW5mbztcclxuICAgIHByaXZhdGUgX25leHREcm9waW5nRm9udEluZm8gOiBNYXBGb250SW5mbztcclxuICAgIHByaXZhdGUgX3N5c0Ryb3BpbmdGb250SW5mb3MgOiBNYXBGb250SW5mb1tdID0gW107IC8v5raI6Zmk5Lqn55Sf55qE5paw5a2X77yM6Ieq5Yqo5LiL6JC9XHJcbiAgICBwcml2YXRlIF9zeXNEaXNwZWxGb250SW5mb1N0YWNrIDogTWFwRm9udEluZm9bXSA9IFtdOyAvL+a2iOmZpOS6p+eUn+eahOaWsOWtl++8jOWcqOiHquWKqOS4i+iQveWujOavleWQju+8jOWtmOWCqO+8jOeUqOS6juaJgOacieWtl+S4i+iQveWujOavlee7n+S4gOaJp+ihjOa2iOmZpOaTjeS9nFxyXG4gICAgcHJpdmF0ZSBfc3RhcnRQb2ludCA9IG5ldyBMYXlhLlBvaW50KDIsMCk7XHJcbiAgICBwcml2YXRlIF90aWNrVGltZSA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX21heFRpY2tUaW1lID0gMjY7XHJcbiAgICBwcml2YXRlIF9zeXNUaWNrVGltZSA9IDA7XHJcbiAgICBwcml2YXRlIF9tYXhTeXNUaWNrVGltZSA9IDg7XHJcbiAgICBwcml2YXRlIF9wb3B1bGFyR3JvdXAgOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF93b3JkcyA6IE1hcEZvbnRJbmZvW10gPSBbXTsgLy/lt6bovrnlrZfnrKbliJfooajvvIzmrKLov47lrZfnrKbliJfooahcclxuICAgIHByaXZhdGUgX3NwbGl0Rm9udFdvcmRzIDogTWFwRm9udEluZm9bXSA9IFtdOy8v5YiG5a2X5a2X56ym5YiX6KGoXHJcbiAgICBwcml2YXRlIF9zcGxpdEdyb3VwV29yZHMgOiBNYXBGb250SW5mb1tdID0gW107Ly/liIbor43lrZfnrKbliJfooahcclxuICAgIHByaXZhdGUgX21pbldvcmRzTGVuZ3RoID0gNTtcclxuICAgIHByaXZhdGUgX2lzTW91c2VEb3duIDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaXNRdWlja0Ryb3AgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9teVBsYXllckluZm8gOiBQbGF5ZXJJbmZvO1xyXG4gICAgcHJpdmF0ZSBfc2NvcmUgOiBudW1iZXIgPSAwOyAvL+W9k+WJjeWxgOWIhuaVsFxyXG4gICAgcHJpdmF0ZSBfbnVRaSA6IG51bWJlciA9IDA7IC8v5oCS5rCU77yM55So5p2l6Kem5Y+R5oqA6IO9XHJcbiAgICBwcml2YXRlIF9kZWJ1Z01vZGUgPSBmYWxzZTsgLy/osIPor5VcclxuICAgIHByaXZhdGUgX2RlYnVnRm9udHMgPSBbXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIFwi5rC1XCIsbnVsbCxudWxsLFwi5rC1XCIsbnVsbCxcclxuICAgIF1cclxuICAgIHByaXZhdGUgX2RlYnVnRHJvcEZvbnRzID0gW1wi5Y2BXCJdO1xyXG4gICAgcHJpdmF0ZSBfZ3VpZGVEcm9wRm9udHMgPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9IFxyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xyXG4gICAgICAgIHN3aXRjaChBcHBDb25maWcucGxhdGZvcm0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIFwid3hcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfcGxheWVyTmFtZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3Rfc3Rhci55ID0gODQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9zY29yZS55ID0gMTQyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFBcHBDb25maWcuaGFkR3VpZGFuY2UoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2d1aWRlRHJvcEZvbnRzID0gW1wi5pyoXCIsXCLmnKhcIixcIuWklVwiLFwi5oOzXCIsXCLlj4hcIixcIuasoFwiLFwi5LmQXCIsXCLmnKhcIixcIuebrlwiLFwi5b+DXCIsXCLljJZcIixcIuWNgVwiXTtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnNldEd1aWRhbmNlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpc3RfZ3JpZHMucmVuZGVySGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uR3JpZFJlbmRlcixudWxsLGZhbHNlKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxpc3Rfc3Rhci5yZW5kZXJIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25TdGFyUmVuZGVyLG51bGwsZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmxpc3RfbnVRaS5yZW5kZXJIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25OdVFpUmVuZGVyLG51bGwsZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9teVBsYXllckluZm8gPSBDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFBsYXllckNvbnRyb2xsZXIpLm15UGxheWVySW5mbztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmJ0bl9wYXVzZU9yU3RhcnRbXCJ6b29tT25cIl0oTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25QYXVzZU9yU3RhcnRNb3VzZUV2ZW50LFtdLGZhbHNlKSk7XHJcbiAgICAgICAgdGhpcy5idG5fc2V0dGluZ1tcInpvb21PblwiXShMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vblNldHRpbmdNb3VzZUV2ZW50LFtdLGZhbHNlKSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5pbml0KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGxldCBzayA9IFJlc01nci5JbnN0YW5jZSgpLmNyZWF0ZVNwaW5lKFVSSS5zcGluZVVybCArIFwiemZfd2FucWlhbnNoaWppZS5za1wiLFwiaGl0XCIsdHJ1ZSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgLy8gICAgIC8vIHRoaXMuX2hlQ2hlbmdFZmZlY3QuZGVzdHJveSgpO1xyXG4gICAgICAgIC8vICAgICAvLyB0aGlzLl9oZUNoZW5nRWZmZWN0ID0gbnVsbDtcclxuICAgICAgICAvLyB9KSk7XHJcbiAgICAgICAgLy8gc2sueCA9IHNrLnkgPSA0NDtcclxuICAgICAgICAvLyB0aGlzLm93bmVyLmFkZENoaWxkKHNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2V0dGluZ01vdXNlRXZlbnQoZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICBpZihlLnR5cGUgPT0gTGF5YS5FdmVudC5NT1VTRV9VUClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuUGF1c2UpO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dHYW1lU2V0dGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25QYXVzZU9yU3RhcnRNb3VzZUV2ZW50KGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgaWYoZS50eXBlID09IExheWEuRXZlbnQuTU9VU0VfVVApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLlBhdXNlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLlBsYXlpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v5omT5Y2w5b2T5YmN5omA5pyJ5qC85a2Q5L+h5oGvXHJcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDA7IGogPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WTtqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtqXSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gXCJudWxsLFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiJ1wiICsgdGhpcy5fZm9udHNbaV1bal0udGV4dCArIFwiJyxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0cik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLlBhdXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dTdGFydEdhbWUoKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IHN0YXJ0R2FtZVNwciA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJTdGFydEdhbWVcIix0aGlzLnByZWZhYl9zdGFydEdhbWUuY3JlYXRlLHRoaXMucHJlZmFiX3N0YXJ0R2FtZSk7XHJcbiAgICAgICAgbGV0IHN0YXJ0R2FtZVNjcmlwdCA9IHN0YXJ0R2FtZVNwci5nZXRDb21wb25lbnQoU3RhcnRHYW1lKSBhcyBTdGFydEdhbWVcclxuICAgICAgICBzdGFydEdhbWVTY3JpcHQuaGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLmNoYW5nZUdhbWVTdGF0dWUsW0dhbWVTdGF0ZS5QbGF5aW5nXSxmYWxzZSk7XHJcbiAgICAgICAgc3RhcnRHYW1lU2NyaXB0Lm9uU2hvd1JhbmsgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5zaG93UmFuayxudWxsLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFkZFBvcFVwKFwiU3RhcnRHYW1lXCIsc3RhcnRHYW1lU3ByLGZhbHNlLGZhbHNlLGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dHYW1lUmVzdWx0KCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBnYW1lUmVzdWx0U3ByID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcIkdhbWVSZXN1bHRcIix0aGlzLnByZWZhYl9nYW1lUmVzdWx0LmNyZWF0ZSx0aGlzLnByZWZhYl9nYW1lUmVzdWx0KSBhcyBMYXlhLlNwcml0ZTtcclxuICAgICAgICBsZXQgZ2FtZVJlc3VsdFNjcmlwdCA9IGdhbWVSZXN1bHRTcHIuZ2V0Q29tcG9uZW50KEdhbWVSZXN1bHQpIGFzIEdhbWVSZXN1bHQ7XHJcbiAgICAgICAgbGV0IHN0b3JhZ2VPYmogPSB7XHJcbiAgICAgICAgICAgIFwid3hnYW1lXCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJzY29yZVwiOnRoaXMuX3Njb3JlLFxyXG4gICAgICAgICAgICAgICAgICBcInVwZGF0ZV90aW1lXCI6IERhdGUubm93KClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJzY29yZVwiOnRoaXMuX3Njb3JlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIucG9zdE1zZyh7XHJcbiAgICAgICAgICAgIGNtZCA6IFwid3guc2V0VXNlckNsb3VkU3RvcmFnZVwiLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RvcmFnZU9ialxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGdhbWVSZXN1bHRTY3JpcHQuc2NvcmUgPSB0aGlzLl9zY29yZTtcclxuICAgICAgICBnYW1lUmVzdWx0U2NyaXB0LnNob3dIb21lSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLmNoYW5nZUdhbWVTdGF0dWUsW0dhbWVTdGF0ZS5pbml0XSxmYWxzZSk7XHJcbiAgICAgICAgZ2FtZVJlc3VsdFNjcmlwdC5yZXN0YXJ0SGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLnJlc3RhcnQsbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5hZGRQb3BVcChcIkdhbWVSZXN1bHRcIixnYW1lUmVzdWx0U3ByLGZhbHNlLGZhbHNlLGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3dHYW1lU2V0dGluZygpIDogdm9pZHtcclxuICAgICAgICBsZXQgZ2FtZVNldHRpbmdTcHIgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiR2FtZVNldHRpbmdcIix0aGlzLnByZWZhYl9nYW1lU2V0dGluZy5jcmVhdGUsdGhpcy5wcmVmYWJfZ2FtZVNldHRpbmcpIGFzIExheWEuU3ByaXRlO1xyXG4gICAgICAgIGxldCBnYW1lU2V0dGluZ1NjcmlwdCA9IGdhbWVTZXR0aW5nU3ByLmdldENvbXBvbmVudChHYW1lU2V0dGluZykgYXMgR2FtZVNldHRpbmc7XHJcbiAgICAgICAgZ2FtZVNldHRpbmdTY3JpcHQub25DbG9zZUhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5jaGFuZ2VHYW1lU3RhdHVlLFtHYW1lU3RhdGUuUGxheWluZ10sZmFsc2UpO1xyXG4gICAgICAgIGdhbWVTZXR0aW5nU2NyaXB0LnNob3dIb21lSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLmNoYW5nZUdhbWVTdGF0dWUsW0dhbWVTdGF0ZS5pbml0XSxmYWxzZSk7XHJcbiAgICAgICAgZ2FtZVNldHRpbmdTY3JpcHQucmVzdGFydEhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5yZXN0YXJ0LG51bGwsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYWRkUG9wVXAoXCJnYW1lU2V0dGluZ1wiLGdhbWVTZXR0aW5nU3ByLHRydWUsdHJ1ZSxmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0YXJ0KCkgOiB2b2lke1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiU3RvcmFnZVZlcnNpb25cIixudWxsKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIkNhY2hlRGF0YVwiLG51bGwpO1xyXG4gICAgICAgIHRoaXMuX2dhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5FbmQ7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5QbGF5aW5nKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBnYW1lU3RhdGUg5Y+Y5pu054q25oCBXHJcbiAgICAgKiBAcGFyYW0gbmV4dFN0YXRlIOS4i+S4gOS4queKtuaAgVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNoYW5nZUdhbWVTdGF0dWUoZ2FtZVN0YXRlIDogbnVtYmVyLCBuZXh0U3RhdGUgOiBudW1iZXIgPSAtMSkgOiB2b2lke1xyXG4gICAgICAgIHN3aXRjaChnYW1lU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5FbmQ6XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIkNhY2hlRGF0YVwiLG51bGwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93R2FtZVJlc3VsdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlBsYXlpbmc6XHJcbiAgICAgICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJhbmRyb2lkNDM5OVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIE5hdGl2ZUJyaWRnZTQzOTkuc2hvd0Jhbm5lckFkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5fcGF1c2VPclN0YXJ0LnNraW4gPSBcIm1hcC9idG5fcGF1c2UucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVQb3BVcCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSAhPSBHYW1lU3RhdGUuUGF1c2UgJiYgdGhpcy5fZ2FtZVN0YXRlICE9IEdhbWVTdGF0ZS5FZmZlY3RQYXVzZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm9vbDtcclxuICAgICAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2wgPSB0aGlzLnJlc3RvcmVBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2h7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiQ2FjaGVEYXRhXCIsbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2wgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWJvb2wpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY29yZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX251UWkgPSB0aGlzLl9kZWJ1Z01vZGUgPyAxMiA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX251UWkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMCA7ICBqIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkgOyBqKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV0gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW2ldID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2RlYnVnTW9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0eHQgPSB0aGlzLl9kZWJ1Z0ZvbnRzW2kgKyBqICogNV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR4dCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1tpXVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHR4dH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLnggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLnkgPSBqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbaV1bal0gPSB0ZW1wRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW2ldW2pdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fd29yZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcG9wdWxhckdyb3VwID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjayA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3JkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZUNpU3BsaXRUaW1lcyA9IDA7IC8v5ZCI5oiQ5b2T5YmN5bem6L656K+N57uE5aSx6LSl5qyh5pWwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVDaXp1UmF0ZSA9IDEwOyAvL+WHuueOsOW3pui+uemCo+S4quivjee7hOeahOamgueOh1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhblppUmF0ZSA9IDEwIDsgLy8g5Ye6546w6IO96Lef5LqU5YiX5pyA5aSW6L655rGJ5a2X5ZCI5oiQ5rGJ5a2X55qE5qaC546HXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2ladVJhdGUgPSAxMDsgLy8g5Ye6546w6IO96Lef5LqU5YiX5pyA5aSW6L655rGJ5a2X5ZCI5oiQ6K+N57uE55qE5qaC546HXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlBhdXNlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5fcGF1c2VPclN0YXJ0LnNraW4gPSBcIm1hcC9idG5fc3RhcnQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5FZmZlY3RQYXVzZTpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5pbml0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93U3RhcnRHYW1lKCk7XHJcbiAgICAgICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJhbmRyb2lkNDM5OVwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIE5hdGl2ZUJyaWRnZTQzOTkuc2hvd0Jhbm5lckFkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSBnYW1lU3RhdGU7XHJcbiAgICAgICAgaWYobmV4dFN0YXRlICE9IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKG5leHRTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25OdVFpUmVuZGVyKGNlbGwgOiBMYXlhLkJveCwgaW5kZXggOiBudW1iZXIpIDogdm9pZHtcclxuICAgICAgICBsZXQgZGF0YSA9IGNlbGwuZGF0YVNvdXJjZTtcclxuICAgICAgICBjZWxsLmdldENoaWxkQnlOYW1lKFwiaW1nX3N0YXJcIilbXCJ2aXNpYmxlXCJdID0gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uR3JpZFJlbmRlcihjZWxsIDogTGF5YS5Cb3gsaW5kZXggOiBudW1iZXIpIDogdm9pZHtcclxuICAgICAgICBsZXQgZGF0YSA9ICBjZWxsLmRhdGFTb3VyY2UgYXMgTWFwRm9udEluZm87XHJcbiAgICAgICAgbGV0IGZvbnRHcmlkU2NyaXAgPSBjZWxsLmdldENvbXBvbmVudChGb250R3JpZCkgYXMgRm9udEdyaWQ7XHJcbiAgICAgICAgaWYoZGF0YSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9udEdyaWRTY3JpcC5mb250ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9udEdyaWRTY3JpcC5jbGVhckVmZmVjdHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvbnRHcmlkU2NyaXAuZm9udCA9IGRhdGEudGV4dDtcclxuICAgICAgICAgICAgZm9udEdyaWRTY3JpcC5hZGRFZmZlY3QoZGF0YS5nZXRTdHVudEZvbnRFZmZlY3QoKSk7XHJcbiAgICAgICAgICAgIGZvbnRHcmlkU2NyaXAucXVhbGl0eSA9IGRhdGEucXVhbGl0eTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblN0YXJSZW5kZXIoY2VsbCA6IExheWEuSW1hZ2UsIGluZGV4IDogbnVtYmVyKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGlzU2hpbmUgPSBjZWxsLmRhdGFTb3VyY2U7IC8vIOaYr+WQpueCueS6rlxyXG4gICAgICAgIGlmKGlzU2hpbmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjZWxsLnNraW4gPSBcIm1hcC9pbWdfc3Rhci5wbmdcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNlbGwuc2tpbiA9IFwibWFwL2ltZ19zdGFyQmcucG5nXCI7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tb3VzZURvd25Qb2ludCA6IExheWEuUG9pbnQ7XHJcbiAgICBvbk1vdXNlRG93bigpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLlBsYXlpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3VzZURvd25Qb2ludCA9IG5ldyBMYXlhLlBvaW50KExheWEuc3RhZ2UubW91c2VYLExheWEuc3RhZ2UubW91c2VZKTtcclxuICAgICAgICAgICAgdGhpcy5faXNRdWlja0Ryb3AgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuUGxheWluZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX21vdXNlRG93blBvaW50ID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgYWJzWCA9IE1hdGguYWJzKExheWEuc3RhZ2UubW91c2VYIC0gdGhpcy5fbW91c2VEb3duUG9pbnQueCk7XHJcbiAgICAgICAgICAgIGxldCBhYnNZID0gTGF5YS5zdGFnZS5tb3VzZVkgLSB0aGlzLl9tb3VzZURvd25Qb2ludC55O1xyXG4gICAgICAgICAgICBpZihhYnNYID4gMTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKGFic1kgPiBhYnNYICogMi41KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v56uW552A56e75YqoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNRdWlja0Ryb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIFNvdW5kVG9vbC5wbGF5WGlhSHVhRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURyb3BpbmdGb250KExheWEuc3RhZ2UubW91c2VYIDwgdGhpcy5fbW91c2VEb3duUG9pbnQueClcclxuICAgICAgICAgICAgICAgICAgICBTb3VuZFRvb2wucGxheVlpRG9uZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoYWJzWSA+IDI1KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1F1aWNrRHJvcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBTb3VuZFRvb2wucGxheVhpYUh1YUVmZmVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX21vdXNlRG93blBvaW50ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLlBsYXlpbmcpXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuUGF1c2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuUGxheWluZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v5Yik5pat5b2T5YmN5a2X56ym5piv5ZCm5LiN6LazXHJcbiAgICAgICAgICAgIGxldCBpc0VkaXRMaXN0IDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvcHVsYXJHcm91cCgpO1xyXG4gICAgICAgICAgICAvL+a2iOmZpOS6p+eUn+eahOa8gua1ruWtl+enu+WKqOWPiua2iOmZpFxyXG4gICAgICAgICAgICBpZih0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N5c1RpY2tUaW1lID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNUaWNrVGltZSAtLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzVGlja1RpbWUgPSB0aGlzLl9tYXhTeXNUaWNrVGltZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3lzRGVsQXJyID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5sZW5ndGggPT0gdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmludm9rZVN0dW50Rm9udCgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbENpWnUodGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLmZvckVhY2goZWxlbWVudD0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSkgIT0gZWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWwoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tTeXNEcm9wRm9udHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNFZGl0TGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MuZm9yRWFjaChlbGVtZW50PT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLmluZGV4T2YoZWxlbWVudCkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbZWxlbWVudC54XVtlbGVtZW50LnkgKyAxXSA9PSBudWxsICYmIGVsZW1lbnQueSArIDEgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e7p+e7reS4i+iQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyhlbGVtZW50LngsIGVsZW1lbnQueSArIDEsZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peg5rOV5LiL6JC977yM5omn6KGM5raI6Zmk5Yqo5L2cXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRWRpdExpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+aWueWdl+eKtuaAgeajgOa1i1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fdGlja1RpbWUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2lzUXVpY2tEcm9wICYmIHRoaXMuX3RpY2tUaW1lID4gMSl0aGlzLl90aWNrVGltZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGlja1RpbWUgLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGlja1RpbWUgPSAoMTAwIC0gdGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zcGVlZF9yYXRlKSAqIHRoaXMuX21heFRpY2tUaW1lIC8gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm5pyJ5o6J6JC95Lit55qE5a2X77yM5rKh5pyJ55qE6K+d77yM55Sf5oiQ5a2XXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1F1aWNrRHJvcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1t0aGlzLl9zdGFydFBvaW50LnhdW3RoaXMuX3N0YXJ0UG9pbnQueV0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nu5PmnZ9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuRW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21OZXh0Rm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHtpZCA6IHRoaXMuX25leHREcm9waW5nRm9udEluZm8uaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mby5pc1N0dW50Rm9udCA9IHRoaXMuX25leHREcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuato+WcqOaOieiQveeahOaxieWtkO+8mlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3VpZGVUb0dyaWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGlzcGVsVGV4dCh0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbU5leHRGb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5leHREcm9waW5nRm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggPSB0aGlzLl9zdGFydFBvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8ueSA9IHRoaXMuX3N0YXJ0UG9pbnQueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54XVt0aGlzLl9kcm9waW5nRm9udEluZm8ueV0gPSB0aGlzLl9kcm9waW5nRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0VkaXRMaXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5faXNRdWlja0Ryb3ApdGhpcy5fdGlja1RpbWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnhdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55ICsgMV0gPT0gbnVsbCAmJiB0aGlzLl9kcm9waW5nRm9udEluZm8ueSArIDEgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e7p+e7reS4i+iQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyh0aGlzLl9kcm9waW5nRm9udEluZm8ueCwgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKyAxLHRoaXMuX2Ryb3BpbmdGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peg5rOV5LiL6JC977yM5omn6KGM5raI6Zmk5Yqo5L2cXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VEb3duUG9pbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveUd1aWRlSW1ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc0Rpc3BlbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb3V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdXQgPSB0aGlzLmRpc3BlbENpWnUoW3RoaXMuX2Ryb3BpbmdGb250SW5mb10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvdXQgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzcGVsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291dCA9IHRoaXMuZGlzcGVsKHRoaXMuX2Ryb3BpbmdGb250SW5mby54LHRoaXMuX2Ryb3BpbmdGb250SW5mby55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb3V0ID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc3BlbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGlzRGlzcGVsID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5zZXREaXNwZWxUZXh0KHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRWRpdExpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGlzRWRpdExpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaJgOaciemdnuepuumhtuWtl+esplxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldEFsbEZvbnRzKCkgOiBNYXBGb250SW5mb1tde1xyXG4gICAgICAgIGxldCBjb3V0ID0gW11cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fZm9udHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSB0aGlzLl9mb250c1swXS5sZW5ndGggLSAxOyBqID49IDA7IGotLSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bal0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3V0LnB1c2godGhpcy5fZm9udHNbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NhY2hlUHJvcGVydGllcyA9IFtcImhlQ2lTcGxpdFRpbWVzXCIsXCJoZUNpenVSYXRlXCIsXCJjaVp1UmF0ZVwiLFwiX3Njb3JlXCIsXCJfbnVRaVwiLFwiX3BvcHVsYXJHcm91cFwiLFwiX2d1aWRlUmF0ZVwiLFwiYnVTaG91UmF0ZVwiXTtcclxuICAgIHByaXZhdGUgY2FjaGVBbGwoKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IG9iaiA6IGFueSA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2NhY2hlUHJvcGVydGllcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBvYmpbZWxlbWVudF0gPSB0aGlzW2VsZW1lbnRdO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgb2JqLl93b3JkVGV4dHMgPSBbXTsgXHJcbiAgICAgICAgdGhpcy5fd29yZHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgb2JqLl93b3JkVGV4dHMucHVzaCh7dGV4dCA6IGVsZW1lbnQudGV4dCwgaXNTdHVudEZvbnQgOiBlbGVtZW50LmlzU3R1bnRGb250fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqLl9zcGxpdEZvbnRXb3JkVGV4dHMgPSBbXTtcclxuICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3Jkcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBvYmouX3NwbGl0Rm9udFdvcmRUZXh0cy5wdXNoKHt0ZXh0IDogZWxlbWVudC50ZXh0LCBpc1N0dW50Rm9udCA6IGVsZW1lbnQuaXNTdHVudEZvbnR9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmouX3NwbGl0R3JvdXBXb3JkVGV4dHMgPVtdO1xyXG4gICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBvYmouX3NwbGl0R3JvdXBXb3JkVGV4dHMucHVzaCh7dGV4dCA6IGVsZW1lbnQudGV4dCwgaXNTdHVudEZvbnQgOiBlbGVtZW50LmlzU3R1bnRGb250fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgIG9iai5fZHJvcGluZ0ZvbnRJbmZvVGV4dCA9IHt0ZXh0IDogdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQsIGlzU3R1bnRGb250IDogdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250fTtcclxuICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgb2JqLl9uZXh0RHJvcGluZ0ZvbnRJbmZvVGV4dCA9IHt0ZXh0IDogdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby50ZXh0LCBpc1N0dW50Rm9udCA6IHRoaXMuX25leHREcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnR9O1xyXG4gICAgICAgIG9iai5fc3lzRGlzcGVsRm9udEluZm9TdGFja1Bvc2VzID0gW107XHJcbiAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBvYmouX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2tQb3Nlcy5wdXNoKG5ldyBMYXlhLlBvaW50KGVsZW1lbnQueCwgZWxlbWVudC55KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqLl9zeXNEcm9waW5nRm9udEluZm9zUG9zZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIG9iai5fc3lzRHJvcGluZ0ZvbnRJbmZvc1Bvc2VzLnB1c2gobmV3IExheWEuUG9pbnQoZWxlbWVudC54LCBlbGVtZW50LnkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmouX2ZvbnRUZXh0cyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLl9mb250cy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9iai5fZm9udFRleHRzW2ldID0gW11cclxuICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMCA7ICBqIDwgdGhpcy5fZm9udHNbaV0ubGVuZ3RoIDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtqXSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5fZm9udFRleHRzW2ldW2pdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9mb250VGV4dHNbaV1bal0gPSB7dGV4dCA6IHRoaXMuX2ZvbnRzW2ldW2pdLnRleHQsIGlzU3R1bnRGb250IDogdGhpcy5fZm9udHNbaV1bal0uaXNTdHVudEZvbnR9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiU3RvcmFnZVZlcnNpb25cIixBcHBDb25maWcudmVyc2lvbik7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJDYWNoZURhdGFcIixKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc3RvcmVBbGwoKSA6IGJvb2xlYW57XHJcbiAgICAgICAgaWYodGhpcy5fZGVidWdNb2RlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3RvcmFnZVZlcnNpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIlN0b3JhZ2VWZXJzaW9uXCIpO1xyXG4gICAgICAgIGlmKHN0b3JhZ2VWZXJzaW9uID09IEFwcENvbmZpZy52ZXJzaW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGRhdGFTdHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIkNhY2hlRGF0YVwiKTtcclxuICAgICAgICAgICAgaWYoZGF0YVN0ciA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXN0b3JlT2JqID0gSlNPTi5wYXJzZShkYXRhU3RyKTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gOiBNYXBGb250SW5mbztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1tpXSA9IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMCA7ICBqIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkgOyBqKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN0b3JlT2JqLl9mb250VGV4dHNbaV0gPT0gbnVsbCB8fCByZXN0b3JlT2JqLl9mb250VGV4dHNbaV1bal0gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbaV1bal0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuX2ZvbnRzW2ldW2pdID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogcmVzdG9yZU9iai5fZm9udFRleHRzW2ldW2pdLnRleHR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby5pc1N0dW50Rm9udCA9IHJlc3RvcmVPYmouX2ZvbnRUZXh0c1tpXVtqXS5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby54ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby55ID0gajtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlUHJvcGVydGllcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbZWxlbWVudF0gPSByZXN0b3JlT2JqW2VsZW1lbnRdO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dvcmRzID0gW11cclxuICAgICAgICAgICAgICAgIHJlc3RvcmVPYmouX3dvcmRUZXh0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IGVsZW1lbnQudGV4dH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mby50ZXh0ID09IG51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby5pc1N0dW50Rm9udCA9IGVsZW1lbnQuaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd29yZHMucHVzaCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3JkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU9iai5fc3BsaXRGb250V29yZFRleHRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogZWxlbWVudC50ZXh0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvLnRleHQgPT0gbnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLmlzU3R1bnRGb250ID0gZWxlbWVudC5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3Jkcy5wdXNoKHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3JkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU9iai5fc3BsaXRHcm91cFdvcmRUZXh0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IGVsZW1lbnQudGV4dH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mby50ZXh0ID09IG51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby5pc1N0dW50Rm9udCA9IGVsZW1lbnQuaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzLnB1c2godGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYocmVzdG9yZU9iai5fZHJvcGluZ0ZvbnRJbmZvVGV4dCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHJlc3RvcmVPYmouX2Ryb3BpbmdGb250SW5mb1RleHQudGV4dH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0ID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mby5pc1N0dW50Rm9udCA9IHJlc3RvcmVPYmouX2Ryb3BpbmdGb250SW5mb1RleHQuaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREaXNwZWxUZXh0KHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8ueCA9IHRoaXMuX3N0YXJ0UG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8ueSA9IHRoaXMuX3N0YXJ0UG9pbnQueTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21OZXh0Rm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9IHRoaXMuX25leHREcm9waW5nRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihyZXN0b3JlT2JqLl9uZXh0RHJvcGluZ0ZvbnRJbmZvVGV4dCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiByZXN0b3JlT2JqLl9uZXh0RHJvcGluZ0ZvbnRJbmZvVGV4dC50ZXh0fSk7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID09IG51bGwgfHwgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby50ZXh0ID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21OZXh0Rm9udCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250ID0gcmVzdG9yZU9iai5fbmV4dERyb3BpbmdGb250SW5mb1RleHQuaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrID0gW107XHJcbiAgICAgICAgICAgICAgICByZXN0b3JlT2JqLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrUG9zZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5wdXNoKHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zID0gW107XHJcbiAgICAgICAgICAgICAgICByZXN0b3JlT2JqLl9zeXNEcm9waW5nRm9udEluZm9zUG9zZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5wdXNoKHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aWNrVGltZSA9ICgxMDAgLSB0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnNwZWVkX3JhdGUpICogdGhpcy5fbWF4VGlja1RpbWUgLyAxMDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJDYWNoZURhdGFcIixudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlRHJvcGluZ0ZvbnQobGVmdCA6IGJvb2xlYW4pIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1pblRpY2tUaW1lID0gMC4zICogKDEwMCAtIHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3BlZWRfcmF0ZSkgKiB0aGlzLl9tYXhUaWNrVGltZSAvIDEwMFxyXG4gICAgICAgIGlmKGxlZnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8ueCA+IDAgJiYgdGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggLSAxXVt0aGlzLl9kcm9waW5nRm9udEluZm8ueV0gID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyh0aGlzLl9kcm9waW5nRm9udEluZm8ueCAtIDEsIHRoaXMuX2Ryb3BpbmdGb250SW5mby55KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpY2tUaW1lID0gdGhpcy5fdGlja1RpbWUgPiBtaW5UaWNrVGltZSA/IHRoaXMuX3RpY2tUaW1lIDogbWluVGlja1RpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mby54IDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggLSAxICYmIHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54ICsgMV1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnldICA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8odGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggKyAxLCB0aGlzLl9kcm9waW5nRm9udEluZm8ueSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aWNrVGltZSA9IHRoaXMuX3RpY2tUaW1lID4gbWluVGlja1RpbWUgPyB0aGlzLl90aWNrVGltZSA6IG1pblRpY2tUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGxldCB0YXJnZXRNYyA9IHRoaXMubGlzdF9ncmlkcy5nZXRDZWxsKHRoaXMuX2Ryb3BpbmdGb250SW5mby55ICogdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggKyB0aGlzLl9kcm9waW5nRm9udEluZm8ueCk7XHJcbiAgICAgICAgLy8gbGV0IGl0ZW1XaWR0aCA9IHRhcmdldE1jLndpZHRoO1xyXG4gICAgICAgIC8vIGxldCBwb2ludCA9IG5ldyBMYXlhLlBvaW50KHRhcmdldE1jLnggKyB0YXJnZXRNYy53aWR0aCAvIDIsIHRhcmdldE1jLnkgKyB0YXJnZXRNYy5oZWlnaHQgLyAyKTtcclxuICAgICAgICAvLyBwb2ludCA9ICh0YXJnZXRNYy5wYXJlbnQgYXMgTGF5YS5TcHJpdGUpLmxvY2FsVG9HbG9iYWwocG9pbnQpO1xyXG4gICAgICAgIC8vIC8v5Yik5pat5LiL56e75Yiw5bqVXHJcbiAgICAgICAgLy8gaWYoTWF0aC5hYnMocG9pbnQueCAtIExheWEuc3RhZ2UubW91c2VYKSA8IGl0ZW1XaWR0aCAvIDIpXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICBpZihMYXlhLnN0YWdlLm1vdXNlWSAtIHBvaW50LnkgPiBpdGVtV2lkdGggLyAyKVxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAvL+enu+WKqOWIsOW6lVxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5faXNRdWlja0Ryb3AgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgICAgICAgLy8gd2hpbGUodGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnhdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55ICsgMV0gPT0gbnVsbCAmJiB0aGlzLl9kcm9waW5nRm9udEluZm8ueSArIDEgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSlcclxuICAgICAgICAvLyAgICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgICAgIC8vICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8odGhpcy5fZHJvcGluZ0ZvbnRJbmZvLngsIHRoaXMuX2Ryb3BpbmdGb250SW5mby55ICsgMSlcclxuICAgICAgICAvLyAgICAgICAgIC8vIH1cclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIFxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgaWYoTGF5YS5zdGFnZS5tb3VzZVggPCBwb2ludC54KVxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAvL+WQkeW3puenu+WKqFxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggPiAwICYmIHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54IC0gMV1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnldICA9PSBudWxsKVxyXG4gICAgICAgIC8vICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyh0aGlzLl9kcm9waW5nRm9udEluZm8ueCAtIDEsIHRoaXMuX2Ryb3BpbmdGb250SW5mby55KTtcclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgICBlbHNlIFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAvL+WQkeWPs+S4gOWumlxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCAtIDEgJiYgdGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggKyAxXVt0aGlzLl9kcm9waW5nRm9udEluZm8ueV0gID09IG51bGwpXHJcbiAgICAgICAgLy8gICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKHRoaXMuX2Ryb3BpbmdGb250SW5mby54ICsgMSwgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkpO1xyXG4gICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGlmKGlzUmVmcmVzaExpc3QpXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5qOA5p+l5raI6Zmk5Lqn55Sf55qE5ryC5rWu5a2X5Yqg5YWl5YiX6KGoXHJcbiAgICBwcml2YXRlIGNoZWNrU3lzRHJvcEZvbnRzKCkgOiB2b2lke1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGlzQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZIC0gMSA7ICBqID49MCAgOyBqLS0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW2pdICE9IG51bGwgJiYgKGlzQWRkIHx8IChqKzEgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSAmJiB0aGlzLl9mb250c1tpXVtqKzFdID09IG51bGwpKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5pbmRleE9mKHRoaXMuX2ZvbnRzW2ldW2pdKSA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5wdXNoKHRoaXMuX2ZvbnRzW2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+enu+WKqOato+WcqOaTjeS9nOeahOWtl1xyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEcm9wRm9udFRvKHggOiBudW1iZXIgLCB5IDogbnVtYmVyLGZvbnRJbmZvIDogTWFwRm9udEluZm8gPSBudWxsKSA6IHZvaWR7XHJcbiAgICAgICAgaWYoeSA8IDAgfHwgeCA8IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHggPj0gdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggfHwgeSA+PSB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvbnRJbmZvID0gdGhpcy5fZHJvcGluZ0ZvbnRJbmZvO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mb250c1tmb250SW5mby54XVtmb250SW5mby55XSA9IG51bGw7XHJcbiAgICAgICAgZm9udEluZm8ueCA9IHg7XHJcbiAgICAgICAgZm9udEluZm8ueSA9IHk7XHJcbiAgICAgICAgdGhpcy5fZm9udHNbZm9udEluZm8ueF1bZm9udEluZm8ueV0gPSBmb250SW5mbztcclxuICAgIH1cclxuXHJcbiAgICAvL+abtOaWsOaWh+Wtl+WIl+ihqFxyXG4gICAgcHJpdmF0ZSByZW5kZXJHcmlkTGlzdCgpIDogdm9pZHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMDsgaiA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZOyBqKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwIDsgIGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCA7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2godGhpcy5fZm9udHNbaV1bal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGlzdF9ncmlkcy5kYXRhU291cmNlID0gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N0dW50Rm9udHNDaGVja0FycjEgOiBhbnlbXSA9IFtdOyAvL+WQiOaIkOa2iOmZpOehruiupOmYn+WIl1xyXG4gICAgcHJpdmF0ZSBfc3R1bnRGb250c0NoZWNrQXJyMiA6IGFueVtdID0gW107IC8v57uE6K+N5raI6Zmk56Gu6K6k6Zif5YiXXHJcbiAgICAvKipcclxuICAgICAqIOa2iOmZpOaxieWtkFxyXG4gICAgICogQHBhcmFtIHggeOWdkOagh+aIluiAhW1hcGZvbnRpbmZvXHJcbiAgICAgKiBAcGFyYW0geSB55Z2Q5qCHXHJcbiAgICAgKiBAcGFyYW0gc3R1bnRDaGVjayDmmK/lkKbmiafooYzmioDog70g6buY6K6kdHJ1ZVxyXG4gICAgICogQHBhcmFtIGlzSGVDaGVuZ0hhblppICDmmK/lkKbmmK/lkIjmiJDmsYnlrZDml7blgJnnmoTmtojpmaQg6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRpc3BlbEZvbnQoeCA6IG51bWJlciB8IE1hcEZvbnRJbmZvLCB5IDogbnVtYmVyID0gMCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBkaXNwZWxGb250SW5mbyA6IE1hcEZvbnRJbmZvO1xyXG4gICAgICAgIGxldCBpbmRYIDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBpbmRZIDogbnVtYmVyO1xyXG4gICAgICAgIGlmKHggaW5zdGFuY2VvZiBNYXBGb250SW5mbylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BlbEZvbnRJbmZvID0geDtcclxuICAgICAgICAgICAgdGhpcy5fZm9udHNbeC54XVt4LnldID0gbnVsbDtcclxuICAgICAgICAgICAgaW5kWCA9IHgueDtcclxuICAgICAgICAgICAgaW5kWSA9IHgueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BlbEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyh4LHkpO1xyXG4gICAgICAgICAgICBpZihkaXNwZWxGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbeF1beV0gPSBudWxsO1xyXG4gICAgICAgICAgICBpbmRYID0geDtcclxuICAgICAgICAgICAgaW5kWSA9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRpc3BlbEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3lzSW5kID0gdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5pbmRleE9mKGRpc3BlbEZvbnRJbmZvKSBcclxuICAgICAgICAgICAgaWYoc3lzSW5kICE9IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLnNwbGljZShzeXNJbmQgLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzeXNJbmQgPSB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLmluZGV4T2YoZGlzcGVsRm9udEluZm8pIFxyXG4gICAgICAgICAgICBpZihzeXNJbmQgIT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2suc3BsaWNlKHN5c0luZCAsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRpc3BlbEZvbnRJbmZvLmRlc3Ryb3lTdHVudEVmZmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaKgOiDveaxieWtkOaViOaenFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGludm9rZVN0dW50Rm9udCgpIDogYm9vbGVhbntcclxuICAgICAgICBsZXQgcG9pbnRzMSA9IFtdO1xyXG4gICAgICAgIGxldCBwb2ludHMyID0gW107XHJcbiAgICAgICAgbGV0IHNjb3JlIDogbnVtYmVyID0gMDtcclxuICAgICAgICBsZXQgdGVtcEZvbnRJbmZvIDogTWFwRm9udEluZm87XHJcbiAgICAgICAgbGV0IGVmZmVjdE9iaiA9IHt9O1xyXG4gICAgICAgIGxldCBwdXNoQXJyRnVuID0gZnVuY3Rpb24oeCA6IG51bWJlciwgeSA6IG51bWJlciwgYXJyIDogTGF5YS5Qb2ludFtdKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIGlmKGVmZmVjdE9ialt4ICsgXCJfXCIgKyB5XSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChuZXcgTGF5YS5Qb2ludCh4LHkpKTtcclxuICAgICAgICAgICAgICAgIGVmZmVjdE9ialt4ICsgXCJfXCIgKyB5XSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAvL+a2iOmZpOaKgOiDveagvOWtkOWbm+WRqFxyXG4gICAgICAgICAgICBpZihlbGVtZW50LmZvbnRJbmZvICE9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC5mb250SW5mby54LGVsZW1lbnQuZm9udEluZm8ueSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v5oqA6IO95rGJ5a2X5bey57uP6KKr5raI6Zmk5LiN6Kem5Y+R5oqA6IO9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHVzaEFyckZ1bihlbGVtZW50LmZvbnRJbmZvLnggLSAxLGVsZW1lbnQuZm9udEluZm8ueSxwb2ludHMxKTtcclxuICAgICAgICAgICAgcHVzaEFyckZ1bihlbGVtZW50LmZvbnRJbmZvLnggKyAxLGVsZW1lbnQuZm9udEluZm8ueSxwb2ludHMxKTtcclxuICAgICAgICAgICAgcHVzaEFyckZ1bihlbGVtZW50LmZvbnRJbmZvLngsZWxlbWVudC5mb250SW5mby55IC0gMSxwb2ludHMxKTtcclxuICAgICAgICAgICAgcHVzaEFyckZ1bihlbGVtZW50LmZvbnRJbmZvLngsZWxlbWVudC5mb250SW5mby55ICsgMSxwb2ludHMxKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8v5raI6Zmk5YyF5ZCr5b2T5YmN5a2X55qE5omA5pyJ5rGJ5a2Q5qC85a2QXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5fZm9udHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLl9mb250c1tpXS5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLl9mb250c1tpXVtqXSBhcyBNYXBGb250SW5mbztcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mby5nZXRTdHJ1Y3RJbmZvcyhlbGVtZW50LmlkLGZhbHNlKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29yZSArPSAxMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hBcnJGdW4odGVtcEZvbnRJbmZvLngsdGVtcEZvbnRJbmZvLnkscG9pbnRzMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIC8v5raI6Zmk5YyF5ZCr5b2T5YmN5a2X55qE5omA5pyJ5rGJ5a2Q5qC85a2QXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLl9mb250cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHRoaXMuX2ZvbnRzW2ldLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuX2ZvbnRzW2ldW2pdIGFzIE1hcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvLmdldFN0cnVjdEluZm9zKGVsZW1lbnQuaWQsZmFsc2UpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlICs9MTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoQXJyRnVuKHRlbXBGb250SW5mby54LHRlbXBGb250SW5mby55LHBvaW50czIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHRpbWVUb1VwZGF0ZSA6IG51bWJlcjtcclxuICAgICAgICBpZihwb2ludHMxLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgdGltZVRvVXBkYXRlID0gNzAwO1xyXG4gICAgICAgICAgICBwb2ludHMxLmZvckVhY2goZWxlbWVudDIgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50Mi54LGVsZW1lbnQyLnkpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcmUgKz0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudDIueCxlbGVtZW50Mi55KTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDUwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzMS5mb3JFYWNoKGVsZW1lbnQzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudDMueCxlbGVtZW50My55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQuZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LmNsZWFyRWZmZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5vblVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDcwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFyKHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3Rhcl9udW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDg1MCx0aGlzLGZ1bmN0aW9uKCkgIDp2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHBvaW50czIubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICB0aW1lVG9VcGRhdGUgPSAxMDAwO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMzAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7ICAgXHJcbiAgICAgICAgICAgICAgICBwb2ludHMyLmZvckVhY2goZWxlbWVudDIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudDIueCxlbGVtZW50Mi55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudDIueCxlbGVtZW50Mi55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMyLmZvckVhY2goZWxlbWVudDMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50My54LGVsZW1lbnQzLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5mb250ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQuY2xlYXJFZmZlY3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0Lm9uVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMTUwLHRoaXMsZnVuY3Rpb24oKSAgOnZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Njb3JlICs9IHNjb3JlO1xyXG4gICAgICAgIGlmKHRpbWVUb1VwZGF0ZSA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UodGltZVRvVXBkYXRlLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXIodGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zdGFyX251bSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMSA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIgPSBbXTtcclxuICAgICAgICByZXR1cm4gcG9pbnRzMS5sZW5ndGggPiAwIHx8IHBvaW50czIubGVuZ3RoID4gMFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5raI6Zmk6K+N57uEXHJcbiAgICAgKiBAcGFyYW0gY2hhbmdlRm9udEluZm9zIOacieWPmOabtOeahOaxieWtkOWIl+ihqFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRpc3BlbENpWnUoY2hhbmdlRm9udEluZm9zIDogTWFwRm9udEluZm9bXSkgOiBib29sZWFue1xyXG4gICAgICAgIGxldCBjaGVja0ZvbnRUeHRzID0gW107Ly/lvZPliY3miYDmnInmsYnlrZDliJfooahcclxuICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwOyBqIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFk7IGorKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDAgOyAgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYIDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhpLGopO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR4dCA9IHRlbXBGb250SW5mby50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNoZWNrRm9udFR4dHMuaW5kZXhPZih0eHQpID09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tGb250VHh0cy5wdXNoKHR4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjaGVja0FyciA9IFtdOy8v5p+l5om+5omA5pyJ5bGP5bmV5LiK5omA5pyJ5a2X55qE6K+N5YW477yM5om+5Ye65Y+v6IO955qE57uE5ZCI5YiX6KGoXHJcbiAgICAgICAgY2hlY2tGb250VHh0cy5mb3JFYWNoKGVsZW1lbnQxPT57XHJcbiAgICAgICAgICAgIGxldCB0ZW1wQXJyID0gTWFwRm9udEluZm8uZ2V0R3JvdXAoZWxlbWVudDEpO1xyXG4gICAgICAgICAgICB0ZW1wQXJyLmZvckVhY2goZWxlbWVudDIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoY2hlY2tBcnIuaW5kZXhPZihlbGVtZW50MikgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGNoYXJzID0gZWxlbWVudDIuc3BsaXQoXCJcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNGaXggOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihjaGVja0ZvbnRUeHRzLmluZGV4T2YoY2hhcnNbaV0pID09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNGaXggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoaXNGaXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWxlbWVudDIgPT0gdGhpcy5fcG9wdWxhckdyb3VwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tBcnIudW5zaGlmdChlbGVtZW50Mik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0Fyci5wdXNoKGVsZW1lbnQyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL+mBjeWOhuWPmOabtOWIl+ihqO+8jOWvu+aJvuWPr+a2iOmZpOeahOivjee7hOW5tuaJp+ihjOa2iOmZpFxyXG4gICAgICAgIGxldCBpc0Rpc3BlbCA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBjaGFuZ2VGb250SW5mb3MuZm9yRWFjaChlbGVtZW50ID0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkpICE9IGVsZW1lbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgY291dCA9IHRoaXMuZGlzcGVsQ2ladUl0ZW0oZWxlbWVudC54LGVsZW1lbnQueSxjaGVja0Fycik7XHJcbiAgICAgICAgICAgIGlmKGNvdXQgPT0gdHJ1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaXNEaXNwZWwgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gaXNEaXNwZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2hlY2tDaGFycyA6IHN0cmluZ1tdO1xyXG4gICAgcHJpdmF0ZSBkaXNwZWxDaVp1SXRlbSh4IDogbnVtYmVyLCB5IDogbnVtYmVyLGNoZWNrQXJyIDogc3RyaW5nW10pIDogYm9vbGVhbntcclxuICAgICAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Rm9udEluZm8oeCx5KTtcclxuICAgICAgICBpZihyb290ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBjaGVja0Fyci5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBncm91cCA9IGNoZWNrQXJyW2ldO1xyXG4gICAgICAgICAgICBpZihncm91cC5pbmRleE9mKHJvb3QudGV4dCkgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrQ2hhcnMgPSBncm91cC5zcGxpdChcIlwiKTtcclxuICAgICAgICAgICAgbGV0IGFTdGFySW5mbyA9IHRoaXMuZGlzcGVsQ2ladUl0ZW1TdXJlKHgseSxudWxsKTtcclxuICAgICAgICAgICAgaWYoYVN0YXJJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v5raI6Zmk6K+N57uEXHJcbiAgICAgICAgICAgICAgICBTb3VuZFRvb2wucGxheVhpYW9DaHVFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheUVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICAgICAgaWYoZ3JvdXAgPT0gdGhpcy5fcG9wdWxhckdyb3VwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVsYXJHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIua2iOmZpOivjee7hO+8mj09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuivjee7hO+8mlwiICsgZ3JvdXApXHJcbiAgICAgICAgICAgICAgICBsZXQgc2NvcmUgPSA0MDtcclxuICAgICAgICAgICAgICAgIGxldCBwb2ludHMgPSBhU3RhckluZm8uZ2V0U3VyZUxpc3QoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0aW1lID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBjaVp1T2JqID0ge307XHJcbiAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjaVp1T2JqW2VsZW1lbnQueCArIFwiX1wiICsgZWxlbWVudC55XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250ID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJwb2ludCA6IChcIit0ZW1wRm9udC54K1wiLFwiK3RlbXBGb250LnkrXCIsXCIrdGVtcEZvbnQudGV4dCtcIilcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250LmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyLnB1c2goe2ZvbnRJbmZvIDogdGVtcEZvbnQsaWQgOiB0ZW1wRm9udC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnQgPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCAtIDEsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQuaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIucHVzaCh7Zm9udEluZm8gOiB0ZW1wRm9udCxpZCA6IHRlbXBGb250LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZSArKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnQgPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCArIDEsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQuaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIucHVzaCh7Zm9udEluZm8gOiB0ZW1wRm9udCxpZCA6IHRlbXBGb250LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udCA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udC5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMi5wdXNoKHtmb250SW5mbyA6IHRlbXBGb250LGlkIDogdGVtcEZvbnQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250ID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250LmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyLnB1c2goe2ZvbnRJbmZvIDogdGVtcEZvbnQsaWQgOiB0ZW1wRm9udC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNjb3JlICs9ICh0aW1lICogMTApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2NvcmUgKz0gc2NvcmU7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNTAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQuZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LmNsZWFyRWZmZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5vblVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSgyMDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcFggPSBlbGVtZW50LnggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcFkgPSBlbGVtZW50Lnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNpWnVPYmpbdGVtcFggKyBcIl9cIiArIHRlbXBZXSAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdCh0ZW1wWCx0ZW1wWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFggPSBlbGVtZW50LnggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wWSA9IGVsZW1lbnQueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2ladU9ialt0ZW1wWCArIFwiX1wiICsgdGVtcFldICE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KHRlbXBYLHRlbXBZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wWCA9IGVsZW1lbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFkgPSBlbGVtZW50LnkgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaVp1T2JqW3RlbXBYICsgXCJfXCIgKyB0ZW1wWV0gIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQodGVtcFgsdGVtcFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBYID0gZWxlbWVudC54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wWSA9IGVsZW1lbnQueSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNpWnVPYmpbdGVtcFggKyBcIl9cIiArIHRlbXBZXSAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdCh0ZW1wWCx0ZW1wWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDcwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGlzcGVsVGV4dChncm91cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXIodGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zdGFyX251bSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSg4NTAsdGhpcyxmdW5jdGlvbigpICA6dm9pZHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGlzcGVsQ2ladUl0ZW1TdXJlKHggOiBudW1iZXIsIHkgOiBudW1iZXIscGFyZW50QVN0YXJJbmZvIDogU2VhcmNoSW5mbykgOiBTZWFyY2hJbmZve1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjdXJyZW50Rm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKHgseSk7XHJcbiAgICAgICAgaWYoY3VycmVudEZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNoYXJzID0gcGFyZW50QVN0YXJJbmZvID09IG51bGwgPyB0aGlzLl9jaGVja0NoYXJzLmNvbmNhdCgpIDpwYXJlbnRBU3RhckluZm8uY2hhcnMuY29uY2F0KCk7XHJcbiAgICAgICAgaWYoY2hhcnMuaW5kZXhPZihjdXJyZW50Rm9udEluZm8udGV4dCkgPT0gLTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGFTdGFySW5mbyA9IG5ldyBTZWFyY2hJbmZvKCk7XHJcbiAgICAgICAgYVN0YXJJbmZvLmN1cnJlbnRQb2ludC54ID0geDtcclxuICAgICAgICBhU3RhckluZm8uY3VycmVudFBvaW50LnkgPSB5O1xyXG4gICAgICAgIGFTdGFySW5mby5zZXRPcGVuTGlzdChwYXJlbnRBU3RhckluZm8gPT0gbnVsbCA/IFtdIDogcGFyZW50QVN0YXJJbmZvLmdldE9wZW5MaXN0KCkuY29uY2F0KCkpXHJcbiAgICAgICAgYVN0YXJJbmZvLnNldFN1cmVMaXN0KHBhcmVudEFTdGFySW5mbyA9PSBudWxsID8gW10gOiBwYXJlbnRBU3RhckluZm8uZ2V0U3VyZUxpc3QoKS5jb25jYXQoKSk7XHJcbiAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCx5LGZhbHNlKTtcclxuICAgICAgICBhU3RhckluZm8uc3VyZSh4LHkpO1xyXG4gICAgICAgIGFTdGFySW5mby5jaGFycyA9IGNoYXJzO1xyXG4gICAgICAgIGFTdGFySW5mby5jaGFycy5zcGxpY2UoYVN0YXJJbmZvLmNoYXJzLmluZGV4T2YoY3VycmVudEZvbnRJbmZvLnRleHQpLDEpO1xyXG4gICAgICAgIGlmKGFTdGFySW5mby5jaGFycy5sZW5ndGggPT0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhU3RhckluZm87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHggLSAxLHkpICYmICFhU3RhckluZm8uaXNTdXJlKHggLSAxLHkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCAtIDEseSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHggKyAxLHkpICYmICFhU3RhckluZm8uaXNTdXJlKHggKyAxLHkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCArIDEseSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHgseSAtIDEpICYmICFhU3RhckluZm8uaXNTdXJlKHgseSAtIDEpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCx5IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHgseSArIDEpICYmICFhU3RhckluZm8uaXNTdXJlKHgseSArIDEpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCx5ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBvcGVuTGlzdCA9IGFTdGFySW5mby5nZXRPcGVuTGlzdCgpO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gb3Blbkxpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCBjb3V0ID0gdGhpcy5kaXNwZWxDaVp1SXRlbVN1cmUoZWxlbWVudC54LCBlbGVtZW50LnksIGFTdGFySW5mbyk7XHJcbiAgICAgICAgICAgIGlmKGNvdXQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmtojlrZdcclxuICAgICAqIEBwYXJhbSB4IFxyXG4gICAgICogQHBhcmFtIHkgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZGlzcGVsKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogYm9vbGVhbntcclxuICAgICAgICBsZXQgdGFyZ2V0Rm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKHgseSk7XHJcbiAgICAgICAgaWYodGFyZ2V0Rm9udEluZm8gPT0gbnVsbClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgbGV0IGNhbkhlQ2hlbmdGb250SW5mb3MgPSB0YXJnZXRGb250SW5mby5jYW5IZUNoZW5nRm9udEluZm9zO1xyXG4gICAgICAgIGlmKGNhbkhlQ2hlbmdGb250SW5mb3MubGVuZ3RoID09IDApcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBwb3B1bGFyR3JvdXAgPSB0aGlzLl9wb3B1bGFyR3JvdXA7XHJcbiAgICAgICAgaWYocG9wdWxhckdyb3VwICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYW5IZUNoZW5nRm9udEluZm9zLnNvcnQoZnVuY3Rpb24oYSA6IE1hcEZvbnRJbmZvLCBiIDogTWFwRm9udEluZm8pIDogbnVtYmVye1xyXG4gICAgICAgICAgICAgICAgaWYocG9wdWxhckdyb3VwLmluZGV4T2YoYS50ZXh0KSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHBvcHVsYXJHcm91cC5pbmRleE9mKGIudGV4dCkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/pgY3ljoblj5jmm7TliJfooajvvIzlr7vmib7lj6/mtojpmaTnmoTor43nu4TlubbmiafooYzmtojpmaRcclxuICAgICAgICBsZXQgaGFzSGVDaGVuZyA9IGZhbHNlO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9MCA7IGk8IGNhbkhlQ2hlbmdGb250SW5mb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihoYXNIZUNoZW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvID0gY2FuSGVDaGVuZ0ZvbnRJbmZvc1tpXTtcclxuICAgICAgICAgICAgbGV0IHN0cnVjdEluZm9MaXN0ID0gdGVtcEZvbnRJbmZvLnN0cnVjdEluZm8uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwOyBqIDwgc3RydWN0SW5mb0xpc3QubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJ1Y3RMaXN0ID0gc3RydWN0SW5mb0xpc3Rbal0uc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RydWN0TGlzdC5sZW5ndGggPiAxICYmIHN0cnVjdExpc3QuaW5kZXhPZih0YXJnZXRGb250SW5mby5pZC50b1N0cmluZygpKSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY291dCA9IHRoaXMuZGlzcGVsSXRlbSh0YXJnZXRGb250SW5mby54LHRhcmdldEZvbnRJbmZvLnksc3RydWN0TGlzdCx0ZW1wRm9udEluZm8uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvdXQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNIZUNoZW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoYXNIZUNoZW5nXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2hlY2tJZHMgOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBkaXNwZWxJdGVtKHggOiBudW1iZXIseSA6IG51bWJlcixjaGVja0FyciA6IHN0cmluZ1tdLGZvbnRJZCA6IG51bWJlcikgOiBib29sZWFue1xyXG4gICAgICAgIGxldCByb290ID0gdGhpcy5nZXRGb250SW5mbyh4LHkpO1xyXG4gICAgICAgIGlmKHJvb3QgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2hlY2tJZHMgPSBjaGVja0FycjtcclxuICAgICAgICBsZXQgc2VhcmNoSW5mbyA9IHRoaXMuZGlzcGVsSXRlbVN1cmUoeCx5LG51bGwpO1xyXG4gICAgICAgIGlmKHNlYXJjaEluZm8gIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v5raI6Zmk5bm25ZCI5oiQ5rGJ5a2QXHJcbiAgICAgICAgICAgIFNvdW5kVG9vbC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgbGV0IG1heFF1YWxpdHkgPSAwO1xyXG4gICAgICAgICAgICBsZXQgcG9pbnRzID0gc2VhcmNoSW5mby5nZXRTdXJlTGlzdCgpO1xyXG4gICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEdyaWQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsIGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICBpZihtYXhRdWFsaXR5IDwgdGVtcEZvbnRJbmZvLnF1YWxpdHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4UXVhbGl0eSA9IHRlbXBGb250SW5mby5xdWFsaXR5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodGVtcEZvbnRHcmlkICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRHcmlkLnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmtojpmaTmoLzlrZA6IChcIitlbGVtZW50LngrXCIsXCIrZWxlbWVudC55K1wiKVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxldCBjb3V0Rm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe2lkIDogZm9udElkfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGlzcGVsVGV4dChjb3V0Rm9udEluZm8udGV4dCk7XHJcbiAgICAgICAgICAgIGNvdXRGb250SW5mby54ID0geDtcclxuICAgICAgICAgICAgY291dEZvbnRJbmZvLnkgPSB5O1xyXG4gICAgICAgICAgICBjb3V0Rm9udEluZm8ucXVhbGl0eSA9IG1heFF1YWxpdHkgKyAxO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0Q2VsbCA9IHRoaXMuZ2V0Rm9udENlbGwoeCx5KTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFBvaW50ID0gbmV3IExheWEuUG9pbnQodGFyZ2V0Q2VsbC54LCB0YXJnZXRDZWxsLnkpO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNTAwLHRoaXMsZnVuY3Rpb24ocGFyX3BvaW50cykgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgcGFyX3BvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCwgZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gPT0gbnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWxlbWVudC54ICE9IHggfHwgZWxlbWVudC55ICE9IHkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZVN0YXJ0Q2VsbCA9IHRoaXMuZ2V0Rm9udENlbGwoZWxlbWVudC54LCBlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZVN0YXJ0Rm9udEdyaWRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVTdGFydEZvbnRHcmlkU2NyaXB0LmZvbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlU3RhcnRGb250R3JpZFNjcmlwdC5jbGVhckVmZmVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vdmVDZWxsID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcIkZvbnRHcmlkXCIsIHRoaXMucHJlZmFiX2ZvbnRHcmlkLmNyZWF0ZSwgdGhpcy5wcmVmYWJfZm9udEdyaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlQ2VsbFtcInhcIl0gPSBtb3ZlU3RhcnRDZWxsW1wieFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUNlbGxbXCJ5XCJdID0gbW92ZVN0YXJ0Q2VsbFtcInlcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlRm9udEdyaWRTY3JpcHQgPSAobW92ZUNlbGwuZ2V0Q29tcG9uZW50KEZvbnRHcmlkKSBhcyBGb250R3JpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVGb250R3JpZFNjcmlwdC5mb250ID0gdGVtcEZvbnRJbmZvLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVGb250R3JpZFNjcmlwdC5hZGRFZmZlY3QodGVtcEZvbnRJbmZvLmdldFN0dW50Rm9udEVmZmVjdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUZvbnRHcmlkU2NyaXB0Lm9uVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdF9ncmlkcy5hZGRDaGlsZChtb3ZlQ2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExheWEuVHdlZW4udG8obW92ZUNlbGwse3ggOiB0YXJnZXRQb2ludC54LCB5IDogdGFyZ2V0UG9pbnQueX0sMTAwLG51bGwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKHRhcmdldE1jKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRNYy5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFttb3ZlQ2VsbF0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICYmIHRlbXBGb250SW5mby5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjEucHVzaCh7Zm9udEluZm8gOiBjb3V0Rm9udEluZm8saWQgOiB0ZW1wRm9udEluZm8uaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFtwb2ludHNdKTtcclxuICAgICAgICAgICAgbGV0IHNjb3JlID0gMTA7XHJcbiAgICAgICAgICAgIGxldCB0aW1lID0gcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgc2NvcmUgKz0gMTAgKiB0aW1lO1xyXG4gICAgICAgICAgICB0aGlzLl9zY29yZSArPSBzY29yZTtcclxuICAgICAgICAgICAgQ29udHJvbGxlck1nci5nZXRJbnN0YW5jZShUaXBDb250cm9sbGVyKS5zaG93TGVmdEJvdHRvbVRpcChcIitcIiArIHNjb3JlKTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDU1MCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbeF1beV0gPSBjb3V0Rm9udEluZm87XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0Rm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdCh4LHkpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Rm9udFNjcmlwdC5mb250ID0gY291dEZvbnRJbmZvLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRGb250U2NyaXB0LmFkZEVmZmVjdChjb3V0Rm9udEluZm8uZ2V0U3R1bnRGb250RWZmZWN0KCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFyKHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3Rhcl9udW0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbnVRaSArKztcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTnVRaSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNzAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuWQiOaIkOaxieWtkO+8mj09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIihcIitjb3V0Rm9udEluZm8ueCtcIixcIitjb3V0Rm9udEluZm8ueStcIixcIitjb3V0Rm9udEluZm8udGV4dCtcIilcIik7XHJcbiAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MucHVzaChjb3V0Rm9udEluZm8pO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkaXNwZWxJdGVtU3VyZSh4IDogbnVtYmVyLCB5IDogbnVtYmVyLHBhcmVudEFTdGFySW5mbyA6IFNlYXJjaEluZm8pIDogU2VhcmNoSW5mb1xyXG4gICAge1xyXG4gICAgICAgIGxldCBjdXJyZW50Rm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKHgseSk7XHJcbiAgICAgICAgaWYoY3VycmVudEZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNoYXJzID0gcGFyZW50QVN0YXJJbmZvID09IG51bGwgPyB0aGlzLl9jaGVja0lkcy5jb25jYXQoKSA6cGFyZW50QVN0YXJJbmZvLmNoYXJzLmNvbmNhdCgpO1xyXG4gICAgICAgIGlmKGNoYXJzLmluZGV4T2YoY3VycmVudEZvbnRJbmZvLmlkLnRvU3RyaW5nKCkpID09IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBhU3RhckluZm8gPSBuZXcgU2VhcmNoSW5mbygpO1xyXG4gICAgICAgIGFTdGFySW5mby5jdXJyZW50UG9pbnQueCA9IHg7XHJcbiAgICAgICAgYVN0YXJJbmZvLmN1cnJlbnRQb2ludC55ID0geTtcclxuICAgICAgICBhU3RhckluZm8uc2V0T3Blbkxpc3QocGFyZW50QVN0YXJJbmZvID09IG51bGwgPyBbXSA6IHBhcmVudEFTdGFySW5mby5nZXRPcGVuTGlzdCgpLmNvbmNhdCgpKVxyXG4gICAgICAgIGFTdGFySW5mby5zZXRTdXJlTGlzdChwYXJlbnRBU3RhckluZm8gPT0gbnVsbCA/IFtdIDogcGFyZW50QVN0YXJJbmZvLmdldFN1cmVMaXN0KCkuY29uY2F0KCkpO1xyXG4gICAgICAgIGFTdGFySW5mby5vcGVuKHgseSxmYWxzZSk7XHJcbiAgICAgICAgYVN0YXJJbmZvLnN1cmUoeCx5KTtcclxuICAgICAgICBhU3RhckluZm8uY2hhcnMgPSBjaGFycztcclxuICAgICAgICBhU3RhckluZm8uY2hhcnMuc3BsaWNlKGFTdGFySW5mby5jaGFycy5pbmRleE9mKGN1cnJlbnRGb250SW5mby5pZC50b1N0cmluZygpKSwxKTtcclxuICAgICAgICBpZihhU3RhckluZm8uY2hhcnMubGVuZ3RoID09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gYVN0YXJJbmZvO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4IC0gMSx5KSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4IC0gMSx5KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHggLSAxLHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4ICsgMSx5KSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4ICsgMSx5KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHggKyAxLHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4LHkgLSAxKSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4LHkgLSAxKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHgseSAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4LHkgKyAxKSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4LHkgKyAxKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHgseSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3Blbkxpc3QgPSBhU3RhckluZm8uZ2V0T3Blbkxpc3QoKTtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IG9wZW5MaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgY291dCA9IHRoaXMuZGlzcGVsSXRlbVN1cmUoZWxlbWVudC54LCBlbGVtZW50LnksIGFTdGFySW5mbyk7XHJcbiAgICAgICAgICAgIGlmKGNvdXQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3VpZGVJbWdzID0ge307XHJcbiAgICBwcml2YXRlIF9ndWlkZVJhdGUgOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBkZXN0cm95R3VpZGVJbWdzKCkgOiB2b2lke1xyXG4gICAgICAgIGZvcihsZXQgdGVtcFByb3BlcnR5IGluIHRoaXMuX2d1aWRlSW1ncylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wSW1nID0gdGhpcy5fZ3VpZGVJbWdzW3RlbXBQcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXJBbGwodGVtcEltZyk7XHJcbiAgICAgICAgICAgIExheWEuVHdlZW4uY2xlYXJBbGwodGVtcEltZyk7XHJcbiAgICAgICAgICAgIHRlbXBJbWcuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZ3VpZGVJbWdzID0ge307XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOW+queOr+aJgOaciemhtuagvO+8jOaYvuekuui3n+W9k+WJjemjmOiQveeahOaxieWtkOacieWFs+iBlOeahOagvOWtkO+8jOWNs+WPr+e7hOaIkOivjeivreaIluiAheWSjOWQiOaIkOaxieWtkOeahOagvOWtkFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGd1aWRlVG9HcmlkKCkgOiB2b2lke1xyXG4gICAgICAgIGZvcihsZXQgdGVtcFByb3BlcnR5IGluIHRoaXMuX2d1aWRlSW1ncylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wSW1nID0gdGhpcy5fZ3VpZGVJbWdzW3RlbXBQcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXJBbGwodGVtcEltZyk7XHJcbiAgICAgICAgICAgIExheWEuVHdlZW4uY2xlYXJBbGwodGVtcEltZyk7XHJcbiAgICAgICAgICAgIHRlbXBJbWcuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZ3VpZGVJbWdzID0ge307XHJcbiAgICAgICAgbGV0IHJhdGUgPSBNYXRoLnJhbmRvbSgpICogMTAwO1xyXG4gICAgICAgIGlmKHJhdGUgPiB0aGlzLl9ndWlkZVJhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9ndWlkZVJhdGUgPSBNYXRoLm1pbiggdGhpcy5fZ3VpZGVSYXRlICsgMSw1KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgZHJvcGluZ0ZvbnRDYW5IZUNoZW5nRm9udEluZm9zID0gdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLmNhbkhlQ2hlbmdGb250SW5mb3M7XHJcbiAgICAgICAgbGV0IGRyb3BpbmdGb250Q2FuSGVDaGVuZ0dyb3VwcyA9IHRoaXMuX2Ryb3BpbmdGb250SW5mby5jYW5IZUNoZW5nR3JvdXBzO1xyXG4gICAgICAgIGxldCB0b3BGb250SW5mb3MgPSB0aGlzLmdldFRvcEZvbnRJbmZvcygpO1xyXG4gICAgICAgIGxldCBwb2ludHMgPSBbXTtcclxuICAgICAgICB0b3BGb250SW5mb3MuZm9yRWFjaCh0ZW1wRm9udEluZm8gPT4ge1xyXG4gICAgICAgICAgICBkcm9waW5nRm9udENhbkhlQ2hlbmdHcm91cHMuZm9yRWFjaCh0ZW1wR3JvdXAgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEdyb3VwLmxlbmd0aCAhPSAyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBncm91cEFyciA9IHRlbXBHcm91cC5zcGxpdChcIlwiKTtcclxuICAgICAgICAgICAgICAgIGdyb3VwQXJyLnNwbGljZShncm91cEFyci5pbmRleE9mKHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0KSwxKTtcclxuICAgICAgICAgICAgICAgIGlmKGdyb3VwQXJyLmluZGV4T2YodGVtcEZvbnRJbmZvLnRleHQpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5Y+v5ZCI5oiQ6K+N57uEXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IExheWEuUG9pbnQodGVtcEZvbnRJbmZvLngsdGVtcEZvbnRJbmZvLnkpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkcm9waW5nRm9udENhbkhlQ2hlbmdGb250SW5mb3MuZm9yRWFjaCh0ZW1wTWVyZ2VGb250SW5mbyA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RydWN0SW5mb3MgPSB0ZW1wTWVyZ2VGb250SW5mby5nZXRTdHJ1Y3RJbmZvcyh0ZW1wRm9udEluZm8uaWQpO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHN0cnVjdEluZm9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wU3RydWNrSW5mbyA9IHN0cnVjdEluZm9zW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wU3RydWNrQXJyID0gdGVtcFN0cnVja0luZm8uc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBTdHJ1Y2tBcnIubGVuZ3RoICE9IDIpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcFN0cnVja0Fyci5zcGxpY2UodGVtcFN0cnVja0Fyci5pbmRleE9mKHRlbXBGb250SW5mby5pZC50b1N0cmluZygpKSwxKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wU3RydWNrQXJyLmluZGV4T2YodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLmlkLnRvU3RyaW5nKCkpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6/lkIjmiJDmsYnlrZBcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IExheWEuUG9pbnQodGVtcEZvbnRJbmZvLngsdGVtcEZvbnRJbmZvLnkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZihwb2ludHMubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2d1aWRlUmF0ZSA9IDA7XHJcbiAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ3VpZGVJbWdzW2VsZW1lbnQueCArIFwiLVwiICsgZWxlbWVudC55XSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wR3JpZCA9IHRoaXMuZ2V0Rm9udENlbGwoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEltZyA9IG5ldyBMYXlhLkltYWdlKFwibWFwL3R6X2ppYW50b3UucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgdGVtcEltZy5zY2FsZVggPSB0ZW1wSW1nLnNjYWxlWSA9IDAuNztcclxuICAgICAgICAgICAgICAgIHRlbXBJbWcucm90YXRpb24gPSA5MDtcclxuICAgICAgICAgICAgICAgIHRlbXBJbWcueCA9IDc1O1xyXG4gICAgICAgICAgICAgICAgdGVtcEltZy55ID0gLTc1O1xyXG4gICAgICAgICAgICAgICAgdGVtcEdyaWQuYWRkQ2hpbGQodGVtcEltZyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZUltZ3NbZWxlbWVudC54ICsgXCItXCIgKyBlbGVtZW50LnldID0gdGVtcEltZztcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIubG9vcCgxMDAwLHRlbXBJbWcsZnVuY3Rpb24ocGFyX2ltZyA6IExheWEuSW1hZ2UpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0WSA9IHBhcl9pbWcueSA9PSAtNzU/IC04NSA6IC03NTtcclxuICAgICAgICAgICAgICAgICAgICBMYXlhLlR3ZWVuLnRvKHBhcl9pbWcse3kgOiB0YXJnZXRZfSw3NTApO1xyXG4gICAgICAgICAgICAgICAgfSxbdGVtcEltZ10pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Rm9udEluZm8oeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBNYXBGb250SW5mb1xyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuX2ZvbnRzW3hdID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRzW3hdW3ldO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Rm9udENlbGwoeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBMYXlhLkJveFxyXG4gICAge1xyXG4gICAgICAgIGlmKHkgPCAwIHx8IHkgPj0gdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkgfHwgeCA8IDAgfHwgeCA+PSB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0X2dyaWRzLmdldENlbGwoeSAqIHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYICsgeClcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZvbnRTY3JpcHQoeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBGb250R3JpZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBmb250Q2VsbCA9IHRoaXMuZ2V0Rm9udENlbGwoeCwgeSk7XHJcbiAgICAgICAgaWYoZm9udENlbGwgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGZvbnRDZWxsLmdldENvbXBvbmVudChGb250R3JpZCkgYXMgRm9udEdyaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy/kv6Hmga/mm7TmlrBcclxuICAgIHB1YmxpYyByZWZyZXNoKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuc2V0U3Rhcih0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnN0YXJfbnVtKTtcclxuICAgICAgICB0aGlzLnR4dF9wbGF5ZXJOYW1lLnRleHQgPSB0aGlzLl9teVBsYXllckluZm8ubmFtZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU5leHREcm9waW5nRm9udCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBvcHVsYXJHcm91cCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTnVRaSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNjb3JlKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMudHh0X3Njb3JlLnRleHQgPSB0aGlzLl9zY29yZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9wdWxhckdyb3VwKCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX3BvcHVsYXJHcm91cCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJhbmsgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wiYmFua1wiXTtcclxuICAgICAgICAgICAgdGhpcy5fcG9wdWxhckdyb3VwID0gYmFua1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBiYW5rLmxlbmd0aCldO1xyXG4gICAgICAgICAgICB0aGlzLmhlQ2lTcGxpdFRpbWVzID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fcG9wdWxhckdyb3VwICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnR4dF9wb3B1bGFyR3JvdXAudGV4dCA9IHRoaXMuX3BvcHVsYXJHcm91cDtcclxuICAgICAgICAgICAgdGhpcy5pbWdfcG9wdWxhckdyb3VwQmcuaGVpZ2h0ID0gdGhpcy50eHRfcG9wdWxhckdyb3VwLmRpc3BsYXlIZWlnaHQgKyAxNjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVOZXh0RHJvcGluZ0ZvbnQoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy50eHRfbmV4dEZvbnQudGV4dCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnR4dF9uZXh0Rm9udC50ZXh0ID0gdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERpc3BlbFRleHQodGV4dCA6IHN0cmluZykgOiB2b2lke1xyXG4gICAgICAgIExheWEuVHdlZW4uY2xlYXJBbGwodGhpcy5tY19kaXNwZWxUZXh0KTtcclxuICAgICAgICB0aGlzLm1jX2Rpc3BlbFRleHQuc2NhbGVYID0gdGhpcy5tY19kaXNwZWxUZXh0LnNjYWxlWSA9IDAuNDtcclxuICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHN3aXRjaCh0ZXh0Lmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuZm9udFNpemUgPSAxMjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LnNpemUoMTIwLDEyMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5mb250U2l6ZSA9IDYwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5zaXplKDEyMCw2MCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5mb250U2l6ZSA9IDQwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5zaXplKDEyMCw0MCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5mb250U2l6ZSA9IDMwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5zaXplKDEyMCwzMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgTGF5YS5Ud2Vlbi50byh0aGlzLm1jX2Rpc3BlbFRleHQse3NjYWxlWCA6IDEsc2NhbGVZIDogMX0sMzAwKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0U3RhcihzdGFyIDogbnVtYmVyKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICB3aGlsZShzdGFyID4gMCB8fCBsaXN0Lmxlbmd0aCA8IDUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoc3RhciA+IDApXHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godHJ1ZSlcclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChmYWxzZSlcclxuICAgICAgICAgICAgc3RhciAtLTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0X3N0YXIuZGF0YVNvdXJjZSA9IGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVOdVFpKCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX251UWkgPj0gMTMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL1xi6Kem5Y+R5oCS5rCU77yM6ZqP5py65raI6Zmk5LiA6KGM5LiA5YiXXHJcbiAgICAgICAgICAgIGxldCBmb250c0FyciA9IHRoaXMuZ2V0QWxsRm9udHMoKTtcclxuICAgICAgICAgICAgaWYoZm9udHNBcnIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjb3JlID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IG51UWlGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudChmb250c0FycikgYXMgTWFwRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkgKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bbnVRaUZvbnRJbmZvLnldICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZSArPSAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2gobmV3IExheWEuUG9pbnQoaSwgbnVRaUZvbnRJbmZvLnkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WTsgaSArKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihpICE9IG51UWlGb250SW5mby54KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2gobmV3IExheWEuUG9pbnQobnVRaUZvbnRJbmZvLngsIGkpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbbnVRaUZvbnRJbmZvLnhdW2ldICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlICs9IDEwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2NvcmUgKz0gc2NvcmU7XHJcbiAgICAgICAgICAgICAgICBTb3VuZFRvb2wucGxheVRlSmlFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheU51UWlFZmZlY3QoYXJyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX251UWkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9udVFpXHJcbiAgICAgICAgd2hpbGUoaSA+IDAgfHwgbGlzdC5sZW5ndGggPCAxMylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihpID4gMClcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0cnVlKVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKGZhbHNlKVxyXG4gICAgICAgICAgICBpIC0tO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsaXN0ID0gbGlzdC5yZXZlcnNlKCk7XHJcbiAgICAgICAgdGhpcy5saXN0X251UWkuZGF0YVNvdXJjZSA9IGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwbGF5TnVRaUVmZmVjdChwb2ludHMgOiBMYXlhLlBvaW50W10pIDogdm9pZHtcclxuICAgICAgICB0aGlzLnBsYXlFZmZlY3RJbmMoKTtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHRlbXBGb250R3JpZCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgaWYodGVtcEZvbnRHcmlkICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRlbXBGb250R3JpZC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmgJLmsJTmtojpmaQ6IChcIitlbGVtZW50LngrXCIsXCIrZWxlbWVudC55K1wiKVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIExheWEudGltZXIub25jZSg1MDAsdGhpcyxmdW5jdGlvbiAoKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mby5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIxLnB1c2goe2ZvbnRJbmZvIDogdGVtcEZvbnRJbmZvLGlkIDogdGVtcEZvbnRJbmZvLmlkfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNjUwLHRoaXMsZnVuY3Rpb24gKCkgOiB2b2lke1xyXG4gICAgICAgICAgICB0aGlzLmVuZEVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3Rhcih0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnN0YXJfbnVtKTtcclxuICAgICAgICAgICAgdGhpcy5fbnVRaSArKztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL+eUn+aIkOWtl1xyXG4gICAgcHJpdmF0ZSBoZUNpU3BsaXRUaW1lcyA6IG51bWJlciA9IDE7IC8v5ZCI5oiQ5b2T5YmN5bem6L656K+N57uE5aSx6LSl5qyh5pWwXHJcbiAgICBwcml2YXRlIGhlQ2l6dVJhdGUgOiBudW1iZXIgPSA0MDsgLy/lh7rnjrDlt6bovrnpgqPkuKror43nu4TnmoTmpoLnjodcclxuICAgIHByaXZhdGUgaGFuWmlSYXRlIDogbnVtYmVyID0gNjAgOyAvLyDlh7rnjrDog73ot5/kupTliJfmnIDlpJbovrnmsYnlrZflkIjmiJDmsYnlrZfnmoTmpoLnjodcclxuICAgIHByaXZhdGUgY2ladVJhdGUgOiBudW1iZXIgPSA2MDsgLy8g5Ye6546w6IO96Lef5LqU5YiX5pyA5aSW6L655rGJ5a2X5ZCI5oiQ6K+N57uE55qE5qaC546HXHJcbiAgICBwcml2YXRlIGJ1U2hvdVJhdGUgOiBudW1iZXIgPSAwOyAvL+WHuueOsOeJueauiumDqOmmlueahOamgueOh1xyXG4gICAgcmFuZG9tTmV4dEZvbnQoKTp2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9kZWJ1Z01vZGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdHh0ID0gdGhpcy5fZGVidWdEcm9wRm9udHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHR4dH0pO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLnRleHQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKE1hdGgucmFuZG9tKCkgKiAxMDAgPiB0aGlzLmJ1U2hvdVJhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmJ1U2hvdVJhdGUgPSBNYXRoLm1pbih0aGlzLmJ1U2hvdVJhdGUgKyAxLDUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5idVNob3VSYXRlID0gMDtcclxuICAgICAgICAgICAgbGV0IHR4dCA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudChNYXBGb250SW5mby5EYXRhU291cmNlW1wic3R1bnRfZm9udFwiXSkgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogdHh0fSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8udGV4dCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9ndWlkZURyb3BGb250cy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHR4dCA9IHRoaXMuX2d1aWRlRHJvcEZvbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiB0eHR9KTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mby50ZXh0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9zcGxpdEZvbnRXb3Jkcy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudCh0aGlzLl9zcGxpdEZvbnRXb3Jkcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzLnNwbGljZSh0aGlzLl9zcGxpdEZvbnRXb3Jkcy5pbmRleE9mKHRoaXMuX25leHREcm9waW5nRm9udEluZm8pLCAxKTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc3BsaXRHcm91cFdvcmRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KHRoaXMuX3NwbGl0R3JvdXBXb3Jkcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5zcGxpY2UodGhpcy5fc3BsaXRHcm91cFdvcmRzLmluZGV4T2YodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyksIDEpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL+agueaNruW9k+WJjeagvOWtkOaVsOS7peWPiuW9k+WJjeaYn+e6pyDojrflvpfkuIDkuKrlm7Dpmr7ns7vmlbAg5q+U5aaC5pivNTBcclxuICAgICAgICBsZXQga3VuTmFuIDogbnVtYmVyID0gdGhpcy5nZXROYW5EdVhpU2h1KCkgKiB0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnNwbGl0X3JhdGU7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IE1hdGgubWluKDEwMCxNYXRoLmZsb29yKHRoaXMuaGVDaXp1UmF0ZSprdW5OYW4vMTAwMDApKTtcclxuICAgICAgICBpZiAodGhpcy5nZXRSYW5kb21SZXN1bHQocmVzdWx0KSkgeyAvL+maj+acuuWIsOWHuuW3pui+ueivjee7hOebuOWFs+iBlOaxieWtl1xyXG4gICAgICAgICAgICB0aGlzLmhhblppUmF0ZSArPSAxMDsgLy8g5o6l5LiL5p2l5Ye6546w5peg5YWz6IGU5rGJ5a2X5qaC546H5YqgMTBcclxuICAgICAgICAgICAgdGhpcy5jaVp1UmF0ZSArPSAxMCAvLyDmjqXkuIvmnaXlh7rnjrDml6DlhbPogZTmsYnlrZflubbkuI415YiX6IO95ZCI5oiQ6K+N55qE5qaC546H5YqgMTBcclxuICAgICAgICAgICAgdGhpcy5oZUNpenVSYXRlID0gMTA7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3dvcmRzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlQ2lTcGxpdFRpbWVzICsrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd29yZHMgPSB0aGlzLnNwbGl0R3JvdXBUb0ZvbnRJbmZvcyh0aGlzLl9wb3B1bGFyR3JvdXAsbnVsbCwgdGhpcy5oZUNpU3BsaXRUaW1lcyA+IDIgPyBcInNwZWNpYWxcIjogXCJjb21tZW5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudCh0aGlzLl93b3Jkcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmRzLnNwbGljZSh0aGlzLl93b3Jkcy5pbmRleE9mKHRoaXMuX25leHREcm9waW5nRm9udEluZm8pLDEpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgdGhpcy5oZUNpenVSYXRlICs9IDE1O1xyXG4gICAgICAgIGxldCB0b3BGb250SW5mb3MgPSB0aGlzLmdldFRvcEZvbnRJbmZvcygpO1xyXG4gICAgICAgIGlmKHRvcEZvbnRJbmZvcy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRvcEZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KHRvcEZvbnRJbmZvcykgYXMgTWFwRm9udEluZm87XHJcbiAgICAgICAgICAgIGlmKHRvcEZvbnRJbmZvLmNhbkhlQ2hlbmdGb250ICYmIHRoaXMuZ2V0UmFuZG9tUmVzdWx0ICh0aGlzLmhhblppUmF0ZSprdW5OYW4vMTAwMDApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy/pmo/mnLrliLDopoHov5vooYzlj6/msYnlrZfmi4bliIZcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuWmlSYXRlID0gMjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNpWnVSYXRlICs9IDEwXHJcbiAgICAgICAgICAgICAgICBsZXQgZm9udEluZm9zID0gdG9wRm9udEluZm8uY2FuSGVDaGVuZ0ZvbnRJbmZvcztcclxuICAgICAgICAgICAgICAgIGxldCBzcGxpdEZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KGZvbnRJbmZvcykgYXMgTWFwRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3JkcyA9IHRoaXMuc3BsaXRGb250VG9Gb250SW5mb3Moc3BsaXRGb250SW5mbyx0b3BGb250SW5mby5pZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KHRoaXMuX3NwbGl0Rm9udFdvcmRzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzLnNwbGljZSh0aGlzLl9zcGxpdEZvbnRXb3Jkcy5pbmRleE9mKHRoaXMuX25leHREcm9waW5nRm9udEluZm8pLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodG9wRm9udEluZm8uY2FuSGVDaGVuZ0dyb3VwICYmIHRoaXMuZ2V0UmFuZG9tUmVzdWx0ICh0aGlzLmNpWnVSYXRlKmt1bk5hbi8xMDAwMCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v6ZqP5py65Yiw6KaB6L+b6KGM5ouG5YiG6K+N57uEXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhblppUmF0ZSArPSAxNTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2ladVJhdGUgPSAxMFxyXG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwcyA9IHRvcEZvbnRJbmZvLmNhbkhlQ2hlbmdHcm91cHM7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXRHcm91cCA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudChncm91cHMpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3JkcyA9IHRoaXMuc3BsaXRHcm91cFRvRm9udEluZm9zKHNwbGl0R3JvdXAsdG9wRm9udEluZm8udGV4dCxcInNwXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudCh0aGlzLl9zcGxpdEdyb3VwV29yZHMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzLnNwbGljZSh0aGlzLl9zcGxpdEdyb3VwV29yZHMuaW5kZXhPZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvKSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2ladVJhdGUgKz0xMDtcclxuICAgICAgICB0aGlzLmhhblppUmF0ZSArPSAxNTtcclxuICAgICAgICAvL+maj+acuuS7juaxieWtl+W6k+aKveS4gOS4quaxieWtl1xyXG4gICAgICAgIGxldCBmb250RGF0YUFyciA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudChNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udFwiXSk7XHJcbiAgICAgICAgbGV0IG1hcEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKCk7XHJcbiAgICAgICAgbWFwRm9udEluZm8uc2V0RGF0YUJ5VmFsdWVBcnIoZm9udERhdGFBcnIpO1xyXG4gICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBtYXBGb250SW5mbztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFRvcEZvbnRJbmZvcygpIDogTWFwRm9udEluZm9bXVxyXG4gICAge1xyXG4gICAgICAgIGxldCBjb3V0ID0gW107XHJcbiAgICAgICAgbGV0IGZvbnQgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7ICBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXI9IDAgOyBqICA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW2pdICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udCA9IHRoaXMuX2ZvbnRzW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGZvbnQgIT1udWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb3V0LnB1c2goZm9udCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gc3RyIOmcgOimgeaLhuWIhueahOWtl+espuS4slxyXG4gICAgICogQHBhcmFtIHNwbGl0VHlwZSDmi4bliIbmlrnlvI8gY29tbWVu6ZqP5py65ouG5YiGIHNwY2lhbOS4jeaLhuWIhlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNwbGl0R3JvdXBUb0ZvbnRJbmZvcyhzdHIgOiBzdHJpbmcscmVtb3ZlRm9udFRleHQgOiBzdHJpbmcgPSBudWxsLHNwbGl0VHlwZSA6IHN0cmluZyA9IFwiY29tbWVuXCIpOk1hcEZvbnRJbmZvW117XHJcbiAgICAgICAgbGV0IGNvdXQgPSBbXVxyXG4gICAgICAgIHN0ci5zcGxpdCgnJykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudCA9PSByZW1vdmVGb250VGV4dClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBmb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IGVsZW1lbnR9KTtcclxuICAgICAgICAgICAgaWYoZm9udEluZm8uaWQgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYWNrIGZvbnQ6XCIgKyBlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihzcGxpdFR5cGUgPT0gXCJjb21tZW5cIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY291dCA9IGNvdXQuY29uY2F0KHRoaXMuc3BsaXRGb250VG9Gb250SW5mb3MoZm9udEluZm8sbnVsbCxzcGxpdFR5cGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb3V0LnB1c2goZm9udEluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNwbGl0Rm9udFRvRm9udEluZm9zKGZvbnRUeHQgOiBzdHJpbmcgfCBNYXBGb250SW5mbyxyZW1vdmVGb250SWQgOiBudW1iZXIgPSBudWxsLCBzcGxpdFR5cGUgOiBzdHJpbmcgPSBcImNvbW1lblwiKSA6IE1hcEZvbnRJbmZvW11cclxuICAgIHtcclxuICAgICAgICBsZXQgZm9udEluZm8gOiBNYXBGb250SW5mbztcclxuICAgICAgICBpZihmb250VHh0IGluc3RhbmNlb2YgTWFwRm9udEluZm8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb250SW5mbyA9IGZvbnRUeHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IGZvbnRUeHR9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc3BsaXRUeXBlICE9IFwiY29tbWVuXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gW2ZvbnRJbmZvXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvdXQgPSBbXTtcclxuICAgICAgICBsZXQgc3RydWN0SW5mb3MgPSBmb250SW5mby5zdHJ1Y3RJbmZvLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICBsZXQgc3RydWN0SW5mbyA9IHN0cnVjdEluZm9zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN0cnVjdEluZm9zLmxlbmd0aCldO1xyXG4gICAgICAgIGlmKHN0cnVjdEluZm8gPT0gZm9udEluZm8uaWQudG9TdHJpbmcoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQucHVzaChmb250SW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJ1Y3RJbmZvLnNwbGl0KFwiX1wiKS5mb3JFYWNoKGVsZW1lbnQyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQyID09IFwiXCIgfHwgKHJlbW92ZUZvbnRJZCAhPSBudWxsICYmIGVsZW1lbnQyID09IHJlbW92ZUZvbnRJZC50b1N0cmluZygpKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXRGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7aWQgOiBlbGVtZW50Mn0pO1xyXG4gICAgICAgICAgICAgICAgaWYoc3BsaXRGb250SW5mby5pZCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFjayBmb250IGlkOlwiKyBlbGVtZW50Mik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY291dC5wdXNoKHNwbGl0Rm9udEluZm8pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFJhbmRvbVJlc3VsdCh2YWw6bnVtYmVyKTpib29sZWFue1xyXG4gICAgICAgIGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTAwKTwgdmFsKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlumavuW6puezu+aVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldE5hbkR1WGlTaHUoKSA6IG51bWJlcntcclxuICAgICAgICBsZXQgZm9udEdyaWROdW0gOiBudW1iZXIgPTA7XHJcbiAgICAgICAgZm9yKGxldCBpID0wOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WTsgaiArKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bal0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb250R3JpZE51bSArPSB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSAtIGo7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJkZWdyZWVfZGlmZmljdWx0eVwiXVtmb250R3JpZE51bV07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSYW5kb21FbGVtZW50KGFycikgOiBhbnl7XHJcbiAgICAgICAgaWYoYXJyLmxlbmd0aCA9PSAwKXJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3BsYXllckVmZmVjdEluZCA6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHBsYXlFZmZlY3RJbmMoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fcGxheWVyRWZmZWN0SW5kICsrO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuRWZmZWN0UGF1c2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW5kRWZmZWN0SW5jKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX3BsYXllckVmZmVjdEluZCAtLTtcclxuICAgICAgICBpZih0aGlzLl9wbGF5ZXJFZmZlY3RJbmQgPDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXJFZmZlY3RJbmQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9wbGF5ZXJFZmZlY3RJbmQgPT0gMCAmJiB0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLkVmZmVjdFBhdXNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5QbGF5aW5nKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja1N5c0Ryb3BGb250cygpO1xyXG4gICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrID0gW107XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW52b2tlU3R1bnRGb250KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFNlYXJjaEluZm8ge1xyXG4gICAgcHVibGljIGN1cnJlbnRQb2ludCAgPSBuZXcgTGF5YS5Qb2ludCgpO1xyXG4gICAgcHVibGljIGNoYXJzIDogc3RyaW5nW107XHJcbiAgICBwcml2YXRlIF9vcGVuTGlzdCA6IExheWEuUG9pbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3Blbk9iaiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBfc3VyZUxpc3QgOiBMYXlhLlBvaW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgX3N1cmVPYmogPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgc2V0T3Blbkxpc3QocG9pbnRzIDogTGF5YS5Qb2ludFtdKSA6IHZvaWR7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudD0+e1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4oZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRPcGVuTGlzdCgpIDogTGF5YS5Qb2ludFtdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wZW5MaXN0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFN1cmVMaXN0KHBvaW50cyA6IExheWEuUG9pbnRbXSkgOiB2b2lke1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQ9PntcclxuICAgICAgICAgICAgdGhpcy5zdXJlKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0U3VyZUxpc3QoKSA6IExheWEuUG9pbnRbXXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3VyZUxpc3Q7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb3Blbih4IDogbnVtYmVyICx5IDogbnVtYmVyLCBpc09wZW4gOiBib29sZWFuID0gdHJ1ZSkgOiB2b2lke1xyXG4gICAgICAgIGxldCBrZXkgPSB4LnRvU3RyaW5nKCkgKyBcIl9cIiArIHkudG9TdHJpbmcoKTtcclxuICAgICAgICBpZihpc09wZW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBuZXcgTGF5YS5Qb2ludCh4LHkpO1xyXG4gICAgICAgICAgICB0aGlzLl9vcGVuTGlzdC5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgdGhpcy5fb3Blbk9ialtrZXldID0gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9vcGVuT2JqW2tleV0gIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3Blbkxpc3Quc3BsaWNlKHRoaXMuX29wZW5MaXN0LmluZGV4T2YodGhpcy5fb3Blbk9ialtrZXldKSwxKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcGVuT2JqW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzT3Blbih4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICBsZXQga2V5ID0geC50b1N0cmluZygpICsgXCJfXCIgKyB5LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wZW5PYmpba2V5XSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdXJlKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogdm9pZHtcclxuICAgICAgICBsZXQga2V5ID0geC50b1N0cmluZygpICsgXCJfXCIgKyB5LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gbmV3IExheWEuUG9pbnQoeCx5KTtcclxuICAgICAgICB0aGlzLl9zdXJlTGlzdC5wdXNoKHBvaW50KTtcclxuICAgICAgICB0aGlzLl9zdXJlT2JqW2tleV0gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNTdXJlKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogYm9vbGVhbntcclxuICAgICAgICBsZXQga2V5ID0geC50b1N0cmluZygpICsgXCJfXCIgKyB5LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmVPYmpba2V5XSAhPSBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4uLy4uL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IFdYVG9vbCBmcm9tIFwiLi4vdG9vbC9XWFRvb2xcIjtcclxuaW1wb3J0IFNjZW5lTWdyIGZyb20gXCIuL1NjZW5lTWdyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZUJhc2UgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwcm90ZWN0ZWQgX3BvcFVwU3ByIDogTGF5YS5TcHJpdGU7XHJcbiAgICBwcml2YXRlIF9hbHBoYVNwciA6IExheWEuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBfcG9wVXBTaWduIDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfcG9wVXBDb250ZW50IDogTGF5YS5TcHJpdGU7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kaWFsb2dTcHIgOiBMYXlhLlNwcml0ZTtcclxuICAgIHByaXZhdGUgX2FscGhhRGlhbG9nU3ByIDogTGF5YS5TcHJpdGU7XHJcbiAgICBwcml2YXRlIF9kaWFsb2dDb250ZW50IDogTGF5YS5TcHJpdGU7XHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBTY2VuZU1nci5jdXJTY2VuZVNjcmlwdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVXeE9wZW5EYXRhVmlld2VyKCk7XHJcbiAgICAgICAgbGV0IGFyciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMub3duZXIpO1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICBhcnIuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5pbmRleE9mKFwiX1wiKSA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB0ZW1wUHJvcGVydHlTdHIgPSBlbGVtZW50LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wUHJvcGVydHlMaXN0ID0gdGVtcFByb3BlcnR5U3RyLnNwbGl0KFwiX1wiKTtcclxuICAgICAgICAgICAgc3dpdGNoKHRlbXBQcm9wZXJ0eUxpc3RbMF0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJsaXN0XCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHh0XCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaW1nXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYnRuXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibWNcIjpcclxuICAgICAgICAgICAgICAgICAgICBzZWxmW3RlbXBQcm9wZXJ0eVN0cl0gPSBzZWxmLm93bmVyW3RlbXBQcm9wZXJ0eVN0cl07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBhZGRQb3BVcChzaWduIDogc3RyaW5nLCBjb250ZW50IDogTGF5YS5TcHJpdGUgfCBMYXlhLkJveCwgaXNDZW50ZXIgOiBib29sZWFuID0gdHJ1ZSwgaXNTaG93QWxwaGFTcHIgOiBib29sZWFuID0gdHJ1ZSwgaXNFbmFibGVBbHBoYUNsb3NlIDogYm9vbGVhbiA9IGZhbHNlKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9wb3BVcFNpZ24gPSBzaWduO1xyXG4gICAgICAgIHRoaXMuX3BvcFVwQ29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgaWYodGhpcy5fcG9wVXBTcHIgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvcFVwU3ByID0gbmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fcG9wVXBTcHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9wVXBTcHIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzQ2VudGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoY29udGVudCBpbnN0YW5jZW9mIExheWEuU3ByaXRlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnggPSAoR2FtZUNvbmZpZy53aWR0aCAtIGNvbnRlbnQud2lkdGgpIC8gMjtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQueSA9IChHYW1lQ29uZmlnLmhlaWdodCAtIGNvbnRlbnQuaGVpZ2h0KSAvIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29udGVudC5jZW50ZXJYID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQuY2VudGVyWSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNTaG93QWxwaGFTcHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hbHBoYVNwciA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYVNwciA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIud2lkdGggPSBHYW1lQ29uZmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIuaGVpZ2h0ID0gR2FtZUNvbmZpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYVNwci5ncmFwaGljcy5kcmF3UmVjdCgwLDAsR2FtZUNvbmZpZy53aWR0aCxHYW1lQ29uZmlnLmhlaWdodCxcIiMwMDAwMDBcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYVNwci5hbHBoYSA9IDAuNDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BvcFVwU3ByLmFkZENoaWxkKHRoaXMuX2FscGhhU3ByKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoaXNFbmFibGVBbHBoYUNsb3NlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYVNwci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsIHRoaXMuaGlkZVBvcFVwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FscGhhU3ByKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wb3BVcFNwci5hZGRDaGlsZCh0aGlzLl9wb3BVcENvbnRlbnQpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlUG9wVXAoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLl9wb3BVcFNwcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvcFVwU3ByLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fcG9wVXBDb250ZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fcG9wVXBDb250ZW50ID09IHRoaXMuX2RhdGFWaWV3ZXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BvcFVwQ29udGVudC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wVXBDb250ZW50LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wb3BVcFNpZ24gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhZGREaWFsb2coY29udGVudCA6IExheWEuU3ByaXRlLCBpc0NlbnRlciA6IGJvb2xlYW4gPSB0cnVlLCBpc1Nob3dBbHBoYVNwciA6IGJvb2xlYW4gPSB0cnVlLCBpc0VuYWJsZUFscGhhQ2xvc2UgOiBib29sZWFuID0gZmFsc2UpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2RpYWxvZ0NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgIGlmKHRoaXMuX2RpYWxvZ1NwciA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlhbG9nU3ByID0gbmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fZGlhbG9nU3ByKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpYWxvZ1Nwci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNDZW50ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb250ZW50LnggPSAoR2FtZUNvbmZpZy53aWR0aCAtIGNvbnRlbnQud2lkdGgpIC8gMjtcclxuICAgICAgICAgICAgY29udGVudC55ID0gKEdhbWVDb25maWcuaGVpZ2h0IC0gY29udGVudC5oZWlnaHQpIC8gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNTaG93QWxwaGFTcHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9hbHBoYURpYWxvZ1NwciA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1NwciA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIud2lkdGggPSBHYW1lQ29uZmlnLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIuaGVpZ2h0ID0gR2FtZUNvbmZpZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci5ncmFwaGljcy5kcmF3UmVjdCgwLDAsR2FtZUNvbmZpZy53aWR0aCxHYW1lQ29uZmlnLmhlaWdodCxcIiMwMDAwMDBcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci5hbHBoYSA9IDAuNDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLm1vdXNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci5tb3VzZVRocm91Z2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RpYWxvZ1Nwci5hZGRDaGlsZCh0aGlzLl9hbHBoYURpYWxvZ1Nwcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGlzRW5hYmxlQWxwaGFDbG9zZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLCB0aGlzLmhpZGVEaWFsb2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fYWxwaGFEaWFsb2dTcHIpe1xyXG4gICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2RpYWxvZ1Nwci5hZGRDaGlsZCh0aGlzLl9kaWFsb2dDb250ZW50KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZURpYWxvZygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuX2RpYWxvZ1NwcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpYWxvZ1Nwci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2RpYWxvZ0NvbnRlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9kaWFsb2dDb250ZW50ID09IHRoaXMuX2RhdGFWaWV3ZXIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RpYWxvZ0NvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgV1hUb29sLnNob3dBbGxCdG4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWFsb2dDb250ZW50LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RhdGFWaWV3ZXIgOiBMYXlhLldYT3BlbkRhdGFWaWV3ZXI7XHJcbiAgICBwcml2YXRlIGNyZWF0ZVd4T3BlbkRhdGFWaWV3ZXIoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fZGF0YVZpZXdlciA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXdlciA9IG5ldyBMYXlhLldYT3BlbkRhdGFWaWV3ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXdlci53aWR0aCA9IDYxMDtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXdlci5oZWlnaHQgPSA3NTc7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzaG93UmFuaygpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9kYXRhVmlld2VyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIucG9zdE1zZyh7Y21kIDogXCJyZWZyZXNoUmFua0xpc3RcIn0pO1xyXG4gICAgICAgIHRoaXMuYWRkRGlhbG9nKHRoaXMuX2RhdGFWaWV3ZXIsdHJ1ZSx0cnVlLHRydWUpO1xyXG4gICAgICAgIFdYVG9vbC5oaWRlQWxsQnRuKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgU2NlbmVCYXNlIGZyb20gXCIuL1NjZW5lQmFzZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVNZ3IgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGN1clNjZW5lU2NyaXB0IDogU2NlbmVCYXNlO1xyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF0aXZlQnJpZGdlNDM5OSBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2hvd0Jhbm5lckFkKGJvIDogYm9vbGVhbikgOiB2b2lke1xyXG4gICAgICAgIHZhciBvcyA9IExheWEuQnJvd3Nlci53aW5kb3cuY29uY2hDb25maWcuZ2V0T1MoKTtcclxuICAgICAgICB2YXIgYnJpZGdlO1xyXG4gICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICBpZiAob3MgPT0gXCJDb25jaC1pb3NcIikge1xyXG4gICAgICAgICAgICBicmlkZ2UgPSBMYXlhLkJyb3dzZXIud2luZG93LlBsYXRmb3JtQ2xhc3MuY3JlYXRlQ2xhc3MoXCJKU0JyaWRnZVwiKTsvL+WIm+W7uuiEmuatpeS7o+eQhlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvcyA9PSBcIkNvbmNoLWFuZHJvaWRcIikge1xyXG4gICAgICAgICAgICAvL+mcgOimgeWujOaVtOeahOexu+i3r+W+hO+8jOazqOaEj+S4jmlPU+eahOS4jeWQjFxyXG4gICAgICAgICAgICBicmlkZ2UgPSBMYXlhLkJyb3dzZXIud2luZG93LlBsYXRmb3JtQ2xhc3MuY3JlYXRlQ2xhc3MoXCJkZW1vLkpTQnJpZGdlXCIpOy8v5Yib5bu66ISa5q2l5Luj55CGXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAob3MgPT0gXCJDb25jaC1pb3NcIikge1xyXG4gICAgICAgICAgICAvL2lPU+azqOaEj+WHveaVsOetvuWQje+8jOazqOaEj+S4jkFuZHJvaWTnmoTkuI3lkIxcclxuICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJzZXRCYW5uZXJBZFZpc2libGU6XCIsYm8pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9zID09IFwiQ29uY2gtYW5kcm9pZFwiKSB7XHJcbiAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwic2V0QmFubmVyQWRWaXNpYmxlXCIsYm8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgVVJJIGZyb20gXCIuLi8uLi9VUklcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdW5kVG9vbHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUJnTXVzaWMoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheU11c2ljKFVSSS5zb3VuZFVybCArIFwiYmdfbXVzaWMud2F2XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheVhpYW9DaHVFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFVSSS5zb3VuZFVybCArIFwieGlhb2NodS53YXZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5SGVDaGVuZ0VmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoVVJJLnNvdW5kVXJsICsgXCJoZWNoZW5nLndhdlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlUZUppRWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChVUkkuc291bmRVcmwgKyBcInRlamkud2F2XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheVhpYUh1YUVmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoVVJJLnNvdW5kVXJsICsgXCJ4aWFodWEud2F2XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheVlpRG9uZ0VmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoVVJJLnNvdW5kVXJsICsgXCJ5aWRvbmcud2F2XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9zb3VuZFZvbHVtZSA6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U291bmRWb2x1bWUoKSA6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gU291bmRUb29sLl9zb3VuZFZvbHVtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0U291bmRWb2x1bWUodmFsdWUgOiBudW1iZXIgPSAwLjIpIDogdm9pZHtcclxuICAgICAgICBpZihOdW1iZXJbXCJpc05hTlwiXSh2YWx1ZSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IDAuMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgU291bmRUb29sLl9zb3VuZFZvbHVtZSA9IHZhbHVlO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnNldFNvdW5kVm9sdW1lKHZhbHVlKTtcclxuICAgICAgICBMYXlhLkxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic291bmRWb2x1bWVcIiwodmFsdWUgKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9tdXNpY1ZvbHVtZSA6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TXVzaWNWb2x1bWUoKSA6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gU291bmRUb29sLl9tdXNpY1ZvbHVtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0TXVzaWNWb2x1bWUodmFsdWUgOiBudW1iZXIgPSAwLjIpIDogdm9pZHtcclxuICAgICAgICBpZihOdW1iZXJbXCJpc05hTlwiXSh2YWx1ZSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IDAuMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgU291bmRUb29sLl9tdXNpY1ZvbHVtZSA9IHZhbHVlO1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnNldE11c2ljVm9sdW1lKHZhbHVlKTtcclxuICAgICAgICBMYXlhLkxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibXVzaWNWb2x1bWVcIiwodmFsdWUgKiAxMDApLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIFNvdW5kVG9vbC5zZXRTb3VuZFZvbHVtZShwYXJzZUludChMYXlhLkxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic291bmRWb2x1bWVcIikpLzEwMCk7XHJcbiAgICAgICAgU291bmRUb29sLnNldE11c2ljVm9sdW1lKHBhcnNlSW50KExheWEuTG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtdXNpY1ZvbHVtZVwiKSkvMTAwKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdYVG9vbCBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9idG5zIDogYW55W10gPSBbXTtcclxuICAgIHB1YmxpYyBzdGF0aWMgYWRkQnRuKGJ0biA6IGFueSkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2J0bnMucHVzaChidG4pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlQnRuKGJ0biA6IGFueSkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2J0bnMuc2xpY2UodGhpcy5fYnRucy5pbmRleE9mKGJ0biksMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBoaWRlQWxsQnRuICgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9idG5zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hvd0FsbEJ0biAoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fYnRucy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cbmltcG9ydCBWaWV3PUxheWEuVmlldztcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbnZhciBSRUc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xuZXhwb3J0IG1vZHVsZSB1aS50ZXN0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUZXN0U2NlbmVVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBzY29yZUxibDpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyB0aXBMYmxsOkxheWEuTGFiZWw7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJ0ZXN0L1Rlc3RTY2VuZVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBSRUcoXCJ1aS50ZXN0LlRlc3RTY2VuZVVJXCIsVGVzdFNjZW5lVUkpO1xyXG59XHIiXX0=
