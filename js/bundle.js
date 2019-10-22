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
        if (AppConfig_1.default.platform == "wx") {
            // Laya.URL.basePath = "https://raw.githubusercontent.com/wupei1987/font-game-wx-asset/master/";
            wx.setEnableDebug({
                enableDebug: true,
                success: function (result) { return void {}; },
                fail: function () { return void {}; },
                complete: function () { return void {}; },
            });
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0xheWEvTGF5YUFpcklERV8yLjEuMGJldGExLmFwcC9Db250ZW50cy9SZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQXBwQ29uZmlnLnRzIiwic3JjL0NvZGVFeHBhbmQudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9NYWluLnRzIiwic3JjL1Jlc01nci50cyIsInNyYy9VUkkudHMiLCJzcmMvc2NyaXB0L0J1bGxldC50cyIsInNyYy9zY3JpcHQvRHJvcEJveC50cyIsInNyYy9zY3JpcHQvR2FtZUNvbnRyb2wudHMiLCJzcmMvc2NyaXB0L0dhbWVVSS50cyIsInNyYy9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyQmFzZS50cyIsInNyYy9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyTWdyLnRzIiwic3JjL3NjcmlwdC9jb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIudHMiLCJzcmMvc2NyaXB0L2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlci50cyIsInNyYy9zY3JpcHQvbW9kZWwvTWFwRm9udEluZm8udHMiLCJzcmMvc2NyaXB0L21vZGVsL01hcFN0YXJJbmZvLnRzIiwic3JjL3NjcmlwdC9tb2RlbC9Nb2RlbEJhc2UudHMiLCJzcmMvc2NyaXB0L21vZGVsL1BsYXllckluZm8udHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9Gb250R3JpZC50cyIsInNyYy9zY3JpcHQvcHJlZmViL0dhbWVSZXN1bHQudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9HYW1lU2V0dGluZy50cyIsInNyYy9zY3JpcHQvcHJlZmViL1ByZWZlYkJhc2UudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9TdGFydEdhbWUudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9UaXBJdGVtLnRzIiwic3JjL3NjcmlwdC9zY2VuZS9Mb2FkaW5nU2NlbmUudHMiLCJzcmMvc2NyaXB0L3NjZW5lL01haW5HYW1lU2NlbmUudHMiLCJzcmMvc2NyaXB0L3NjZW5lL1NjZW5lQmFzZS50cyIsInNyYy9zY3JpcHQvc2NlbmUvU2NlbmVNZ3IudHMiLCJzcmMvc2NyaXB0L3Rvb2wvTmF0aXZlQnJpZGdlNDM5OS50cyIsInNyYy9zY3JpcHQvdG9vbC9Tb3VuZFRvb2wudHMiLCJzcmMvc2NyaXB0L3Rvb2wvV1hUb29sLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSw2QkFBd0I7QUFFeEI7SUFBdUMsNkJBQVc7SUFBbEQ7O0lBb0VBLENBQUM7SUFsRWlCLDRCQUFrQixHQUFoQztRQUVJLElBQUcsU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQzdCO1lBQ0ksT0FBTztnQkFDSCxxQkFBcUI7Z0JBQ3JCLGVBQWU7Z0JBQ2YsOENBQThDO2dCQUM5QyxhQUFHLENBQUMsUUFBUSxHQUFHLDRCQUE0QjtnQkFDM0Msc0RBQXNEO2dCQUN0RCxhQUFHLENBQUMsUUFBUSxHQUFHLG9DQUFvQztnQkFDbkQsc0JBQXNCO2dCQUN0QixvQkFBb0I7Z0JBQ3BCLG1CQUFtQjtnQkFDbkIsZ0JBQWdCO2dCQUNoQixrQkFBa0I7Z0JBQ2xCLG1CQUFtQjtnQkFDbkIsa0JBQWtCO2FBQ3JCLENBQUE7U0FDSjthQUVEO1lBQ0ksT0FBTztnQkFDSCxlQUFlO2dCQUNmLGFBQUcsQ0FBQyxRQUFRLEdBQUcsMkJBQTJCO2dCQUMxQyxhQUFHLENBQUMsUUFBUSxHQUFHLG1DQUFtQztnQkFDbEQsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLGdCQUFnQjtnQkFDaEIsa0JBQWtCO2dCQUNsQixtQkFBbUI7Z0JBQ25CLGtCQUFrQjthQUNyQixDQUFBO1NBQ0o7SUFDTCxDQUFDO0lBRUQsV0FBVztJQUNHLHFCQUFXLEdBQXpCO1FBRUksSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FB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R0FBSixPQUFJLEtBQUosT0FBSSxRQVdwQjtBQUFELENBQUMsRUFYYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUFXZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgVVJJIGZyb20gXCIuL1VSSVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ29uZmlnIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5pdExvYWRpbmdVcmxzKCkgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgXCJyZXMvYXRsYXMvbWFwLmF0bGFzXCIsXHJcbiAgICAgICAgICAgICAgICBcInJlcy9kYXRhLmpzb25cIixcclxuICAgICAgICAgICAgICAgIC8vIFVSSS5zcGluZVVybCArIFwib3RoZXJfdGFvemh1YW5neGl0b25nMS5za1wiLFxyXG4gICAgICAgICAgICAgICAgVVJJLnNwaW5lVXJsICsgXCJvdGhlcl90YW96aHVhbmd4aXRvbmcxLnBuZ1wiLFxyXG4gICAgICAgICAgICAgICAgLy8gVVJJLnNwaW5lVXJsICsgXCJvdGhlcl93dXBpbmdodWFucmFvX2tpbl9saXR0bGUuc2tcIixcclxuICAgICAgICAgICAgICAgIFVSSS5zcGluZVVybCArIFwib3RoZXJfd3VwaW5naHVhbnJhb19raW5fbGl0dGxlLnBuZ1wiLFxyXG4gICAgICAgICAgICAgICAgXCJyZXMvYXRsYXMvdGVzdC5hdGxhc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC9iZ19tdXNpYy53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQvaGVjaGVuZy53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQvdGVqaS53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQveGlhaHVhLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC94aWFvY2h1LndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC95aWRvbmcud2F2XCJcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIFwicmVzL2RhdGEuanNvblwiLFxyXG4gICAgICAgICAgICAgICAgVVJJLnNwaW5lVXJsICsgXCJvdGhlcl90YW96aHVhbmd4aXRvbmcxLnNrXCIsXHJcbiAgICAgICAgICAgICAgICBVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3d1cGluZ2h1YW5yYW9fa2luX2xpdHRsZS5za1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC9iZ19tdXNpYy53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQvaGVjaGVuZy53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQvdGVqaS53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQveGlhaHVhLndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC94aWFvY2h1LndhdlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3VuZC95aWRvbmcud2F2XCJcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+aYr+WQpuW3sue7j+aWsOaJi+W8leWvvOi/h1xyXG4gICAgcHVibGljIHN0YXRpYyBoYWRHdWlkYW5jZSgpIDogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIGxldCBibyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZ3VpZGVcIik7XHJcbiAgICAgICAgaWYoYm8gPT0gXCJ0cnVlXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0R3VpZGFuY2UodmFsdWUgOiBib29sZWFuKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImd1aWRlXCIsXCJ0cnVlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJndWlkZVwiLFwiZmFsc2VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9vbHMgPSB7fTtcclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIHBsYXRmb3JtID0gXCJ0ZXN0XCI7IC8vbGF5Yea1i+ivlVxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF0Zm9ybSA9IFwid3hcIjsgLy/lvq7kv6HmtYvor5VcclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgcGxhdGZvcm0gPSBcImFuZHJvaWRcIjsgLy9hbmRyb2lkIG5hdGl2ZVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBwbGF0Zm9ybSA9IFwiYW5kcm9pZDQzOTlcIjsgLy9hbmRyb2lkIG5hdGl2ZTQzOTlcclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgcGxhdGZvcm0gPSBcImlvc1wiOyAvL2lvcyBuYXRpdmVcclxuICAgIHB1YmxpYyBzdGF0aWMgdmVyc2lvbiA9IFwiMS44XCI7XHJcbn0iLCIvKipcclxuKiDmupDku6PnoIHmi5PlsZVcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZUV4cGFuZHtcclxuXHRwdWJsaWMgc3RhdGljIGluaXQoKSA6IHZvaWR7XHJcblx0XHQvLyBMYXlhLlNwcml0ZeaLk+WxlVxyXG5cdFx0dmFyIHNwcml0ZVByb3RvOiBMYXlhLlNwcml0ZSA9IExheWEuU3ByaXRlLnByb3RvdHlwZTtcclxuXHRcdC8vIOa3u+WKoOeCueWHu+e8qeaUvueahOebkeWQrFxyXG5cdFx0c3ByaXRlUHJvdG9bXCJ6b29tT25cIl0gPSBmdW5jdGlvbihoYW5kbGVyOiBMYXlhLkhhbmRsZXIsIHNjYWxlOiBudW1iZXIgPSAxLjEpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRpZiAoIXNlbGZbXCJpbml0U1hcIl0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxmW1wiaW5pdFNYXCJdID0gc2VsZi5zY2FsZVg7XHJcblx0XHRcdFx0c2VsZltcImluaXRTWVwiXSA9IHNlbGYuc2NhbGVZO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzY2FsZSA+IDAgJiYgc2NhbGUgIT0gMSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBjZW50ZXJYID0gc2VsZi5nZXRDZW50ZXJYKCk7XHJcblx0XHRcdFx0dmFyIGNlbnRlclkgPSBzZWxmLmdldENlbnRlclkoKTtcclxuXHRcdFx0XHRzZWxmLnBpdm90WCA9IHNlbGYud2lkdGggLyAyO1xyXG5cdFx0XHRcdHNlbGYucGl2b3RZID0gc2VsZi5oZWlnaHQgLyAyO1xyXG5cdFx0XHRcdHNlbGYucG9zKGNlbnRlclgsIGNlbnRlclkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzZWxmLmhhc0xpc3RlbmVyKFwicHJlc3NcIikpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxmLm9mZihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sIHNlbGYsIHNlbGZbXCJtb3VzZURvd25cIl0pO1xyXG5cdFx0XHRcdHNlbGYub2ZmKExheWEuRXZlbnQuTU9VU0VfVVAsIHNlbGYsIHNlbGZbXCJtb3VzZVVwXCJdKTtcclxuXHRcdFx0XHRzZWxmLm9mZihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsIHNlbGYsIHNlbGZbXCJtb3VzZU1vdmVcIl0pO1xyXG5cdFx0XHRcdHNlbGYub2ZmKExheWEuRXZlbnQuTU9VU0VfT1VULCBzZWxmLCBzZWxmW1wibW91c2VPdXRcIl0pO1xyXG5cdFx0XHRcdHNlbGYub2ZmKExheWEuRXZlbnQuTU9VU0VfT1ZFUiwgc2VsZiwgc2VsZltcIm1vdXNlT3ZlclwiXSk7XHJcblx0XHRcdFx0c2VsZi5vZmYoXCJwcmVzc1wiLCBzZWxmLCBzZWxmW1wicHJlc3NcIl0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNlbGZbXCJtb3VzZURvd25cIl0gPSBmdW5jdGlvbihldmVudDogTGF5YS5FdmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChzZWxmW1wiaXNEb3duXCJdKSByZXR1cm47XHJcblx0XHRcdFx0c2VsZi5zY2FsZShzZWxmW1wiaW5pdFNYXCJdICogc2NhbGUsIHNlbGZbXCJpbml0U1lcIl0gKiBzY2FsZSk7XHJcblx0XHRcdFx0c2VsZltcImlzRG93blwiXSA9IHRydWU7XHJcblx0XHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyLnJ1bldpdGgoZXZlbnQpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VsZltcImlzRG93blwiXSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VsZi5ldmVudChcInByZXNzXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDIwMCk7XHJcblxyXG5cdFx0XHRcdC8vIGlmIChnYW1lLkFwcENvbmZpZy5zb3VuZEVmZmVjdClcclxuXHRcdFx0XHQvLyB7XHJcblx0XHRcdFx0Ly8gXHRMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoZ2FtZS5VUkkuYXVkaW9VcmwgKyBcIlVJL2J1dHRvbi53YXZcIiwgMSk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2VsZltcIm1vdXNlVXBcIl0gPSBmdW5jdGlvbihldmVudDogTGF5YS5FdmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICghc2VsZltcImlzRG93blwiXSkgcmV0dXJuO1xyXG5cdFx0XHRcdHNlbGYuc2NhbGUoc2VsZltcImluaXRTWFwiXSwgc2VsZltcImluaXRTWVwiXSk7XHJcblx0XHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyLnJ1bldpdGgoZXZlbnQpO1xyXG5cdFx0XHRcdHNlbGZbXCJpc0Rvd25cIl0gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZltcIm1vdXNlTW92ZVwiXSA9IGZ1bmN0aW9uKGV2ZW50OiBMYXlhLkV2ZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHNlbGZbXCJpc0Rvd25cIl0pIHtcclxuXHRcdFx0XHRcdGhhbmRsZXIgJiYgaGFuZGxlci5ydW5XaXRoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cdFxyXG5cclxuXHRcdFx0c2VsZltcIm1vdXNlT3ZlclwiXSA9IGZ1bmN0aW9uKGV2ZW50OiBMYXlhLkV2ZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyLnJ1bldpdGgoZXZlbnQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmW1wibW91c2VPdXRcIl0gPSBmdW5jdGlvbihldmVudDogTGF5YS5FdmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChzZWxmW1wiaXNEb3duXCJdKSB7XHJcblx0XHRcdFx0XHRzZWxmLnNjYWxlKHNlbGZbXCJpbml0U1hcIl0sIHNlbGZbXCJpbml0U1lcIl0pO1xyXG5cdFx0XHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyLnJ1bldpdGgoZXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZWxmW1wiaXNEb3duXCJdID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGZbXCJwcmVzc1wiXSA9IGZ1bmN0aW9uKGV2ZW50OiBMYXlhLkV2ZW50KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gbmV3IExheWEuRXZlbnQoKTtcclxuXHRcdFx0XHRldmVudC50eXBlID0gXCJwcmVzc1wiO1xyXG5cdFx0XHRcdGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBzZWxmO1xyXG5cdFx0XHRcdGhhbmRsZXIgJiYgaGFuZGxlci5ydW5XaXRoKGV2ZW50KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZi5vbihcInByZXNzXCIsIHRoaXMsIHNlbGZbXCJwcmVzc1wiXSk7XHJcblx0XHRcdHNlbGYub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLCB0aGlzLCBzZWxmW1wibW91c2VEb3duXCJdKTtcclxuXHRcdFx0c2VsZi5vbihMYXlhLkV2ZW50Lk1PVVNFX1VQLCB0aGlzLCBzZWxmW1wibW91c2VVcFwiXSk7XHJcblx0XHRcdHNlbGYub24oTGF5YS5FdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCBzZWxmW1wibW91c2VNb3ZlXCJdKTtcclxuXHRcdFx0c2VsZi5vbihMYXlhLkV2ZW50Lk1PVVNFX09WRVIsIHRoaXMsIHNlbGZbXCJtb3VzZU92ZXJcIl0pO1xyXG5cdFx0XHRzZWxmLm9uKExheWEuRXZlbnQuTU9VU0VfT1VULCB0aGlzLCBzZWxmW1wibW91c2VPdXRcIl0pO1xyXG5cdFx0XHQvLyBpZiAoc2VsZltcInRvcFwiXSlcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHQvLyBcdHNlbGYueSA9IHNlbGZbXCJ0b3BcIl0gKyBzZWxmLnBpdm90WTtcclxuXHRcdFx0Ly8gXHRzZWxmW1widG9wXCJdID0gTmFOO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIGlmIChzZWxmW1wiYm90dG9tXCJdKVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdC8vIFx0c2VsZi55ID0gKHNlbGYucGFyZW50IGFzIExheWEuU3ByaXRlKS5oZWlnaHQgLSBzZWxmW1wiYm90dG9tXCJdIC0gc2VsZi5oZWlnaHQgKyBzZWxmLnBpdm90WTtcclxuXHRcdFx0Ly8gXHRzZWxmW1wiYm90dG9tXCJdID0gTmFOO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIGlmIChzZWxmW1wibGVmdFwiXSlcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHQvLyBcdHNlbGYueCA9IHNlbGZbXCJsZWZ0XCJdICsgc2VsZi5waXZvdFg7XHJcblx0XHRcdC8vIFx0c2VsZltcImxlZnRcIl0gPSBOYU47XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gaWYgKHNlbGZbXCJyaWdodFwiXSlcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHQvLyBcdHNlbGYueCA9IChzZWxmLnBhcmVudCBhcyBMYXlhLlNwcml0ZSkud2lkdGggLSBzZWxmW1wicmlnaHRcIl0gLSBzZWxmLndpZHRoICsgc2VsZi5waXZvdFg7XHJcblx0XHRcdC8vIFx0c2VsZltcInJpZ2h0XCJdID0gTmFOO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiZ2V0TGVmdFwiXSA9IGZ1bmN0aW9uKCk6IG51bWJlclxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRpZiAoc2VsZltcImFuY2hvclhcIl0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxmLnBpdm90WCA9IHNlbGYud2lkdGggKiBzZWxmW1wiYW5jaG9yWFwiXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gc2VsZi54IC0gc2VsZi5waXZvdFggKiBzZWxmLnNjYWxlWDtcclxuXHRcdH1cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImdldFJpZ2h0XCJdID0gZnVuY3Rpb24oKTogbnVtYmVyXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdHJldHVybiBzZWxmLmdldExlZnQoKSArIHNlbGYud2lkdGggKiBzZWxmLnNjYWxlWDtcclxuXHRcdH1cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImdldFRvcFwiXSA9IGZ1bmN0aW9uKCk6IG51bWJlclxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRpZiAoc2VsZltcImFuY2hvcllcIl0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzZWxmLnBpdm90WSA9IHNlbGYuaGVpZ2h0ICogc2VsZltcImFuY2hvcllcIl07XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHNlbGYueSAtIHNlbGYucGl2b3RZICogc2VsZi5zY2FsZVk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJnZXRCb3R0b21cIl0gPSBmdW5jdGlvbigpOiBudW1iZXJcclxuXHRcdHtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0cmV0dXJuIHNlbGYuZ2V0VG9wKCkgKyBzZWxmLmhlaWdodCAqIHNlbGYuc2NhbGVZO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiZ2V0Q2VudGVyWFwiXSA9IGZ1bmN0aW9uKCk6IG51bWJlclxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5nZXRMZWZ0KCkgKyBzZWxmLndpZHRoIC8gMiAqIHNlbGYuc2NhbGVYO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiZ2V0Q2VudGVyWVwiXSA9IGZ1bmN0aW9uKCk6IG51bWJlclxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5nZXRUb3AoKSArIHNlbGYuaGVpZ2h0IC8gMiAqIHNlbGYuc2NhbGVZO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiY2xvbmVcIl0gPSBmdW5jdGlvbigpOiBMYXlhLlNwcml0ZVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoIXRoaXNbXCJ1aURhdGFcIl0pIHJldHVybiBudWxsO1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRsZXQgY2xvbmU6IExheWEuU3ByaXRlID0gTGF5YS5TY2VuZVV0aWxzLmNyZWF0ZUNvbXAoc2VsZltcInVpRGF0YVwiXSk7XHJcblx0XHRcdC8vIGlmIChzZWxmW1widWlEYXRhXCJdKVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdC8vIFx0Zm9yICh2YXIga2V5IGluIHNlbGZbXCJ1aURhdGFcIl1bXCJwcm9wc1wiXSkge1xyXG5cdFx0XHQvLyBcdFx0aWYgKHNlbGZbXCJ1aURhdGFcIl1bXCJwcm9wc1wiXS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcblx0XHRcdC8vIFx0XHRcdHZhciBlbGVtZW50ID0gc2VsZltrZXldO1xyXG5cdFx0XHQvLyBcdFx0XHRjbG9uZVtcImtleVwiXSA9IGVsZW1lbnQ7XHJcblx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyBcdHNlbGYuY2hpbGRyZW4oW10pLmZvckVhY2goY2hpbGQgPT4ge1xyXG5cdFx0XHQvLyBcdFx0dmFyIGluZGV4ID0gc2VsZi5nZXRDaGlsZEluZGV4KGNoaWxkKVxyXG5cdFx0XHQvLyBcdFx0Y2xvbmUucmVtb3ZlQ2hpbGRBdChpbmRleCk7XHJcblx0XHRcdC8vIFx0XHRjbG9uZS5hZGRDaGlsZEF0KChjaGlsZCBhcyBMYXlhLlNwcml0ZSkuY2xvbmUoKSwgaW5kZXgpO1xyXG5cdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdGNsb25lLnZpc2libGUgPSBzZWxmLnZpc2libGU7XHJcblx0XHRcdHJldHVybiBjbG9uZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTdHJpbmfmi5PlsZVcclxuXHRcdHZhciBzdHJpbmdQcm90bzogU3RyaW5nID0gU3RyaW5nLnByb3RvdHlwZTtcclxuXHRcdC8vIOWtl+espuS4suagvOW8j+WMlijlj6rlgZrkuobnroDljZXnmoQlZCwlc+WMuemFje+8jOacquWBmuWPguaVsOS4quaVsOWSjOexu+Wei+WIpOaWre+8jOS5i+WQjuS8mOWMluWujOWWhClcclxuXHRcdFN0cmluZ1tcImZvcm1hdFwiXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuXHRcdFx0dmFyIHN0cjogc3RyaW5nID0gYXJnc1swXTtcclxuXHRcdFx0YXJncyA9IGFyZ3Muc2xpY2UoMSwgYXJncy5sZW5ndGgpO1xyXG5cdFx0XHR2YXIgbWF0Y2ggPSBmdW5jdGlvbihtU3RyaW5nOiBzdHJpbmcsIG1BcmdzOiBBcnJheTxhbnk+KSB7XHJcblx0XHRcdFx0dmFyIGluZGV4OiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcdHZhciByZXN1bHQ6IEFycmF5PGFueT4gPSBtU3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAoXCIlW2Qsc10rXCIpKTtcclxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1TdHJpbmc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1TdHJpbmcgPSBtU3RyaW5nLnJlcGxhY2UocmVzdWx0WzBdLCBtQXJnc1swXSk7XHJcblx0XHRcdFx0XHRtQXJncyA9IG1BcmdzLnNsaWNlKDEsIG1BcmdzLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2gobVN0cmluZywgbUFyZ3MpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBtYXRjaChzdHIsIGFyZ3MpXHJcblx0XHR9XHJcblxyXG5cdFx0U3RyaW5nW1wiaXNFbW9qaUNoYXJhY3RlclwiXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuXHRcdFx0dmFyIHN1YnN0cmluZzogc3RyaW5nID0gYXJnc1swXTtcclxuXHRcdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgc3Vic3RyaW5nLmxlbmd0aDsgaSsrKSB7ICBcclxuXHRcdFx0XHR2YXIgaHMgPSBzdWJzdHJpbmcuY2hhckNvZGVBdChpKTsgIFxyXG5cdFx0XHRcdGlmICgweGQ4MDAgPD0gaHMgJiYgaHMgPD0gMHhkYmZmKSB7ICBcclxuXHRcdFx0XHRcdGlmIChzdWJzdHJpbmcubGVuZ3RoID4gMSkgeyAgXHJcblx0XHRcdFx0XHRcdHZhciBscyA9IHN1YnN0cmluZy5jaGFyQ29kZUF0KGkgKyAxKTsgIFxyXG5cdFx0XHRcdFx0XHR2YXIgdWMgPSAoKGhzIC0gMHhkODAwKSAqIDB4NDAwKSArIChscyAtIDB4ZGMwMCkgKyAweDEwMDAwOyAgXHJcblx0XHRcdFx0XHRcdGlmICgweDFkMDAwIDw9IHVjICYmIHVjIDw9IDB4MWY3N2YpIHsgIFxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHRcdH0gIFxyXG5cdFx0XHRcdFx0fSAgXHJcblx0XHRcdFx0fSBlbHNlIGlmIChzdWJzdHJpbmcubGVuZ3RoID4gMSkgeyAgXHJcblx0XHRcdFx0XHR2YXIgbHMgPSBzdWJzdHJpbmcuY2hhckNvZGVBdChpICsgMSk7ICBcclxuXHRcdFx0XHRcdGlmIChscyA9PSAweDIwZTMpIHsgIFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0fSAgXHJcblx0XHRcdFx0fSBlbHNlIHsgIFxyXG5cdFx0XHRcdFx0aWYgKDB4MjEwMCA8PSBocyAmJiBocyA8PSAweDI3ZmYpIHsgIFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICgweDJCMDUgPD0gaHMgJiYgaHMgPD0gMHgyYjA3KSB7ICBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoMHgyOTM0IDw9IGhzICYmIGhzIDw9IDB4MjkzNSkgeyAgXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKDB4MzI5NyA8PSBocyAmJiBocyA8PSAweDMyOTkpIHsgIFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChocyA9PSAweGE5IHx8IGhzID09IDB4YWUgfHwgaHMgPT0gMHgzMDNkIHx8IGhzID09IDB4MzAzMCAgXHJcblx0XHRcdFx0XHRcdFx0fHwgaHMgPT0gMHgyYjU1IHx8IGhzID09IDB4MmIxYyB8fCBocyA9PSAweDJiMWIgIFxyXG5cdFx0XHRcdFx0XHRcdHx8IGhzID09IDB4MmI1MCkgeyAgXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHR9ICBcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHR9IFxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFycmF55ouT5bGVXHJcblx0XHR2YXIgYXJyYXlQcm90bzogYW55ID0gQXJyYXkucHJvdG90eXBlO1xyXG5cdFx0Ly8gYXJyYXnlrZfmrrXmjpLluo8gMe+8mmFyci5zb3J0T24oW1tcImtleTFcIiwgXCJ1cFwiXSwgW1wia2V5MlwiLCBcImRvd25cIl1dKSAy77yaYXJyLnNvcnRPbihcInVwXCIpXHJcblx0XHQvLyDlpI3lkIjmjpLluo8gZmllbGRMaXN05YyF5ZCr5aSa5Liq5YiX6KGo77yM5q+P5Liq5YiX6KGo5YyF5ZCrMuS4quWAvO+8jOesrOS4gOS4quihqOekuuimgeaOkuW6j+eahGtleSznrKzkuozkuKrooajnpLropoHmjpLluo/nmoTnsbvlnovvvIjljYfpmY3luo9cclxuXHRcdC8vIOWAvOaOkuW6jyDlj6rkvKDkuIDkuKrlrZfnrKbkuLLooajnpLrlr7nlgLzliJfooajov5vooYzmjpLluo9cclxuXHRcdGFycmF5UHJvdG9bXCJzb3J0T25cIl0gPSBmdW5jdGlvbihmaWVsZExpc3Q6IGFueSk6IHZvaWQge1xyXG5cdFx0XHRsZXQgaW5kZXg6IG51bWJlciA9IDA7XHJcblx0XHRcdHZhciBjb21wYXJlID0gZnVuY3Rpb24oYTogT2JqZWN0LCBiOiBPYmplY3QpOiBudW1iZXIge1xyXG5cdFx0XHRcdHZhciByZXN1bHQ6IG51bWJlciA9IDA7XHJcblx0XHRcdFx0dmFyIGtleTogc3RyaW5nID0gZmllbGRMaXN0W2luZGV4XVswXTtcclxuXHRcdFx0XHR2YXIgc29ydFR5cGU6IHN0cmluZyA9IGZpZWxkTGlzdFtpbmRleF1bMV0gfHwgXCJ1cFwiO1xyXG5cdFx0XHRcdHZhciB2YWx1ZUEgPSBhW2tleV07XHJcblx0XHRcdFx0dmFyIHZhbHVlQiA9IGJba2V5XTtcclxuXHRcdFx0XHRpZiAodHlwZW9mKHZhbHVlQSkgPT0gXCJib29sZWFuXCIpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFsdWVBID0gdmFsdWVBID8gMSA6IDA7XHJcblx0XHRcdFx0XHR2YWx1ZUIgPSB2YWx1ZUIgPyAxIDogMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHZhbHVlQSA+IHZhbHVlQikge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gc29ydFR5cGUgPT0gXCJ1cFwiID8gMSA6IC0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmICh2YWx1ZUEgPCB2YWx1ZUIpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHNvcnRUeXBlID09IFwidXBcIiA/IC0xIDogMTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aW5kZXgrKztcclxuXHRcdFx0XHRcdGlmIChmaWVsZExpc3RbaW5kZXhdKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gY29tcGFyZShhLCBiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aW5kZXggPSAwO1xyXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdH07XHJcblx0XHRcdGlmICh0eXBlb2YoZmllbGRMaXN0KSA9PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdFx0KHRoaXMgYXMgQXJyYXk8YW55Pikuc29ydChmdW5jdGlvbihhOiBhbnksIGI6IGFueSk6IG51bWJlciB7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0OiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcdFx0aWYgKGEgPiBiKSB7XHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGZpZWxkTGlzdCA9PSBcInVwXCIgPyAxIDogLTE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChhIDwgYikge1xyXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBmaWVsZExpc3QgPT0gXCJ1cFwiID8gLTEgOiAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCh0aGlzIGFzIEFycmF5PGFueT4pLnNvcnQoY29tcGFyZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRhcnJheVByb3RvW1wiZ2V0SW5kZXhcIl0gPSBmdW5jdGlvbih2YWx1ZSA6IGFueSk6IG51bWJlciB7XHJcblx0XHRcdHZhciBpID0gLTE7XHJcblxyXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICh0aGlzW2ldID09IHZhbHVlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybiBpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFJbnQzMkFycmF5W1wicHJvdG90eXBlXCJdW1wiZmlsbFwiXSlcclxuXHRcdHtcclxuXHRcdFx0SW50MzJBcnJheVtcInByb3RvdHlwZVwiXVtcImZpbGxcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHZhciBpID0gMDtcclxuXHJcblx0XHRcdFx0d2hpbGUodHlwZW9mIHRoaXNbaV0gIT0gXCJ1bmRlZmluZWRcIilcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0aGlzW2ldID0gdmFsdWU7XHJcblx0XHRcdFx0XHRpKys7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghTnVtYmVyW1wiaXNGaW5pdGVcIl0pXHJcblx0XHR7XHJcblx0XHRcdE51bWJlcltcImlzRmluaXRlXCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PSBcIm51bWJlclwiKSAmJiAodmFsdWUgIT0gTmFOKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuaW1wb3J0IExvYWRpbmdTY2VuZSBmcm9tIFwiLi9zY3JpcHQvc2NlbmUvTG9hZGluZ1NjZW5lXCJcbmltcG9ydCBNYWluR2FtZVNjZW5lIGZyb20gXCIuL3NjcmlwdC9zY2VuZS9NYWluR2FtZVNjZW5lXCJcbmltcG9ydCBGb250R3JpZCBmcm9tIFwiLi9zY3JpcHQvcHJlZmViL0ZvbnRHcmlkXCJcbmltcG9ydCBHYW1lVUkgZnJvbSBcIi4vc2NyaXB0L0dhbWVVSVwiXG5pbXBvcnQgR2FtZUNvbnRyb2wgZnJvbSBcIi4vc2NyaXB0L0dhbWVDb250cm9sXCJcbmltcG9ydCBCdWxsZXQgZnJvbSBcIi4vc2NyaXB0L0J1bGxldFwiXG5pbXBvcnQgRHJvcEJveCBmcm9tIFwiLi9zY3JpcHQvRHJvcEJveFwiXG5pbXBvcnQgR2FtZVJlc3VsdCBmcm9tIFwiLi9zY3JpcHQvcHJlZmViL0dhbWVSZXN1bHRcIlxuaW1wb3J0IEdhbWVTZXR0aW5nIGZyb20gXCIuL3NjcmlwdC9wcmVmZWIvR2FtZVNldHRpbmdcIlxuaW1wb3J0IFN0YXJ0R2FtZSBmcm9tIFwiLi9zY3JpcHQvcHJlZmViL1N0YXJ0R2FtZVwiXG5pbXBvcnQgVGlwSXRlbSBmcm9tIFwiLi9zY3JpcHQvcHJlZmViL1RpcEl0ZW1cIlxyXG4vKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9MTEzNjtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwic2hvd2FsbFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwidmVydGljYWxcIjtcclxuICAgIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwibWlkZGxlXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25IOnN0cmluZz1cImNlbnRlclwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwibG9hZGluZy9Mb2FkaW5nLnNjZW5lXCI7XHJcbiAgICBzdGF0aWMgc2NlbmVSb290OnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICB2YXIgcmVnOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcclxuICAgICAgICByZWcoXCJzY3JpcHQvc2NlbmUvTG9hZGluZ1NjZW5lLnRzXCIsTG9hZGluZ1NjZW5lKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L3NjZW5lL01haW5HYW1lU2NlbmUudHNcIixNYWluR2FtZVNjZW5lKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L3ByZWZlYi9Gb250R3JpZC50c1wiLEZvbnRHcmlkKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L0dhbWVVSS50c1wiLEdhbWVVSSk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9HYW1lQ29udHJvbC50c1wiLEdhbWVDb250cm9sKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L0J1bGxldC50c1wiLEJ1bGxldCk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9Ecm9wQm94LnRzXCIsRHJvcEJveCk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9wcmVmZWIvR2FtZVJlc3VsdC50c1wiLEdhbWVSZXN1bHQpO1xuICAgICAgICByZWcoXCJzY3JpcHQvcHJlZmViL0dhbWVTZXR0aW5nLnRzXCIsR2FtZVNldHRpbmcpO1xuICAgICAgICByZWcoXCJzY3JpcHQvcHJlZmViL1N0YXJ0R2FtZS50c1wiLFN0YXJ0R2FtZSk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9wcmVmZWIvVGlwSXRlbS50c1wiLFRpcEl0ZW0pO1xyXG4gICAgfVxyXG59XHJcbkdhbWVDb25maWcuaW5pdCgpOyIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi9BcHBDb25maWdcIjtcclxuaW1wb3J0IE1hcEZvbnRJbmZvIGZyb20gXCIuL3NjcmlwdC9tb2RlbC9NYXBGb250SW5mb1wiO1xyXG5pbXBvcnQgUGxheWVyQ29udHJvbGxlciBmcm9tIFwiLi9zY3JpcHQvY29udHJvbGxlci9QbGF5ZXJDb250cm9sbGVyXCI7XHJcbmltcG9ydCBDb2RlRXhwYW5kIGZyb20gXCIuL0NvZGVFeHBhbmRcIjtcclxuaW1wb3J0IHsgUmVzTWdyIH0gZnJvbSBcIi4vUmVzTWdyXCI7XHJcbmltcG9ydCBVUkkgZnJvbSBcIi4vVVJJXCI7XHJcbmltcG9ydCBUaXBDb250cm9sbGVyIGZyb20gXCIuL3NjcmlwdC9jb250cm9sbGVyL1RpcENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IENvbnRyb2xsZXJNZ3IgZnJvbSBcIi4vc2NyaXB0L2NvbnRyb2xsZXIvQ29udHJvbGxlck1nclwiO1xyXG5pbXBvcnQgU2NlbmVNZ3IgZnJvbSBcIi4vc2NyaXB0L3NjZW5lL1NjZW5lTWdyXCI7XHJcbmltcG9ydCBMb2FkaW5nU2NlbmUgZnJvbSBcIi4vc2NyaXB0L3NjZW5lL0xvYWRpbmdTY2VuZVwiO1xyXG5pbXBvcnQgU291bmRUb29sIGZyb20gXCIuL3NjcmlwdC90b29sL1NvdW5kVG9vbFwiO1xyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0Ly8gbGV0IHN0ciA9IFwiXCI7XHJcblx0XHQvLyBsZXQgYXJyID0gc3RyLnNwbGl0KFwiLFwiKTtcclxuXHRcdC8vIGxldCBjb3V0QXJyID0gW107XHJcblx0XHQvLyBsZXQgY291dCA9IFwiXCI7XHJcblx0XHQvLyBhcnIuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdC8vIFx0bGV0IGVsZW1lbnRTdHIgPSBlbGVtZW50LnRyaW0oKTtcclxuXHRcdC8vIFx0aWYoZWxlbWVudFN0ciA9PSBcIlwiKVxyXG5cdFx0Ly8gXHR7XHJcblx0XHQvLyBcdFx0cmV0dXJuO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdGlmKGNvdXRBcnIuaW5kZXhPZihlbGVtZW50U3RyKSAhPSAtMSlcclxuXHRcdC8vIFx0e1xyXG5cdFx0Ly8gXHRcdHJldHVybjtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHRpZihjb3V0ICE9IFwiXCIpXHJcblx0XHQvLyBcdHtcclxuXHRcdC8vIFx0XHRjb3V0ICs9IFwiLFwiXHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0Y291dEFyci5wdXNoKGVsZW1lbnRTdHIpO1xyXG5cdFx0Ly8gXHRjb3V0ICs9IFwiXFxcIlwiICtlbGVtZW50U3RyICsgXCJcXFwiXCI7XHJcblx0XHQvLyB9KVxyXG5cdFx0TGF5YS5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0LFwid2ViZ2xcIik7XHJcblx0XHQvLyBMYXlhLmluaXQoNjQwLCAxMTM2KTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBMYXlhLlVSTC5iYXNlUGF0aCA9IFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3d1cGVpMTk4Ny9mb250LWdhbWUtd3gtYXNzZXQvbWFzdGVyL1wiO1xyXG5cdFx0XHR3eC5zZXRFbmFibGVEZWJ1Zyh7XHJcblx0XHRcdFx0ZW5hYmxlRGVidWc6IHRydWUsXHJcblx0XHRcdFx0c3VjY2VzczogKHJlc3VsdDogX3NldEVuYWJsZURlYnVnU3VjY2Vzc09iamVjdCkgPT4gdm9pZHt9LFxyXG5cdFx0XHRcdGZhaWw6ICgpID0+IHZvaWR7fSxcclxuXHRcdFx0XHRjb21wbGV0ZTogKCkgPT4gdm9pZHt9LFxyXG5cdFx0XHQgIH0pXHJcblx0XHR9XHJcblx0XHRpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG5cdFx0e1xyXG5cdFx0XHRcclxuXHRcdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBcImZpeHdpZHRoXCI7XHJcblx0XHRcdExheWEuVVJMLmJhc2VQYXRoID0gXCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vd3VwZWkxOTg3L2ZvbnQtZ2FtZS13eC1hc3NldC9tYXN0ZXIvXCI7XHJcblx0XHRcdExheWEuTWluaUFkcHRlci5uYXRpdmVmaWxlcyA9IFtcclxuXHRcdFx0XHRcImJ0bl9zdGFydEdhbWUucG5nXCJcclxuXHRcdFx0XTtcclxuXHRcdH1cclxuXHRcdGVsc2UgXHJcblx0XHR7XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XHJcblx0XHR9XHJcblx0XHQvLyBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5hbGlnblYgPSBHYW1lQ29uZmlnLmFsaWduVjtcclxuXHRcdExheWEuc3RhZ2UuYWxpZ25IID0gR2FtZUNvbmZpZy5hbGlnbkg7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHYW1lQ29uZmlnLnNjcmVlbk1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLmZyYW1lUmF0ZSA9IFwic2xvd1wiO1xyXG5cdFx0Ly8gTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHQvLyBMYXlhLkJyb3dzZXIud2luZG93LnNob3dBbGVydE9uSnNFeGNlcHRpb24oZmFsc2UpO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG5cclxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHRDb2RlRXhwYW5kLmluaXQoKTtcclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHRMYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cdH1cclxuXHJcblx0b25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0XHRMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lLHRydWUsbnVsbCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWRpbmdMb2FkKSlcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOabtOaWsOi/m+W6puadoVxyXG5cdCAqIEBwYXJhbSBwZXJjZW50IOeZvuWIhuavlCAwLTEwMFxyXG5cdCAqL1xyXG5cdHByaXZhdGUgdXBkYXRlTG9hZGluZ1Byb2dyZXNzKHBlcmNlbnQgOiBudW1iZXIpICA6dm9pZHtcclxuXHRcdHBlcmNlbnQgPSBNYXRoLmZsb29yKHBlcmNlbnQpO1xyXG5cdFx0aWYoU2NlbmVNZ3IuY3VyU2NlbmVTY3JpcHQgIT0gbnVsbCAmJiBTY2VuZU1nci5jdXJTY2VuZVNjcmlwdCBpbnN0YW5jZW9mIExvYWRpbmdTY2VuZSlcclxuXHRcdHtcclxuXHRcdFx0U2NlbmVNZ3IuY3VyU2NlbmVTY3JpcHQudXBkYXRlUGVyY2VudChwZXJjZW50KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkxvYWRpbmdMb2FkKCkgOiB2b2lke1xyXG5cdFx0aWYoTGF5YS5Ccm93c2VyLndpbmRvdy5sb2FkaW5nVmlldyl7XHJcblx0XHRcdExheWEuQnJvd3Nlci53aW5kb3cubG9hZGluZ1ZpZXcuaGlkZUxvYWRpbmdWaWV3KCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUxvYWRpbmdQcm9ncmVzcygwKTtcclxuXHRcdExheWEubG9hZGVyLmxvYWQoQXBwQ29uZmlnLmdldEluaXRMb2FkaW5nVXJscygpLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLmxvYWRTdGFydFNjZW5lKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24ocHJvZ3Jlc3MgOiBudW1iZXIpIDogdm9pZHtcclxuXHRcdFx0dGhpcy51cGRhdGVMb2FkaW5nUHJvZ3Jlc3MocHJvZ3Jlc3MgKiA5MCk7XHJcblx0XHR9KSk7XHJcblx0fVxyXG5cclxuXHRsb2FkU3RhcnRTY2VuZSgpIDogdm9pZHtcclxuXHRcdGxldCBkYXRhID0gTGF5YS5sb2FkZXIuZ2V0UmVzKFwicmVzL2RhdGEuanNvblwiKTtcclxuXHRcdE1hcEZvbnRJbmZvLkRhdGFTb3VyY2UgPSBkYXRhO1xyXG5cdFx0TGF5YS5TY2VuZS5vcGVuKFwibWFpbi9NYWluR2FtZS5zY2VuZVwiLHRydWUsbnVsbCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkdhbWVTdGFydCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25HYW1lTG9hZFByb2dyZXNzLFtdLGZhbHNlKSk7XHJcblx0XHRpZihMYXlhLkJyb3dzZXIub25NaW5pR2FtZSlcclxuXHRcdHtcclxuXHRcdFx0TGF5YS5NaW5pQWRwdGVyLnNlbmRBdGxhc1RvT3BlbkRhdGFDb250ZXh0KFwicmVzL2F0bGFzL3Rlc3QuYXRsYXNcIilcclxuXHRcdH1cclxuXHRcdFxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBvbkdhbWVMb2FkUHJvZ3Jlc3ModmFsdWUgOiBudW1iZXIpIDogdm9pZHtcclxuXHRcdGlmKExheWEuQnJvd3Nlci53aW5kb3cubG9hZGluZ1ZpZXcpe1xyXG5cdFx0XHRMYXlhLkJyb3dzZXIud2luZG93LmxvYWRpbmdWaWV3LmxvYWRpbmcodmFsdWUgKiAxMDApO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVMb2FkaW5nUHJvZ3Jlc3MoOTAgKyB2YWx1ZSAqIDEwKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25HYW1lU3RhcnQoKSA6IHZvaWR7XHJcblx0XHRDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFRpcENvbnRyb2xsZXIpLmluaXQoKTtcclxuXHRcdFNvdW5kVG9vbC5pbml0KCk7XHJcblx0XHRTb3VuZFRvb2wucGxheUJnTXVzaWMoKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiXG5pbnRlcmZhY2UgbG9hZEl0ZW17XG4gICAgdXJscyA6IHN0cmluZ1tdLFxuICAgIGNhbGxlciA6IGFueSxcbiAgICBpbmRleCA6IG51bWJlcixcbiAgICBvblByb2dyZXNzIDogKGluZGV4IDogbnVtYmVyLCB0b3RhbCA6IG51bWJlcikgPT4gdm9pZCxcbiAgICBvbkNvbXBsZXRlIDogKCkgPT4gdm9pZFxufVxuXG5leHBvcnQgY2xhc3MgUmVzTWdyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBzcGluZUxpc3QgICAgICAgOiBPYmplY3QgPSB7fTtcbiAgICBwcml2YXRlIHRleHR1cmVMaXN0ICAgICA6IE9iamVjdCA9IHt9O1xuICAgIHByaXZhdGUgYW5pbWF0aW9uTGlzdCAgIDogT2JqZWN0ID0ge307XG4gICAgcHJpdmF0ZSBtb2RlbERlbGF5TGlzdCAgOiBPYmplY3QgPSB7fTtcblxuICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2UoKSA6IFJlc01nciB7XG4gICAgICAgIGlmIChSZXNNZ3IuaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgUmVzTWdyLmluc3RhbmNlID0gbmV3IFJlc01ncigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJlc01nci5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIHJlbGVhc2VTcGluZSh1cmwgOiBzdHJpbmcpIDogdm9pZFxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuc3BpbmVMaXN0W3VybF0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCBzcGluZSA6IExheWEuVGVtcGxldCA9IHRoaXMuc3BpbmVMaXN0W3VybF07XG4gICAgICAgICAgICAvLyBzcGluZS5yZWxlYXNlUmVzb3VyY2UodHJ1ZSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BpbmVbXCJfbG9hZExpc3RcIl0ubGVuZ3RoOyBpKyspIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0dXJlIDogTGF5YS5UZXh0dXJlID0gc3BpbmUuZ2V0VGV4dHVyZShzcGluZVtcIl9sb2FkTGlzdFwiXVtpXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGV4dHVyZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmUuZGlzcG9zZUJpdG1hcCgpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNwaW5lLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgTGF5YS5sb2FkZXIuY2xlYXJSZXModXJsKTtcblxuICAgICAgICAgICAgdGhpcy5zcGluZUxpc3RbdXJsXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZFNwaW5lKHVybCA6IGFueSwgY2FsbGJrIDogTGF5YS5IYW5kbGVyKSA6IGFueSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG51bSAgPSAwO1xuXG4gICAgICAgIHZhciBsb2FkRnVuYyA9IGZ1bmN0aW9uKHNwaW5lKSB7XG4gICAgICAgICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNwaW5lTGlzdFtzcGluZV0gPSBmYWN0b3J5O1xuXG4gICAgICAgICAgICAgICAgaWYgKCh1cmwgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtICsrO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChudW0gPT0gdXJsLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IG5ldyBMYXlhLlRlbXBsZXQoKTtcbiAgICAgICAgICAgIGZhY3Rvcnkub24oTGF5YS5FdmVudC5DT01QTEVURSwgc2VsZiwgY29tcGxldGUpO1xuICAgICAgICAgICAgLy8gZmFjdG9yeS5vbihFdmVudC5FUlJPUiwgdGhpcywgdGhpcy5vbkVycm9yKTtcbiAgICAgICAgICAgIGZhY3RvcnkubG9hZEFuaShzcGluZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHVybCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1cmwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsb2FkRnVuYyh1cmxbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9hZEZ1bmModXJsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkVGV4dHVyZSh1cmwgOiBhbnksIGNhbGxiayA6IExheWEuSGFuZGxlcikgOiBhbnkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCh1cmwgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXJsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gKHVybC5sZW5ndGggLSAxKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIExheWEuVGV4dHVyZTJELmxvYWQodXJsW2ldLCBjYWxsYmspO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmUyRC5sb2FkKHVybFtpXSwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTGF5YS5UZXh0dXJlMkQubG9hZCh1cmwsIGNhbGxiayk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiAoY2FsbGJrICE9IG51bGwpIHtcbiAgICAgICAgLy8gICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkUE5HKHVybCA6IGFueSwgY2FsbGJrIDogYW55KSA6IHZvaWQge1xuICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKSAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKS5yZWxlYXNlZCA9PSB0cnVlKVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGxldCB0ZXh0dXJlIDogTGF5YS5UZXh0dXJlID0gTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XG4gICAgICAgICAgICAvLyAgICAgdGV4dHVyZS5iaXRtYXAub24oTGF5YS5FdmVudC5SRUNPVkVSRUQsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcbiAgICAgICAgICAgIC8vICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICB0ZXh0dXJlLmFjdGl2ZSgpO1xuICAgICAgICAgICAgLy8gICAgIC8vIHRleHR1cmUubG9hZCh1cmwpO1xuICAgICAgICAgICAgLy8gICAgIC8vIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGVsc2UgXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsLCBjYWxsYmssIG51bGwsIFwiaW1hZ2VcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFBORyh1cmwgOiBzdHJpbmcpIDogTGF5YS5UZXh0dXJlIHtcbiAgICAgICAgcmV0dXJuIExheWEubG9hZGVyLmdldFJlcyh1cmwpIGFzIExheWEuVGV4dHVyZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmoLnmja7lm77niYflnLDlnYDliJvlu7pzcHJpdGVcbiAgICAgKiBAcGFyYW0gdXJsIOWbvueJh+WcsOWdgFxuICAgICAqIEBwYXJhbSBzcHJpdGUg6buY6K6k5Li656m6IOWmguaenOS4jeS4uuepuiDnm7TmjqXlnKjmraRzcHJpdGXkuIrnu5jliLYgXG4gICAgICovXG4gICAgcHVibGljIGNyZWF0ZVNwcml0ZSh1cmwgOiBzdHJpbmcsIHNwcml0ZT86IExheWEuU3ByaXRlKSA6IExheWEuU3ByaXRle1xuICAgICAgICBsZXQgc3AgOiBMYXlhLlNwcml0ZSA9IHNwcml0ZSB8fCBuZXcgTGF5YS5TcHJpdGUoKTtcbiAgICAgICAgbGV0IHRleDogTGF5YS5UZXh0dXJlO1xuICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKSA9PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmxvYWRQTkcodXJsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbigpIDogdm9pZHtcbiAgICAgICAgICAgICAgICB0ZXggPSB0aGlzLmdldFBORyh1cmwpO1xuICAgICAgICAgICAgICAgIHNwLmdyYXBoaWNzLmRyYXdUZXh0dXJlKHRleCk7XG4gICAgICAgICAgICAgICAgaWYgKHRleClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNwLnNpemUodGV4LnNvdXJjZVdpZHRoLCB0ZXguc291cmNlSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4ID0gdGhpcy5nZXRQTkcodXJsKTtcbiAgICAgICAgICAgIHNwLmdyYXBoaWNzLmRyYXdUZXh0dXJlKHRleCk7XG4gICAgICAgICAgICBpZiAodGV4KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNwLnNpemUodGV4LnNvdXJjZVdpZHRoLCB0ZXguc291cmNlSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3A7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUltZyh1cmw6IHN0cmluZywgaW1nPzogTGF5YS5JbWFnZSk6IExheWEuSW1hZ2VcbiAgICB7XG4gICAgICAgIGlmICghaW1nKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbWcgPSBuZXcgTGF5YS5JbWFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZFBORyh1cmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbWcuc2tpbiA9IHVybDtcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gaW1nO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkTW9kZWwodXJsIDogYW55LCBjYWxsYmsgOiBhbnkpIDogYW55IHtcbiAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgJiYgTGF5YS5sb2FkZXIuZ2V0UmVzKHVybClbXCJfY2hpbGRyZW5cIl0gJiYgTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkuZ2V0Q2hpbGRBdCgwKSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBMYXlhLmxvYWRlci5jcmVhdGUodXJsLCBjYWxsYmspO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKHVybCA6IHN0cmluZywgY2FsbGJrIDogTGF5YS5IYW5kbGVyKSA6IHZvaWR7XG4gICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybCxjYWxsYmspO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkSnNvbih1cmwgOiBhbnksIGNhbGxiayA6IExheWEuSGFuZGxlcikgOiB2b2lke1xuICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKSAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmwsIGNhbGxiayxudWxsLCBMYXlhLkxvYWRlci5KU09OKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZEF0bGFzKHVybCA6IGFueSwgY2FsbGJrIDogTGF5YS5IYW5kbGVyKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybCxjYWxsYmssbnVsbCxMYXlhLkxvYWRlci5BVExBUyk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRBbmltYXRpb24oYW5pVXJsOiBzdHJpbmcsIGF0bGFzVXJsOiBzdHJpbmcsIGNhbGxiazogTGF5YS5IYW5kbGVyKTogdm9pZFxuICAgIHtcbiAgICAgICAgaWYgKGF0bGFzVXJsICE9IFwiXCIgJiYgYXRsYXNVcmwgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKGFuaVVybCkgIT0gbnVsbCAmJiBMYXlhLmxvYWRlci5nZXRSZXMoYXRsYXNVcmwpICE9IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyhhbmlVcmwpICE9IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKGFuaVVybCwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChhdGxhc1VybCAhPSBudWxsICYmIGF0bGFzVXJsICE9IFwiXCIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZChhdGxhc1VybCwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkxpc3RbYW5pVXJsXSA9IGF0bGFzVXJsO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAgICAgfSksIG51bGwsIExheWEuTG9hZGVyLkFUTEFTKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCwgZmFsc2UpLCBudWxsLCBMYXlhLkxvYWRlci5KU09OKTtcbiAgICB9XG5cbiAgICBcbiAgICBwdWJsaWMgZ2V0U3BpbmUodXJsIDogc3RyaW5nKSA6IExheWEuVGVtcGxldCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwaW5lTGlzdFt1cmxdO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVTcGluZSh1cmwgOiBzdHJpbmcsIGFuaW1hdGlvbj86IHN0cmluZywgbG9vcCA6IGJvb2xlYW4gPSB0cnVlLCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIgPSBudWxsKSA6IExheWEuU2tlbGV0b24ge1xuICAgICAgICB2YXIgc2s6IExheWEuU2tlbGV0b247XG4gICAgICAgIGlmICh0aGlzLnNwaW5lTGlzdFt1cmxdKVxuICAgICAgICB7XG4gICAgICAgICAgICBzayA9IHRoaXMuc3BpbmVMaXN0W3VybF0uYnVpbGRBcm1hdHVyZSgwKTtcbiAgICAgICAgICAgIGlmIChhbmltYXRpb24gIT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzay5wbGF5KGFuaW1hdGlvbiwgbG9vcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmsgIT0gbnVsbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYWxsYmsucnVuV2l0aChzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBzayA9IG5ldyBMYXlhLlNrZWxldG9uKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRTcGluZSh1cmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNrLmluaXQodGhpcy5zcGluZUxpc3RbdXJsXSwgMCk7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbiAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2sucGxheShhbmltYXRpb24sIGxvb3ApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmsgIT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiay5ydW5XaXRoKHNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2tcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlQW5pbWF0aW9uKHVybDogc3RyaW5nLCBhbmltYXRpb24/OiBzdHJpbmcpOiBMYXlhLkFuaW1hdGlvblxuICAgIHtcbiAgICAgICAgdmFyIGFuaTogTGF5YS5BbmltYXRpb24gPSBuZXcgTGF5YS5BbmltYXRpb24oKTtcbiAgICAgICAgYW5pLnNvdXJjZSA9IHVybDtcbiAgICAgICAgaWYgKGFuaW1hdGlvbilcbiAgICAgICAge1xuICAgICAgICAgICAgYW5pLnBsYXkobnVsbCwgdHJ1ZSwgYW5pbWF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pO1xuICAgIH1cblxuXG4gICAgcHVibGljIGdldFRleHR1cmUodXJsIDogc3RyaW5nLCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIpIDogdm9pZCB7XG4gICAgICAgIGxldCByZXMgPSBMYXlhLmxvYWRlci5nZXRSZXModXJsKTtcblxuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBjYWxsYmsucnVuV2l0aChyZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2FkVGV4dHVyZSh1cmwsIGNhbGxiayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdHJ5R2V0VGV4dHVyZSh1cmwgOiBzdHJpbmcpIDogTGF5YS5UZXh0dXJlMkQge1xuICAgICAgICBsZXQgcmVzID0gTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XG5cbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpZHggOiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBsb2FkTGlzdCh1cmxzIDogc3RyaW5nW10sY2FsbGVyIDogYW55LCBvblByb2dyZXNzIDogKGluZGV4IDogbnVtYmVyLCB0b3RhbCA6IG51bWJlcikgPT4gdm9pZCwgb25Db21wbGV0ZSA6ICgpID0+IHZvaWQpIDogUmVzTWdyXG4gICAge1xuICAgICAgICBpZih1cmxzLmxlbmd0aCA9PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlLmNhbGwoY2FsbGVyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaXRlbSAgPSB7XG4gICAgICAgICAgICBpZCA6IHRoaXMuaWR4LFxuICAgICAgICAgICAgdXJscyA6IHVybHMsXG4gICAgICAgICAgICBjYWxsZXIgOiBjYWxsZXIsXG4gICAgICAgICAgICBpbmRleCA6IDAsXG4gICAgICAgICAgICBvblByb2dyZXNzOm9uUHJvZ3Jlc3MsXG4gICAgICAgICAgICBvbkNvbXBsZXRlIDogb25Db21wbGV0ZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaWR4ICsrO1xuICAgICAgICB0aGlzLnN0YXJ0TG9hZChpdGVtKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0TG9hZCAoaXRlbSA6IGxvYWRJdGVtKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmKGl0ZW0udXJscy5sZW5ndGggPD0gaXRlbS5pbmRleClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoaXRlbS5vbkNvbXBsZXRlICE9IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaXRlbS5vbkNvbXBsZXRlLmNhbGwoaXRlbS5jYWxsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB1cmwgPSBpdGVtLnVybHNbaXRlbS5pbmRleF07XG4gICAgICAgIFxuICAgICAgICBpdGVtLmluZGV4Kys7XG4gICAgICAgIGlmKGl0ZW0ub25Qcm9ncmVzcyAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpdGVtLm9uUHJvZ3Jlc3MuY2FsbChpdGVtLmNhbGxlcixpdGVtLmluZGV4LGl0ZW0udXJscy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZE9uY2UodXJsLCB0aGlzLnN0YXJ0TG9hZCwgaXRlbSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkT25jZSh1cmwgOiBhbnksIGNhbGxCYWNrIDogKGl0ZW0gOiBsb2FkSXRlbSkgPT4gdm9pZCxpdGVtIDogbG9hZEl0ZW0pIDogdm9pZFxuICAgIHtcbiAgICAgICAgaWYodXJsIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgICB7XG4gICAgICAgICAgICB1cmwgPSB1cmwudXJsO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0eXBlIDogc3RyaW5nID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLicpICsgMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IGYgID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKHBhcl9jYWxsQmsscGFyX3RoaXMscGFyX2l0ZW0scGFyX3VybCkgOiB2b2lke1xuICAgICAgICAgICAgcGFyX2NhbGxCay5jYWxsKHBhcl90aGlzLHBhcl9pdGVtKTtcbiAgICAgICAgfSxbY2FsbEJhY2ssdGhpcyxpdGVtLHVybF0pO1xuICAgICAgICBzd2l0Y2godHlwZSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSBcInBuZ1wiOlxuICAgICAgICAgICAgICAgIGlmKHVybC5pbmRleE9mKFwidGV4dHVyZS9cIikgPT0gLTEpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUE5HKHVybCxmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHR1cmUodXJsLGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJza1wiOlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFNwaW5lKHVybCwgZik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibGhcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRNb2RlbCh1cmwsIGYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICAgIGNhc2UgXCJsYW5nXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSnNvbih1cmwsZik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYXRsYXNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRBdGxhcyh1cmwsZik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYW5pXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQW5pbWF0aW9uKHVybCwgbnVsbCwgZik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZCh1cmwsZik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVVJJIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHVibGljIHN0YXRpYyBwcmVmYWJVcmwgID0gXCJwcmVmYWIvXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNwaW5lVXJsICA9IFwicmVzL3NwaW5lL1wiO1xyXG4gICAgcHVibGljIHN0YXRpYyBzb3VuZFVybCAgPSBcInNvdW5kL1wiO1xyXG59IiwiLyoqXHJcbiAqIOWtkOW8ueiEmuacrO+8jOWunueOsOWtkOW8uemjnuihjOmAu+i+keWPiuWvueixoeaxoOWbnuaUtuacuuWItlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVsbGV0IGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL+iuvue9ruWIneWni+mAn+W6plxyXG4gICAgICAgIHZhciByaWc6IExheWEuUmlnaWRCb2R5ID0gdGhpcy5vd25lci5nZXRDb21wb25lbnQoTGF5YS5SaWdpZEJvZHkpO1xyXG4gICAgICAgIHJpZy5zZXRWZWxvY2l0eSh7IHg6IDAsIHk6IC0xMCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblRyaWdnZXJFbnRlcihvdGhlcjogYW55LCBzZWxmOiBhbnksIGNvbnRhY3Q6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIC8v5aaC5p6c6KKr56Kw5Yiw77yM5YiZ56e76Zmk5a2Q5by5XHJcbiAgICAgICAgdGhpcy5vd25lci5yZW1vdmVTZWxmKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy/lpoLmnpzlrZDlvLnotoXlh7rlsY/luZXvvIzliJnnp7vpmaTlrZDlvLlcclxuICAgICAgICBpZiAoKHRoaXMub3duZXIgYXMgTGF5YS5TcHJpdGUpLnkgPCAtMTApIHtcclxuICAgICAgICAgICAgdGhpcy5vd25lci5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL+WtkOW8ueiiq+enu+mZpOaXtu+8jOWbnuaUtuWtkOW8ueWIsOWvueixoeaxoO+8jOaWueS+v+S4i+asoeWkjeeUqO+8jOWHj+WwkeWvueixoeWIm+W7uuW8gOmUgFxyXG4gICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFwiYnVsbGV0XCIsIHRoaXMub3duZXIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWVVSSBmcm9tIFwiLi9HYW1lVUlcIjtcclxuLyoqXHJcbiAqIOaOieiQveebkuWtkOiEmuacrO+8jOWunueOsOebkuWtkOeisOaSnuWPiuWbnuaUtua1geeoi1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcEJveCBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIC8qKuebkuWtkOetiee6pyAqL1xyXG4gICAgbGV2ZWw6IG51bWJlciA9IDE7XHJcbiAgICAvKirnrYnnuqfmlofmnKzlr7nosaHlvJXnlKggKi9cclxuICAgIHByaXZhdGUgX3RleHQ6IExheWEuVGV4dDtcclxuICAgIC8qKuWImuS9k+WvueixoeW8leeUqCAqL1xyXG4gICAgcHJpdmF0ZSBfcmlnOiBMYXlhLlJpZ2lkQm9keVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICAvKirojrflvpfnu4Tku7blvJXnlKjvvIzpgb/lhY3mr4/mrKHojrflj5bnu4Tku7bluKbmnaXkuI3lv4XopoHnmoTmn6Xor6LlvIDplIAgKi9cclxuICAgICAgICB0aGlzLl9yaWcgPSB0aGlzLm93bmVyLmdldENvbXBvbmVudChMYXlhLlJpZ2lkQm9keSk7XHJcbiAgICAgICAgdGhpcy5sZXZlbCA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDUpICsgMTtcclxuICAgICAgICB0aGlzLl90ZXh0ID0gdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZShcImxldmVsVHh0XCIpIGFzIExheWEuVGV4dDtcclxuICAgICAgICB0aGlzLl90ZXh0LnRleHQgPSB0aGlzLmxldmVsICsgXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvL+iuqeaMgee7reebkuWtkOaXi+i9rFxyXG4gICAgICAgICh0aGlzLm93bmVyIGFzIExheWEuU3ByaXRlKS5yb3RhdGlvbisrO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVHJpZ2dlckVudGVyKG90aGVyOiBhbnksIHNlbGY6IGFueSwgY29udGFjdDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdmFyIG93bmVyOiBMYXlhLlNwcml0ZSA9IHRoaXMub3duZXIgYXMgTGF5YS5TcHJpdGU7XHJcbiAgICAgICAgaWYgKG90aGVyLmxhYmVsID09PSBcImJ1dHRsZVwiKSB7XHJcbiAgICAgICAgICAgIC8v56Kw5pKe5Yiw5a2Q5by55ZCO77yM5aKe5Yqg56ev5YiG77yM5pKt5pS+5aOw6Z+z54m55pWIXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxldmVsID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZXZlbC0tO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dC5jaGFuZ2VUZXh0KHRoaXMubGV2ZWwgKyBcIlwiKTtcclxuICAgICAgICAgICAgICAgIG93bmVyLmdldENvbXBvbmVudChMYXlhLlJpZ2lkQm9keSkuc2V0VmVsb2NpdHkoeyB4OiAwLCB5OiAtMTAgfSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoXCJzb3VuZC9oaXQud2F2XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyLnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZmZlY3Q6IExheWEuQW5pbWF0aW9uID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcImVmZmVjdFwiLCB0aGlzLmNyZWF0ZUVmZmVjdCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0LnBvcyhvd25lci54LCBvd25lci55KTtcclxuICAgICAgICAgICAgICAgICAgICBvd25lci5wYXJlbnQuYWRkQ2hpbGQoZWZmZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICBlZmZlY3QucGxheSgwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBvd25lci5yZW1vdmVTZWxmKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFwic291bmQvZGVzdHJveS53YXZcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgR2FtZVVJLmluc3RhbmNlLmFkZFNjb3JlKDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3RoZXIubGFiZWwgPT09IFwiZ3JvdW5kXCIpIHtcclxuICAgICAgICAgICAgLy/lj6ropoHmnInkuIDkuKrnm5LlrZDnorDliLDlnLDmnb/vvIzliJnlgZzmraLmuLjmiI9cclxuICAgICAgICAgICAgb3duZXIucmVtb3ZlU2VsZigpO1xyXG4gICAgICAgICAgICBHYW1lVUkuaW5zdGFuY2Uuc3RvcEdhbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5L2/55So5a+56LGh5rGg5Yib5bu654iG54K45Yqo55S7ICovXHJcbiAgICBjcmVhdGVFZmZlY3QoKTogTGF5YS5BbmltYXRpb24ge1xyXG4gICAgICAgIGxldCBhbmk6IExheWEuQW5pbWF0aW9uID0gbmV3IExheWEuQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgYW5pLmxvYWRBbmltYXRpb24oXCJ0ZXN0L1Rlc3RBbmkuYW5pXCIpO1xyXG4gICAgICAgIGFuaS5vbihMYXlhLkV2ZW50LkNPTVBMRVRFLCBudWxsLCByZWNvdmVyKTtcclxuICAgICAgICBmdW5jdGlvbiByZWNvdmVyKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBhbmkucmVtb3ZlU2VsZigpO1xyXG4gICAgICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcImVmZmVjdFwiLCBhbmkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICAvL+ebkuWtkOiiq+enu+mZpOaXtu+8jOWbnuaUtuebkuWtkOWIsOWvueixoeaxoO+8jOaWueS+v+S4i+asoeWkjeeUqO+8jOWHj+WwkeWvueixoeWIm+W7uuW8gOmUgOOAglxyXG4gICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFwiZHJvcEJveFwiLCB0aGlzLm93bmVyKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgRHJvcEJveCBmcm9tIFwiLi9Ecm9wQm94XCI7XHJcbmltcG9ydCBCdWxsZXQgZnJvbSBcIi4vQnVsbGV0XCI7XHJcbi8qKlxyXG4gKiDmuLjmiI/mjqfliLbohJrmnKzjgILlrprkuYnkuoblh6DkuKpkcm9wQm9477yMYnVsbGV077yMY3JlYXRlQm94SW50ZXJ2YWznrYnlj5jph4/vvIzog73lpJ/lnKhJREXmmL7npLrlj4rorr7nva7or6Xlj5jph49cclxuICog5pu05aSa57G75Z6L5a6a5LmJ77yM6K+35Y+C6ICD5a6Y5pa55paH5qGjXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29udHJvbCBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpkcm9wQm94LHRpcHM6XCLmjonokL3lrrnlmajpooTliLbkvZPlr7nosaFcIix0eXBlOlByZWZhYn0qL1xyXG4gICAgZHJvcEJveDogTGF5YS5QcmVmYWI7XHJcbiAgICAvKiogQHByb3Age25hbWU6YnVsbGV0LHRpcHM6XCLlrZDlvLnpooTliLbkvZPlr7nosaFcIix0eXBlOlByZWZhYn0qL1xyXG4gICAgYnVsbGV0OiBMYXlhLlByZWZhYjtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpjcmVhdGVCb3hJbnRlcnZhbCx0aXBzOlwi6Ze06ZqU5aSa5bCR5q+r56eS5Yib5bu65LiA5Liq5LiL6LeM55qE5a655ZmoXCIsdHlwZTppbnQsZGVmYXVsdDoxMDAwfSovXHJcbiAgICBjcmVhdGVCb3hJbnRlcnZhbDogbnVtYmVyID0gMTAwMDtcclxuICAgIC8qKuW8gOWni+aXtumXtCovXHJcbiAgICBwcml2YXRlIF90aW1lOiBudW1iZXIgPSAwO1xyXG4gICAgLyoq5piv5ZCm5bey57uP5byA5aeL5ri45oiPICovXHJcbiAgICBwcml2YXRlIF9zdGFydGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAvKirlrZDlvLnlkoznm5LlrZDmiYDlnKjnmoTlrrnlmajlr7nosaEgKi9cclxuICAgIHByaXZhdGUgX2dhbWVCb3g6IExheWEuU3ByaXRlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcblxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fdGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJveCA9IHRoaXMub3duZXIuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1lQm94XCIpIGFzIExheWEuU3ByaXRlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8v5q+P6Ze06ZqU5LiA5q615pe26Ze05Yib5bu65LiA5Liq55uS5a2QXHJcbiAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgICAgaWYgKG5vdyAtIHRoaXMuX3RpbWUgPiB0aGlzLmNyZWF0ZUJveEludGVydmFsJiZ0aGlzLl9zdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQm94KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUJveCgpOiB2b2lkIHtcclxuICAgICAgICAvL+S9v+eUqOWvueixoeaxoOWIm+W7uuebkuWtkFxyXG4gICAgICAgIGxldCBib3g6IExheWEuU3ByaXRlID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcImRyb3BCb3hcIiwgdGhpcy5kcm9wQm94LmNyZWF0ZSwgdGhpcy5kcm9wQm94KTtcclxuICAgICAgICBib3gucG9zKE1hdGgucmFuZG9tKCkgKiAoTGF5YS5zdGFnZS53aWR0aCAtIDEwMCksIC0xMDApO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCb3guYWRkQ2hpbGQoYm94KTtcclxuICAgIH1cclxuXHJcbiAgICBvblN0YWdlQ2xpY2soZTogTGF5YS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIC8v5YGc5q2i5LqL5Lu25YaS5rOh77yM5o+Q6auY5oCn6IO977yM5b2T54S25Lmf5Y+v5Lul5LiN6KaBXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAvL+iInuWPsOiiq+eCueWHu+WQju+8jOS9v+eUqOWvueixoeaxoOWIm+W7uuWtkOW8uVxyXG4gICAgICAgIGxldCBmbHllcjogTGF5YS5TcHJpdGUgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiYnVsbGV0XCIsIHRoaXMuYnVsbGV0LmNyZWF0ZSwgdGhpcy5idWxsZXQpO1xyXG4gICAgICAgIGZseWVyLnBvcyhMYXlhLnN0YWdlLm1vdXNlWCwgTGF5YS5zdGFnZS5tb3VzZVkpO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCb3guYWRkQ2hpbGQoZmx5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuW8gOWni+a4uOaIj++8jOmAmui/h+a/gOa0u+acrOiEmuacrOaWueW8j+W8gOWni+a4uOaIjyovXHJcbiAgICBzdGFydEdhbWUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirnu5PmnZ/muLjmiI/vvIzpgJrov4fpnZ7mv4DmtLvmnKzohJrmnKzlgZzmraLmuLjmiI8gKi9cclxuICAgIHN0b3BHYW1lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUJveEludGVydmFsID0gMTAwMDtcclxuICAgICAgICB0aGlzLl9nYW1lQm94LnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5pbXBvcnQgR2FtZUNvbnRyb2wgZnJvbSBcIi4vR2FtZUNvbnRyb2xcIlxyXG4vKipcclxuICog5pys56S65L6L6YeH55So6Z2e6ISa5pys55qE5pa55byP5a6e546w77yM6ICM5L2/55So57un5om/6aG16Z2i5Z+657G777yM5a6e546w6aG16Z2i6YC76L6R44CC5ZyoSURF6YeM6Z2i6K6+572u5Zy65pmv55qEUnVudGltZeWxnuaAp+WNs+WPr+WSjOWcuuaZr+i/m+ihjOWFs+iBlFxyXG4gKiDnm7jmr5TohJrmnKzmlrnlvI/vvIznu6fmib/lvI/pobXpnaLnsbvvvIzlj6/ku6Xnm7TmjqXkvb/nlKjpobXpnaLlrprkuYnnmoTlsZ7mgKfvvIjpgJrov4dJREXlhoV2YXLlsZ7mgKflrprkuYnvvInvvIzmr5TlpoJ0aGlzLnRpcExibGzvvIx0aGlzLnNjb3JlTGJs77yM5YW35pyJ5Luj56CB5o+Q56S65pWI5p6cXHJcbiAqIOW7uuiuru+8muWmguaenOaYr+mhtemdoue6p+eahOmAu+i+ke+8jOmcgOimgemikee5geiuv+mXrumhtemdouWGheWkmuS4quWFg+e0oO+8jOS9v+eUqOe7p+aJv+W8j+WGmeazle+8jOWmguaenOaYr+eLrOeri+Wwj+aooeWdl++8jOWKn+iDveWNleS4gO+8jOW7uuiurueUqOiEmuacrOaWueW8j+WunueOsO+8jOavlOWmguWtkOW8ueiEmuacrOOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVVJIGV4dGVuZHMgdWkudGVzdC5UZXN0U2NlbmVVSSB7XHJcbiAgICAvKirorr7nva7ljZXkvovnmoTlvJXnlKjmlrnlvI/vvIzmlrnkvr/lhbbku5bnsbvlvJXnlKggKi9cclxuICAgIHN0YXRpYyBpbnN0YW5jZTogR2FtZVVJO1xyXG4gICAgLyoq5b2T5YmN5ri45oiP56ev5YiG5a2X5q61ICovXHJcbiAgICBwcml2YXRlIF9zY29yZTogbnVtYmVyO1xyXG4gICAgLyoq5ri45oiP5o6n5Yi26ISa5pys5byV55So77yM6YG/5YWN5q+P5qyh6I635Y+W57uE5Lu25bim5p2l5LiN5b+F6KaB55qE5oCn6IO95byA6ZSAICovXHJcbiAgICBwcml2YXRlIF9jb250cm9sOiBHYW1lQ29udHJvbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIEdhbWVVSS5pbnN0YW5jZSA9IHRoaXM7XHJcbiAgICAgICAgLy/lhbPpl63lpJrngrnop6bmjqfvvIzlkKbliJnlsLHml6DmlYzkuoZcclxuICAgICAgICBMYXlhLk1vdXNlTWFuYWdlci5tdWx0aVRvdWNoRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2wgPSB0aGlzLmdldENvbXBvbmVudChHYW1lQ29udHJvbCk7XHJcbiAgICAgICAgLy/ngrnlh7vmj5DnpLrmloflrZfvvIzlvIDlp4vmuLjmiI9cclxuICAgICAgICB0aGlzLnRpcExibGwub24oTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy5vblRpcENsaWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBvblRpcENsaWNrKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRpcExibGwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3Njb3JlID0gMDtcclxuICAgICAgICB0aGlzLnNjb3JlTGJsLnRleHQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2wuc3RhcnRHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5aKe5Yqg5YiG5pWwICovXHJcbiAgICBhZGRTY29yZSh2YWx1ZTogbnVtYmVyID0gMSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3Njb3JlICs9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2NvcmVMYmwuY2hhbmdlVGV4dChcIuWIhuaVsO+8mlwiICsgdGhpcy5fc2NvcmUpO1xyXG4gICAgICAgIC8v6ZqP552A5YiG5pWw6LaK6auY77yM6Zq+5bqm5aKe5aSnXHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRyb2wuY3JlYXRlQm94SW50ZXJ2YWwgPiA2MDAgJiYgdGhpcy5fc2NvcmUgJSAyMCA9PSAwKSB0aGlzLl9jb250cm9sLmNyZWF0ZUJveEludGVydmFsIC09IDIwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWBnOatoua4uOaIjyAqL1xyXG4gICAgc3RvcEdhbWUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50aXBMYmxsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGlwTGJsbC50ZXh0ID0gXCLmuLjmiI/nu5PmnZ/kuobvvIzngrnlh7vlsY/luZXph43mlrDlvIDlp4tcIjtcclxuICAgICAgICB0aGlzLl9jb250cm9sLnN0b3BHYW1lKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sbGVyQmFzZSBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9jb250cm9sbGVyT2JqcyA9IHt9O1xyXG4gICAgcHVibGljIGdldFNpZ24oKSA6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzW1wiX19wcm90b19fXCJdLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlPFQ+KGMgOiBuZXcoKSA9PiBUKSA6IFRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICBsZXQgc2lnbiA9IGNbXCJuYW1lXCJdO1xyXG4gICAgLy8gICAgIGxldCBpdGVtID0gQ29udHJvbGxlckJhc2UuX2NvbnRyb2xsZXJPYmpzW3NpZ25dO1xyXG4gICAgLy8gICAgIGlmKGl0ZW0gPT0gbnVsbClcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIGl0ZW0gPSBuZXcgYygpO1xyXG4gICAgLy8gICAgICAgICBDb250cm9sbGVyQmFzZS5fY29udHJvbGxlck9ianNbc2lnbl0gPSBpdGVtO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICByZXR1cm4gaXRlbTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdygpIDogdm9pZHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKCkgOiB2b2lke1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpIDogdm9pZHtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCBDb250cm9sbGVyQmFzZSBmcm9tIFwiLi9Db250cm9sbGVyQmFzZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlck1nciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfY29udHJvbGxlck9ianMgPSB7fTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2U8VCBleHRlbmRzIENvbnRyb2xsZXJCYXNlPihjIDogbmV3KCkgPT4gVCkgOiBUXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHNpZ24gPSBjW1wibmFtZVwiXTtcclxuICAgICAgICBsZXQgaXRlbSA9IENvbnRyb2xsZXJNZ3IuX2NvbnRyb2xsZXJPYmpzW3NpZ25dO1xyXG4gICAgICAgIGlmKGl0ZW0gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBuZXcgYygpO1xyXG4gICAgICAgICAgICBDb250cm9sbGVyTWdyLl9jb250cm9sbGVyT2Jqc1tzaWduXSA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvbnRyb2xsZXJCYXNlIGZyb20gXCIuL0NvbnRyb2xsZXJCYXNlXCI7XHJcbmltcG9ydCBQbGF5ZXJJbmZvIGZyb20gXCIuLi9tb2RlbC9QbGF5ZXJJbmZvXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJDb250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlckJhc2Uge1xyXG4gICAgcHVibGljIG15UGxheWVySW5mbyA9IG5ldyBQbGF5ZXJJbmZvKCk7XHJcbn0iLCJpbXBvcnQgQ29udHJvbGxlckJhc2UgZnJvbSBcIi4vQ29udHJvbGxlckJhc2VcIjtcclxuaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4uLy4uL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IFRpcEl0ZW0gZnJvbSBcIi4uL3ByZWZlYi9UaXBJdGVtXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaXBDb250cm9sbGVyIGV4dGVuZHMgQ29udHJvbGxlckJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfdGlwU3ByIDogTGF5YS5TcHJpdGU7XHJcbiAgICBwdWJsaWMgZ2V0IHRpcFNwcigpIDogTGF5YS5TcHJpdGVcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGlwU3ByO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGluaXQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLl90aXBTcHIgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICB0aGlzLl90aXBTcHIubmFtZSA9IFwiVGlwU3ByXCI7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl90aXBTcHIpO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoXCJwcmVmYWIvVGlwSXRlbS5qc29uXCIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Mb2FkVGlwSXRlbUNvbXBsZXRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdGlwSXRlbVByZWZhYiA6IExheWEuUHJlZmFiO1xyXG4gICAgcHJpdmF0ZSBvbkxvYWRUaXBJdGVtQ29tcGxldGUoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fdGlwSXRlbVByZWZhYiA9IG5ldyBMYXlhLlByZWZhYigpO1xyXG4gICAgICAgIHRoaXMuX3RpcEl0ZW1QcmVmYWIuanNvbiA9IExheWEubG9hZGVyLmdldFJlcyhcInByZWZhYi9UaXBJdGVtLmpzb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbGFiZWxzIDogTGF5YS5MYWJlbFtdID0gW107XHJcbiAgICBwcml2YXRlIF9zdGFydFkgPSA5NjA7XHJcbiAgICBwdWJsaWMgc2hvd0xlZnRCb3R0b21UaXAodGV4dCA6IHN0cmluZykgOiB2b2lke1xyXG4gICAgICAgIGxldCBsYWJlbCA9IG5ldyBMYXlhLkxhYmVsKCk7XHJcbiAgICAgICAgbGFiZWwuY29sb3IgPSBcIiMyMDQ4MDBcIjtcclxuICAgICAgICBsYWJlbC50ZXh0ID0gdGV4dDtcclxuICAgICAgICBsYWJlbC5mb250ID0gXCJTaW1IZWlcIjtcclxuICAgICAgICBsYWJlbC5mb250U2l6ZSA9IDMwO1xyXG4gICAgICAgIGxhYmVsLmFuY2hvclkgPSAxO1xyXG4gICAgICAgIGxhYmVsLnkgPSB0aGlzLl9zdGFydFk7XHJcbiAgICAgICAgdGhpcy5fdGlwU3ByLmFkZENoaWxkKGxhYmVsKTtcclxuICAgICAgICB0aGlzLl9sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgdGhpcy5zb3J0TGFiZWxzKCk7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgTGF5YS5Ud2Vlbi50byhsYWJlbCx7YWxwaGEgOiAwfSwzMDApXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDEzMDAsdGhpcywgZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhYmVscy5zcGxpY2UodGhpcy5fbGFiZWxzLmluZGV4T2YobGFiZWwpLDEpXHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXJBbGwobGFiZWwpO1xyXG4gICAgICAgICAgICBsYWJlbC5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzb3J0TGFiZWxzKCkgOiB2b2lke1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlcjsgaSA8IHRoaXMuX2xhYmVscy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IHRoaXMuX2xhYmVsc1tpXTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldFkgPSB0aGlzLl9zdGFydFkgLSA0MCAqIGk7XHJcbiAgICAgICAgICAgIExheWEuVHdlZW4udG8obGFiZWwse3kgOiB0YXJnZXRZfSwxMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF90aXBJdGVtcyA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfdGlwSXRlbVN0YXJ0WSAgPSA1NTA7XHJcbiAgICBwdWJsaWMgc2hvd1RpcCh0eHQgOiBzdHJpbmcpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl90aXBJdGVtUHJlZmFiICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdGlwSXRlbVNwciA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJUaXBJdGVtXCIsdGhpcy5fdGlwSXRlbVByZWZhYi5jcmVhdGUsdGhpcy5fdGlwSXRlbVByZWZhYik7XHJcbiAgICAgICAgICAgIGxldCB0aXBJdGVtU2NyaXB0ID0gdGlwSXRlbVNwci5nZXRDb21wb25lbnQoVGlwSXRlbSkgYXMgVGlwSXRlbTtcclxuICAgICAgICAgICAgdGlwSXRlbVNjcmlwdC50ZXh0ID0gdHh0O1xyXG4gICAgICAgICAgICB0aGlzLl90aXBTcHIuYWRkQ2hpbGQodGlwSXRlbVNwcik7XHJcbiAgICAgICAgICAgIHRpcEl0ZW1TcHIueCA9IChHYW1lQ29uZmlnLndpZHRoIC0gdGlwSXRlbVNwci53aWR0aCkgLyAyO1xyXG4gICAgICAgICAgICB0aXBJdGVtU3ByLnkgPSB0aGlzLl90aXBJdGVtU3RhcnRZIC0gNjA7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpcEl0ZW1zLnB1c2godGlwSXRlbVNwcik7XHJcbiAgICAgICAgICAgIHRoaXMuc29ydFRpcEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlR3ZWVuLnRvKHRpcEl0ZW1TcHIse2FscGhhIDogMH0sMzAwKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEzMDAsdGhpcywgZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aXBJdGVtcy5zcGxpY2UodGhpcy5fdGlwSXRlbXMuaW5kZXhPZih0aXBJdGVtU3ByKSwxKVxyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhckFsbCh0aXBJdGVtU3ByKTtcclxuICAgICAgICAgICAgICAgIHRpcEl0ZW1TcHIuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzb3J0VGlwSXRlbXMoKSA6IHZvaWR7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMuX3RpcEl0ZW1zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5fdGlwSXRlbXNbaV07XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRZID0gdGhpcy5fdGlwSXRlbVN0YXJ0WSAtIDYwICogKHRoaXMuX3RpcEl0ZW1zLmxlbmd0aCAtIGkpO1xyXG4gICAgICAgICAgICBMYXlhLlR3ZWVuLnRvKGxhYmVsLHt5IDogdGFyZ2V0WX0sMTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIlxyXG5pbXBvcnQgTW9kZWxCYXNlIGZyb20gXCIuL01vZGVsQmFzZVwiO1xyXG5pbXBvcnQgeyBSZXNNZ3IgfSBmcm9tIFwiLi4vLi4vUmVzTWdyXCI7XHJcbmltcG9ydCBVUkkgZnJvbSBcIi4uLy4uL1VSSVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBGb250SW5mbyBleHRlbmRzIE1vZGVsQmFzZXtcclxuICAgIHB1YmxpYyBzdGF0aWMgRGF0YVNvdXJjZSA6IG9iamVjdDtcclxuICAgIHByaXZhdGUgc3RhdGljIF9ncm91cENhY2hlID0ge307XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEdyb3VwKGZvbnQgOiBzdHJpbmcpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICBpZihNYXBGb250SW5mby5fZ3JvdXBDYWNoZVtmb250XSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImdyb3VwXCJdLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEdyb3VwID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImdyb3VwXCJdW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEdyb3VwLmluZGV4T2YoZm9udCkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2godGVtcEdyb3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBNYXBGb250SW5mby5fZ3JvdXBDYWNoZVtmb250XSA9IGFycjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLl9ncm91cENhY2hlW2ZvbnRdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xyXG4gICAgcHVibGljIHRleHQgOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3RydWN0SW5mbyA6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgeCA6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5IDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfcXVhbGl0eSA6IG51bWJlciA9IDE7XHJcbiAgICBwdWJsaWMgZ2V0IHF1YWxpdHkgKCkgOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1YWxpdHk7XHJcbiAgICB9XHJcbiAgICAvLzEsMiwzLDQg5Yid5aeL5Li6Me+8jOayoeWQiOaIkOS4gOasoeWNh+e6p++8jOacgOmrmDTnuqdcclxuICAgIHB1YmxpYyBzZXQgcXVhbGl0eSh2YWx1ZSA6IG51bWJlcikgXHJcbiAgICB7XHJcbiAgICAgICAgaWYodmFsdWUgPiA0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFsdWUgPSA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9xdWFsaXR5ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBfcG9vbCA9IFtdO1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZGF0YT8gOiBPYmplY3QpIDogTWFwRm9udEluZm9cclxuICAgIHtcclxuICAgICAgICBpZihBcHBDb25maWcucG9vbHNbJ01hcEZvbnRJbmZvJ10gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwRm9udEluZm8nXSA9IHtzaWduIDogJ01hcEZvbnRJbmZvJywgcG9vbCA6IE1hcEZvbnRJbmZvLl9wb29sLCBjcmVhdGVDb3VudCA6IDAsIHJlY292ZXJDb3VudCA6IDB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcEZvbnRJbmZvJ10uY3JlYXRlQ291bnQgKys7XHJcbiAgICAgICAgbGV0IGNvdXQ7XHJcbiAgICAgICAgaWYoTWFwRm9udEluZm8uX3Bvb2wubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQgPSBNYXBGb250SW5mby5fcG9vbC5wb3AoKTtcclxuICAgICAgICAgICAgY291dC5pc1JlY292ZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQgPSBuZXcgTWFwRm9udEluZm8oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICBjb3V0LnNldERhdGFCeUtleShkYXRhKVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9oZUNoZW5nQ2ladU9iaiA9IHt9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKblj6/lkIjmiJDor43nu4RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjYW5IZUNoZW5nR3JvdXAoKSA6IGJvb2xlYW57XHJcbiAgICAgICAgaWYoTWFwRm9udEluZm8uX2hlQ2hlbmdDaVp1T2JqW3RoaXMudGV4dF0gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb3V0ID0gW107XHJcbiAgICAgICAgICAgIE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJncm91cFwiXS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudC5pbmRleE9mKHRoaXMudGV4dCkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291dC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTWFwRm9udEluZm8uX2hlQ2hlbmdDaVp1T2JqW3RoaXMudGV4dF0gPSBjb3V0O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLl9oZUNoZW5nQ2ladU9ialt0aGlzLnRleHRdLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjYW5IZUNoZW5nR3JvdXBzKCkgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuY2FuSGVDaGVuZ0dyb3VwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hcEZvbnRJbmZvLl9oZUNoZW5nQ2ladU9ialt0aGlzLnRleHRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja5mb250SWQs5om+5Ye65L2/55So6L+Z5LiqaWTnmoTnu4TlkIjliJfooags5pyq5Lyg5YWlZm9udElk77yM5YiZ6L6T5Ye65omA5pyJ57uE5ZCI5YiX6KGoXHJcbiAgICAgKiBAcGFyYW0gaWQgZm9udCBpZFxyXG4gICAgICogQHBhcmFtIGlzRXhjZXB0U2VsZiDmmK/lkKbmjpLpmaToh6rlt7FcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFN0cnVjdEluZm9zKGZvbnRJZCA6IG51bWJlciA9IG51bGwsaXNFeGNlcHRTZWxmIDogYm9vbGVhbiA9IHRydWUpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICBsZXQgY291dCA9IFtdO1xyXG4gICAgICAgIGlmKGZvbnRJZCA9PSB0aGlzLmlkICYmIGlzRXhjZXB0U2VsZiA9PSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQucHVzaChmb250SWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnN0cnVjdEluZm8uc3BsaXQoXCIsXCIpLmZvckVhY2goZWxlbWVudCA9PntcclxuICAgICAgICAgICAgICAgIGlmKGZvbnRJZCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQgPT0gdGhpcy5pZC50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb3V0LnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNFeGNlcHRTZWxmICYmIGVsZW1lbnQgPT0gZm9udElkLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuc3BsaXQoXCJfXCIpLmluZGV4T2YoZm9udElkLnRvU3RyaW5nKCkpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291dC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaGVDaGVuZ0hhblppT2JqID0ge307XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWPr+WQiOaIkOWFtuS7luaxieWtkFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGNhbkhlQ2hlbmdGb250KCkgOiBib29sZWFue1xyXG4gICAgICAgIGlmKE1hcEZvbnRJbmZvLl9oZUNoZW5nSGFuWmlPYmpbdGhpcy50ZXh0XSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNvdXQgPSBbXTtcclxuICAgICAgICAgICAgTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRcIl0uZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZm9udEluZm8uc2V0RGF0YUJ5VmFsdWVBcnIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RydWN0SW5mb3MgPSBmb250SW5mby5nZXRTdHJ1Y3RJbmZvcyh0aGlzLmlkKTtcclxuICAgICAgICAgICAgICAgIGlmKHN0cnVjdEluZm9zLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291dC5wdXNoKGZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE1hcEZvbnRJbmZvLl9oZUNoZW5nSGFuWmlPYmpbdGhpcy50ZXh0XSA9IGNvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXBGb250SW5mby5faGVDaGVuZ0hhblppT2JqW3RoaXMudGV4dF0ubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNhbkhlQ2hlbmdGb250SW5mb3MoKSA6IE1hcEZvbnRJbmZvW117XHJcbiAgICAgICAgaWYodGhpcy5jYW5IZUNoZW5nRm9udClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXBGb250SW5mby5faGVDaGVuZ0hhblppT2JqW3RoaXMudGV4dF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuaYr+eJueaKgOagvOWtkO+8jOeJueaKgOagvOWtkO+8muiiq+a2iOmZpOaIluWQiOaIkOeahOaXtuWAme+8jOS8muinpuWPkeWxj+W5leS4iuaJgOacieaciei/meS4quaxieWtkOeahOagvOWtkOa2iOmZpFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNTdHVudEZvbnQgOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgX3N0dW50Rm9udEVmZmVjdCA6IExheWEuU2tlbGV0b247XHJcbiAgICBwdWJsaWMgZ2V0U3R1bnRGb250RWZmZWN0ICgpIDogTGF5YS5Ta2VsZXRvblxyXG4gICAgeyBcclxuICAgICAgICBpZighdGhpcy5pc1N0dW50Rm9udClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9zdHVudEZvbnRFZmZlY3QgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdCA9IFJlc01nci5JbnN0YW5jZSgpLmNyZWF0ZVNwaW5lKFVSSS5zcGluZVVybCArIFwib3RoZXJfd3VwaW5naHVhbnJhb19raW5fbGl0dGxlLnNrXCIsXCJhbmltYXRpb25cIix0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0LnggPSB0aGlzLl9zdHVudEZvbnRFZmZlY3QueSA9IDQ0O1xyXG4gICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3Quc2NhbGVYID0gdGhpcy5fc3R1bnRGb250RWZmZWN0LnNjYWxlWSA9IDEuMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0dW50Rm9udEVmZmVjdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveVN0dW50RWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX3N0dW50Rm9udEVmZmVjdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdC5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3QgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RydWN0KCkgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udF9zdHJ1Y3RcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY292ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmlzUmVjb3ZlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc3R1bnRGb250RWZmZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0LmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdCA9IG51bGw7XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBvb2xzWydNYXBGb250SW5mbyddID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcEZvbnRJbmZvJ10gPSB7c2lnbiA6ICdNYXBGb250SW5mbycsIHBvb2wgOiBNYXBGb250SW5mby5fcG9vbCwgY3JlYXRlQ291bnQgOiAwLCByZWNvdmVyQ291bnQgOiAwfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBGb250SW5mbyddLnJlY292ZXJDb3VudCArKztcclxuICAgICAgICBcclxuICAgICAgICBNYXBGb250SW5mby5fcG9vbC5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaXNSZWNvdmVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGF0YUJ5VmFsdWVBcnIoZGF0YUFycikgOiB2b2lke1xyXG4gICAgICAgIGxldCBmb250U3RydWN0ID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRfc3RydWN0XCJdO1xyXG4gICAgICAgIGxldCBvYmo7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IGRhdGFBcnIubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihmb250U3RydWN0Lmxlbmd0aCA+IGkpXHJcbiAgICAgICAgICAgICAgICB0aGlzW2ZvbnRTdHJ1Y3RbaV1dID0gZGF0YUFycltpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERhdGFCeUtleSh2YWx1ZSA6IG9iamVjdCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBvYmo7XHJcbiAgICAgICAgbGV0IGZvbnRTdHJ1Y3QgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udF9zdHJ1Y3RcIl07XHJcbiAgICAgICAgbGV0IGZvbnREYXRhcyA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250XCJdO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBmb250RGF0YXMubGVuZ3RoIDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGZvbnRBcnIgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udFwiXVtpXTtcclxuICAgICAgICAgICAgbGV0IGlzTWVldCA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvcihsZXQgdGVtcFByb3BlcnR5IGluIHZhbHVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih2YWx1ZVt0ZW1wUHJvcGVydHldICE9IGZvbnRBcnJbZm9udFN0cnVjdC5pbmRleE9mKHRlbXBQcm9wZXJ0eSldKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzTWVldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGlzTWVldClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2JqID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwOyBqIDwgZm9udFN0cnVjdC5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbZm9udFN0cnVjdFtqXV0gPSBmb250QXJyW2pdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIlxyXG5pbXBvcnQgTW9kZWxCYXNlIGZyb20gXCIuL01vZGVsQmFzZVwiO1xyXG5pbXBvcnQgTWFwRm9udEluZm8gZnJvbSBcIi4vTWFwRm9udEluZm9cIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwU3RhckluZm8gZXh0ZW5kcyBNb2RlbEJhc2V7XHJcbiAgICBwdWJsaWMgc3Rhcl9udW0gOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3BlZWRfcmF0ZSA6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzcGxpdF9yYXRlIDogbnVtYmVyO1xyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX3Bvb2wgPSBbXTtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRhdGE/IDogT2JqZWN0KSA6IE1hcFN0YXJJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBvb2xzWydNYXBTdGFySW5mbyddID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcFN0YXJJbmZvJ10gPSB7c2lnbiA6ICdNYXBTdGFySW5mbycsIHBvb2wgOiBNYXBTdGFySW5mby5fcG9vbCwgY3JlYXRlQ291bnQgOiAwLCByZWNvdmVyQ291bnQgOiAwfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBTdGFySW5mbyddLmNyZWF0ZUNvdW50ICsrO1xyXG4gICAgICAgIGxldCBjb3V0O1xyXG4gICAgICAgIGlmKE1hcFN0YXJJbmZvLl9wb29sLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0ID0gTWFwU3RhckluZm8uX3Bvb2wucG9wKCk7XHJcbiAgICAgICAgICAgIGNvdXQuaXNSZWNvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0ID0gbmV3IE1hcFN0YXJJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAgY291dC5zZXREYXRhQnlLZXkoZGF0YSlcclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RydWN0KCkgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXBGb250SW5mby5EYXRhU291cmNlW1wic3Rhcl9zdHJ1Y3RcIl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY292ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmlzUmVjb3ZlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBvb2xzWydNYXBTdGFySW5mbyddID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcFN0YXJJbmZvJ10gPSB7c2lnbiA6ICdNYXBTdGFySW5mbycsIHBvb2wgOiBNYXBTdGFySW5mby5fcG9vbCwgY3JlYXRlQ291bnQgOiAwLCByZWNvdmVyQ291bnQgOiAwfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBTdGFySW5mbyddLnJlY292ZXJDb3VudCArKztcclxuICAgICAgICBcclxuICAgICAgICBNYXBTdGFySW5mby5fcG9vbC5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaXNSZWNvdmVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGF0YUJ5S2V5KHZhbHVlIDogb2JqZWN0KSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IG9iajtcclxuICAgICAgICBsZXQgc3RydWN0ID0gdGhpcy5nZXRTdHJ1Y3QoKTtcclxuICAgICAgICBsZXQgZGF0YXMgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wic3RhclwiXTtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgZGF0YXMubGVuZ3RoIDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGZvbnRBcnIgPSBkYXRhc1tpXTtcclxuICAgICAgICAgICAgbGV0IGlzTWVldCA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvcihsZXQgdGVtcFByb3BlcnR5IGluIHZhbHVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih2YWx1ZVt0ZW1wUHJvcGVydHldICE9IGZvbnRBcnJbc3RydWN0LmluZGV4T2YodGVtcFByb3BlcnR5KV0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNNZWV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoaXNNZWV0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDA7IGogPCBzdHJ1Y3QubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW3N0cnVjdFtqXV0gPSBmb250QXJyW2pdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlbEJhc2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBtb2RlbElkSW5jcmVhc2UgOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfX19fX2lkIDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLl9fX19faWQgPSBNb2RlbEJhc2UubW9kZWxJZEluY3JlYXNlO1xyXG4gICAgICAgIE1vZGVsQmFzZS5tb2RlbElkSW5jcmVhc2UgKys7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIF9wb29sID0gW107XHJcbiAgICBwdWJsaWMgaXNSZWNvdmVyID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX3NpZ24gOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2V0RGF0YShvYmogOiBhbnkpIDogdm9pZHtcclxuICAgICAgICBsZXQgc3RydWN0ID0gdGhpcy5nZXRTdHJ1Y3QoKTtcclxuICAgICAgICBpZihvYmogaW5zdGFuY2VvZiBBcnJheSAmJiBzdHJ1Y3QgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBzdHJ1Y3QubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbc3RydWN0W2ldXSA9IG9ialtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCB0ZW1wUHJvIGluIG9iailcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpc1t0ZW1wUHJvXSA9IG9ialt0ZW1wUHJvXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RydWN0KCkgOiBzdHJpbmdbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0U2lnbigpIDogc3RyaW5nXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5fc2lnbiA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fc2lnbiA9IHRoaXNbXCJfX3Byb3RvX19cIl0uY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpZ247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoZGF0YT8gOiBPYmplY3QpIDogTW9kZWxCYXNlXHJcbiAgICB7XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBvb2xzWydNb2RlbEJhc2UnXSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNb2RlbEJhc2UnXSA9IHtzaWduIDogJ01vZGVsQmFzZScsIHBvb2wgOiBNb2RlbEJhc2UuX3Bvb2wsIGNyZWF0ZUNvdW50IDogMCwgcmVjb3ZlckNvdW50IDogMH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFwcENvbmZpZy5wb29sc1snTW9kZWxCYXNlJ10uY3JlYXRlQ291bnQgKys7XHJcbiAgICAgICAgbGV0IGNvdXQ7XHJcbiAgICAgICAgaWYoTW9kZWxCYXNlLl9wb29sLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0ID0gTW9kZWxCYXNlLl9wb29sLnBvcCgpO1xyXG4gICAgICAgICAgICBjb3V0LmlzUmVjb3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dCA9IG5ldyBNb2RlbEJhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICBjb3V0LnNldERhdGFCeUtleShkYXRhKVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5pc1JlY292ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wb29sc1snTW9kZWxCYXNlJ10gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5wb29sc1snTW9kZWxCYXNlJ10gPSB7c2lnbiA6ICdNb2RlbEJhc2UnLCBwb29sIDogTW9kZWxCYXNlLl9wb29sLCBjcmVhdGVDb3VudCA6IDAsIHJlY292ZXJDb3VudCA6IDB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHBDb25maWcucG9vbHNbJ01vZGVsQmFzZSddLnJlY292ZXJDb3VudCArKztcclxuICAgICAgICBcclxuICAgICAgICBNb2RlbEJhc2UuX3Bvb2wucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmlzUmVjb3ZlciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERhdGFCeUtleSh2YWx1ZSA6IG9iamVjdCkgOiB2b2lke1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IE1vZGVsQmFzZSBmcm9tIFwiLi9Nb2RlbEJhc2VcIjtcclxuaW1wb3J0IE1hcFN0YXJJbmZvIGZyb20gXCIuL01hcFN0YXJJbmZvXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXJJbmZvIGV4dGVuZHMgTW9kZWxCYXNlIHtcclxuICAgIHB1YmxpYyBuYW1lIDogc3RyaW5nID0gXCJ0ZXN0XCI7XHJcbiAgICBwdWJsaWMgdXJsIDogc3RyaW5nID0gXCJodHRwOi8vY2RuLmR1aXRhbmcuY29tL3VwbG9hZHMvaXRlbS8yMDE0MTAvMDgvMjAxNDEwMDgxNTAwMTVfZFA4eUoudGh1bWIuNzAwXzAuanBlZ1wiO1xyXG4gICAgcHJpdmF0ZSBfc3RhckluZm8gOiBNYXBTdGFySW5mbztcclxuICAgIHB1YmxpYyBnZXRTdGFySW5mbyhzY29yZSA6IG51bWJlcikgOiBNYXBTdGFySW5mb3tcclxuICAgICAgICBsZXQgc3Rhck51bTtcclxuICAgICAgICBpZihzY29yZSA8IDMwMDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFyTnVtID0wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNjb3JlIDwgODAwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXJOdW0gPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNjb3JlIDwgMTIwMDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFyTnVtID0gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzY29yZSA8IDMwMDAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3Rhck51bSA9IDM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2NvcmUgPCA2MDAwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXJOdW0gPSA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3Rhck51bSA9IDU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3N0YXJJbmZvID09IG51bGwgfHwgdGhpcy5fc3RhckluZm8uc3Rhcl9udW0gIT0gc3Rhck51bSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJJbmZvID0gTWFwU3RhckluZm8uY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3N0YXJJbmZvLnN0YXJfbnVtICE9IHN0YXJOdW0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJJbmZvLnNldERhdGFCeUtleSh7c3Rhcl9udW0gOiBzdGFyTnVtfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJJbmZvO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByZWZlYkJhc2UgZnJvbSBcIi4vUHJlZmViQmFzZVwiXHJcbmltcG9ydCB7IFJlc01nciB9IGZyb20gXCIuLi8uLi9SZXNNZ3JcIjtcclxuaW1wb3J0IFVSSSBmcm9tIFwiLi4vLi4vVVJJXCI7XHJcbmltcG9ydCBNYXBGb250SW5mbyBmcm9tIFwiLi4vbW9kZWwvTWFwRm9udEluZm9cIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9udEdyaWQgZXh0ZW5kcyBQcmVmZWJCYXNlIHtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpmb250LCB0aXBzOlwi5pi+56S65paH5a2XXCIsIHR5cGU6U3RyaW5nLCBkZWZhdWx0OlwiXCJ9Ki9cclxuICAgIHB1YmxpYyBmb250OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOm51bVR5cGUsIHRpcHM6XCLotKjph48g6JOdMe+8jOe6ojLvvIzntKsz77yM6YeRNFwiLCB0eXBlOk51bWJlciwgZGVmYXVsdDoxfSovXHJcbiAgICBwdWJsaWMgcXVhbGl0eTogbnVtYmVyID0gMTtcclxuXHJcbiAgICBwcml2YXRlIGNvbG9yQXJyID0gW1wiYmx1ZVwiLFwicmVkXCIsXCJwdXBsZVwiLFwieWVsbG93XCJdO1xyXG5cclxuICAgIHByaXZhdGUgX2VmZmVjdHMgOiBMYXlhLlNrZWxldG9uW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgYWRkRWZmZWN0KGVmZmVjdCA6IExheWEuU2tlbGV0b24pIDogdm9pZHtcclxuICAgICAgICBpZihlZmZlY3QgPT0gbnVsbClyZXR1cm47XHJcbiAgICAgICAgdGhpcy5vd25lci5hZGRDaGlsZChlZmZlY3QpO1xyXG4gICAgICAgIHRoaXMuX2VmZmVjdHMucHVzaChlZmZlY3QpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgY2xlYXJFZmZlY3RzKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2VmZmVjdHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vd25lci5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9lZmZlY3RzID0gW107XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG4gICAgXHJcbiAgICBvblVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaW1nX2JnID0gdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZShcImltZ19iZ1wiKSBhcyBMYXlhLkltYWdlO1xyXG4gICAgICAgIGlmKHRoaXMuZm9udCAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZShcInR4dFwiKVtcInRleHRcIl0gPSB0aGlzLmZvbnQ7XHJcbiAgICAgICAgICAgIGltZ19iZy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgaW1nX2JnLnNraW4gPSBcIm1hcC9pbWdfXCIrdGhpcy5nZXRRdWFsaXR5U2lnbigpK1wiR3JpZEJnLnBuZ1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIuZ2V0Q2hpbGRCeU5hbWUoXCJ0eHRcIilbXCJ0ZXh0XCJdID0gXCJcIjtcclxuICAgICAgICAgICAgaW1nX2JnLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFF1YWxpdHlTaWduKCkgOiBzdHJpbmd7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sb3JBcnJbdGhpcy5xdWFsaXR5IC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUmVzZXQoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5xdWFsaXR5ID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZWNvdmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBsYXlIZUNoZW5nRWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBzayA9IFJlc01nci5JbnN0YW5jZSgpLmNyZWF0ZVNwaW5lKFVSSS5zcGluZVVybCArIFwib3RoZXJfdGFvemh1YW5neGl0b25nMS5za1wiLFwiYW5pbWF0aW9uXCIsZmFsc2UpO1xyXG4gICAgICAgIHNrLnggPSBzay55ID0gNDQ7XHJcbiAgICAgICAgc2suc2NhbGVYID0gc2suc2NhbGVZID0gMS43O1xyXG4gICAgICAgIHRoaXMub3duZXIuYWRkQ2hpbGQoc2spO1xyXG4gICAgICAgIHNrLm9uKExheWEuRXZlbnQuU1RPUFBFRCwgdGhpcywgZnVuY3Rpb24gKHBhcl9zaykge1xyXG4gICAgICAgICAgICBwYXJfc2suZGVzdHJveSgpO1xyXG4gICAgICAgIH0sW3NrXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0KCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMucXVhbGl0eSA9IDE7XHJcbiAgICAgICAgdGhpcy5jbGVhckVmZmVjdHMoKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQcmVmZWJCYXNlIGZyb20gXCIuL1ByZWZlYkJhc2VcIjtcclxuaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lUmVzdWx0IGV4dGVuZHMgUHJlZmViQmFzZSB7XHJcbiAgICBwdWJsaWMgc2hvd0hvbWVIYW5kbGVyIDogTGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIHJlc3RhcnRIYW5kbGVyIDogTGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIHNjb3JlIDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyB0eHRfc2NvcmUgOiBMYXlhLlRleHQ7XHJcbiAgICBwdWJsaWMgaW1nX3JhbmtCZyA6IExheWEuSW1hZ2U7XHJcbiAgICBwdWJsaWMgdHh0X3Nob3dSYW5rIDogTGF5YS5UZXh0O1xyXG4gICAgcHVibGljIGJ0bl9ob21lIDogTGF5YS5CdXR0b247XHJcbiAgICBwdWJsaWMgYnRuX3RyeUFnYWluIDogTGF5YS5CdXR0b247XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xyXG4gICAgICAgIHRoaXMudHh0X3Njb3JlLnRleHQgPSB0aGlzLnNjb3JlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5idG5faG9tZS5jbGlja0hhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0hvbWVIYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgIH0sbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5idG5fdHJ5QWdhaW4uY2xpY2tIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0YXJ0SGFuZGxlci5ydW5XaXRoKDEpO1xyXG4gICAgICAgICAgICAgICAgd3hbXCJzaGFyZUFwcE1lc3NhZ2VcIl0oe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlIDogJ+aIkeWcqOi/meS4qua4uOaIj+mHjOmdouW+l+S6hicgKyB0aGlzLnNjb3JlICtcIuWIhlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsIDogXCJodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9pYVVWdXhBckU5TDlHMjhGNlhyeEtBSUV0Sk9zOXgxWWNtMk1ZbUMyVXo1VDlPNFJMcTBlanZHM2ljMktsVUJpYVZmLzBcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybElkIDogXCJOZWxlbkhQTFJYSzEtQVdFTm4wYVp3XCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0YXJ0SGFuZGxlci5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sbnVsbCxmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJ0bl9ob21lLm9mZkFsbCgpO1xyXG4gICAgICAgIHRoaXMuYnRuX3RyeUFnYWluLm9mZkFsbCgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByZWZlYkJhc2UgZnJvbSBcIi4vUHJlZmViQmFzZVwiO1xyXG5pbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIjtcclxuaW1wb3J0IENvbnRyb2xsZXJNZ3IgZnJvbSBcIi4uL2NvbnRyb2xsZXIvQ29udHJvbGxlck1nclwiO1xyXG5pbXBvcnQgVGlwQ29udHJvbGxlciBmcm9tIFwiLi4vY29udHJvbGxlci9UaXBDb250cm9sbGVyXCI7XHJcbmltcG9ydCBTb3VuZFRvb2wgZnJvbSBcIi4uL3Rvb2wvU291bmRUb29sXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lU2V0dGluZyBleHRlbmRzIFByZWZlYkJhc2Uge1xyXG4gICAgcHVibGljIHNob3dIb21lSGFuZGxlciA6IExheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyByZXN0YXJ0SGFuZGxlciA6IExheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvbkNsb3NlSGFuZGxlciA6IExheWEuSGFuZGxlcjtcclxuXHJcbiAgICBwdWJsaWMgcHJvZ3Jlc3NfbXVzaWMgOiBMYXlhLlByb2dyZXNzQmFyO1xyXG4gICAgcHVibGljIHByb2dyZXNzX2VmZmVjdCA6IExheWEuUHJvZ3Jlc3NCYXI7XHJcbiAgICBwdWJsaWMgYnRuX2hvbWUgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHB1YmxpYyBidG5fdHJ5QWdhaW4gOiBMYXlhLkJ1dHRvbjtcclxuICAgIHB1YmxpYyBidG5fc2hhcmUgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHB1YmxpYyBidG5fY2xvc2UgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHB1YmxpYyBidG5fbXVzaWMgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHB1YmxpYyBidG5fZWZmZWN0IDogTGF5YS5CdXR0b247XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xyXG4gICAgICAgIHRoaXMuYnRuX2hvbWUuY2xpY2tIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICB0aGlzLnNob3dIb21lSGFuZGxlci5ydW4oKTtcclxuICAgICAgICB9LG51bGwsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYnRuX3RyeUFnYWluLmNsaWNrSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0YXJ0SGFuZGxlci5ydW5XaXRoKDEpO1xyXG4gICAgICAgICAgICAgICAgd3hbXCJzaGFyZUFwcE1lc3NhZ2VcIl0oe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlIDogJ+WPkeeOsOacieS4quaciei2o+eahOa4uOaIjycsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmwgOiBcImh0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL2lhVVZ1eEFyRTlMOUcyOEY2WHJ4S0FJRXRKT3M5eDFZY20yTVltQzJVejVUOU80UkxxMGVqdkczaWMyS2xVQmlhVmYvMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsSWQgOiBcIk5lbGVuSFBMUlhLMS1BV0VObjBhWndcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RhcnRIYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmJ0bl9zaGFyZS5jbGlja0hhbmRsZXIgPSAoTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgICAgIC8vIGlmKGUudHlwZSAhPSBMYXlhLkV2ZW50Lk1PVVNFX1VQKXJldHVybjtcclxuICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd3hbXCJzaGFyZUFwcE1lc3NhZ2VcIl0oe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlIDogJ+WPkeeOsOacieS4quaciei2o+eahOa4uOaIjycsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmwgOiBcImh0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL2lhVVZ1eEFyRTlMOUcyOEY2WHJ4S0FJRXRKT3M5eDFZY20yTVltQzJVejVUOU80UkxxMGVqdkczaWMyS2xVQmlhVmYvMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsSWQgOiBcIk5lbGVuSFBMUlhLMS1BV0VObjBhWndcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFRpcENvbnRyb2xsZXIpLnNob3dUaXAoXCLlsL3mg4XmnJ/lvoVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgICAgICB0aGlzLmJ0bl9jbG9zZS5jbGlja0hhbmRsZXIgPSAoTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgICAgIC8vIGlmKGUudHlwZSAhPSBMYXlhLkV2ZW50Lk1PVVNFX1VQKXJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZUhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKSk7XHJcbiAgICAgICAgdGhpcy5idG5fbXVzaWMub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vbkRyYWdNb3VzZURvd24pO1xyXG4gICAgICAgIHRoaXMuYnRuX2VmZmVjdC5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLm9uRHJhZ01vdXNlRG93bik7XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2RyYWdUYXJnZXQgOiBMYXlhLkJ1dHRvblxyXG4gICAgb25EcmFnTW91c2VEb3duKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fZHJhZ1RhcmdldCA9IGUuY3VycmVudFRhcmdldCBhcyBMYXlhLkJ1dHRvbjtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfVVAsdGhpcyx0aGlzLm9uU3RhZ2VNb3VzZVVwMik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLm9uU3RhZ2VNb3VzZU1vdmUyKTtcclxuICAgIH1cclxuXHJcbiAgICBvblN0YWdlTW91c2VVcDIoZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9kcmFnVGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICBMYXlhLnN0YWdlLm9mZihMYXlhLkV2ZW50Lk1PVVNFX1VQLHRoaXMsdGhpcy5vblN0YWdlTW91c2VVcDIpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWEuRXZlbnQuTU9VU0VfTU9WRSx0aGlzLHRoaXMub25TdGFnZU1vdXNlTW92ZTIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3RhZ2VNb3VzZU1vdmUyKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gbmV3IExheWEuUG9pbnQoZS5zdGFnZVgsZS5zdGFnZVkpO1xyXG4gICAgICAgIGxldCBwcm9ncmVzcyA6IExheWEuUHJvZ3Jlc3NCYXI7XHJcbiAgICAgICAgaWYodGhpcy5fZHJhZ1RhcmdldCA9PSB0aGlzLmJ0bl9lZmZlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3NfZWZmZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzX211c2ljO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludCA9IHRoaXMuX2RyYWdUYXJnZXQucGFyZW50W1wiZ2xvYmFsVG9Mb2NhbFwiXShwb2ludCk7XHJcbiAgICAgICAgbGV0IHggPSBwb2ludC54IC0gcHJvZ3Jlc3MueCAtIHRoaXMuX2RyYWdUYXJnZXQud2lkdGggLyAyO1xyXG4gICAgICAgIGlmKHggPCAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHggPiBwcm9ncmVzcy53aWR0aCAtIHRoaXMuX2RyYWdUYXJnZXQud2lkdGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4ID0gcHJvZ3Jlc3Mud2lkdGggLSB0aGlzLl9kcmFnVGFyZ2V0LndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbnVtID0geCAvIChwcm9ncmVzcy53aWR0aCAtIHRoaXMuX2RyYWdUYXJnZXQud2lkdGgpO1xyXG4gICAgICAgIHByb2dyZXNzLnZhbHVlID0gbnVtO1xyXG4gICAgICAgIGlmKHByb2dyZXNzID09IHRoaXMucHJvZ3Jlc3NfZWZmZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU291bmRUb29sLnNldFNvdW5kVm9sdW1lKG51bSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTb3VuZFRvb2wuc2V0TXVzaWNWb2x1bWUobnVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2goKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc19lZmZlY3QudmFsdWUgPSBTb3VuZFRvb2wuZ2V0U291bmRWb2x1bWUoKTtcclxuICAgICAgICB0aGlzLmJ0bl9lZmZlY3QueCA9IHRoaXMucHJvZ3Jlc3NfZWZmZWN0LnggKyAodGhpcy5wcm9ncmVzc19lZmZlY3Qud2lkdGggLSB0aGlzLmJ0bl9lZmZlY3Qud2lkdGgpICogdGhpcy5wcm9ncmVzc19lZmZlY3QudmFsdWUgKyB0aGlzLmJ0bl9lZmZlY3Qud2lkdGgvMjtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc19tdXNpYy52YWx1ZSA9IFNvdW5kVG9vbC5nZXRNdXNpY1ZvbHVtZSgpO1xyXG4gICAgICAgIHRoaXMuYnRuX211c2ljLnggPSB0aGlzLnByb2dyZXNzX211c2ljLnggKyAodGhpcy5wcm9ncmVzc19tdXNpYy53aWR0aC0gdGhpcy5idG5fbXVzaWMud2lkdGgpICogdGhpcy5wcm9ncmVzc19tdXNpYy52YWx1ZSArIHRoaXMuYnRuX211c2ljLndpZHRoLzI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJ0bl9ob21lLm9mZkFsbCgpO1xyXG4gICAgICAgIHRoaXMuYnRuX3RyeUFnYWluLm9mZkFsbCgpO1xyXG4gICAgICAgIHRoaXMuYnRuX3NoYXJlLm9mZkFsbCgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlZmViQmFzZSBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9wcmVmZWIgOiBMYXlhLlByZWZhYjtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0UHJlZmViKHZhbHVlIDogTGF5YS5QcmVmYWIpe1xyXG4gICAgICAgIFByZWZlYkJhc2UuX3ByZWZlYiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMub3duZXIubnVtQ2hpbGRyZW47IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5vd25lci5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICBpZihlbGVtZW50Lm5hbWUgPT0gXCJcIiB8fCBlbGVtZW50Lm5hbWUuaW5kZXhPZihcIl9cIikgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB0ZW1wUHJvcGVydHlMaXN0ID0gZWxlbWVudC5uYW1lLnNwbGl0KFwiX1wiKTtcclxuICAgICAgICAgICAgc3dpdGNoKHRlbXBQcm9wZXJ0eUxpc3RbMF0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJsaXN0XCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHh0XCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaW1nXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYnRuXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJvZ3Jlc3NcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2VsZW1lbnQubmFtZV0gPSBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFByZWZlYigpIDogTGF5YS5QcmVmYWJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJlZmViO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U2lnbigpIDogc3RyaW5ne1xyXG4gICAgICAgIHJldHVybiB0aGlzW1wiX19wcm90b19fXCJdLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSgpIDogTGF5YS5TY3JpcHR7XHJcbiAgICAgICAgcmV0dXJuIExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oUHJlZmViQmFzZS5nZXRTaWduKCksUHJlZmViQmFzZS5fcHJlZmViLmNyZWF0ZSxQcmVmZWJCYXNlLl9wcmVmZWIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFByZWZlYkJhc2UuZ2V0U2lnbigpLHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgUHJlZmViQmFzZSBmcm9tIFwiLi9QcmVmZWJCYXNlXCI7XHJcbmltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiO1xyXG5pbXBvcnQgQ29udHJvbGxlck1nciBmcm9tIFwiLi4vY29udHJvbGxlci9Db250cm9sbGVyTWdyXCI7XHJcbmltcG9ydCBUaXBDb250cm9sbGVyIGZyb20gXCIuLi9jb250cm9sbGVyL1RpcENvbnRyb2xsZXJcIjtcclxuaW1wb3J0IFdYVG9vbCBmcm9tIFwiLi4vdG9vbC9XWFRvb2xcIjtcclxuaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4uLy4uL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IFBsYXllckNvbnRyb2xsZXIgZnJvbSBcIi4uL2NvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhcnRHYW1lIGV4dGVuZHMgUHJlZmViQmFzZSB7XHJcbiAgICBwdWJsaWMgaGFuZGxlcjogTGF5YS5IYW5kbGVyO1xyXG4gICAgcHVibGljIG9uU2hvd1JhbmsgOiBMYXlhLkhhbmRsZXI7XHJcbiAgICBwcml2YXRlIGJ0bl9zdGFydEdhbWUgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHByaXZhdGUgYnRuX3Nob3dSYW5rIDogTGF5YS5CdXR0b247XHJcbiAgICBwcml2YXRlIGJ0bl9zaGFyZSA6IExheWEuQnV0dG9uO1xyXG5cclxuICAgIHByaXZhdGUgX3JhbmtWaWV3IDogTGF5YS5XWE9wZW5EYXRhVmlld2VyO1xyXG4gICAgcHJpdmF0ZSBfd3hTdGFydEJ1dHRvblxyXG4gICAgLy8g5pu05aSa5Y+C5pWw6K+05piO6K+36K6/6ZeuOiBodHRwczovL2xkYzIubGF5YWJveC5jb20vZG9jLz9uYXY9emgtYXMtMi00LTBcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHNjYWxlWCA9IExheWEuTWluaUFkcHRlci53aW5kb3cuc2NyZWVuLmF2YWlsV2lkdGggLyA2NDA7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZVkgPSBMYXlhLk1pbmlBZHB0ZXIud2luZG93LnNjcmVlbi5hdmFpbEhlaWdodCogKEdhbWVDb25maWcuaGVpZ2h0IC8gTGF5YS5zdGFnZS5oZWlnaHQpIC8gMTEzNjtcclxuICAgICAgICAgICAgLy8gbGV0IHNjYWxlWCA9IExheWEuc3RhZ2Uud2lkdGggLyA2NDA7XHJcbiAgICAgICAgICAgIC8vIGxldCBzY2FsZVkgPSBMYXlhLnN0YWdlLmhlaWdodCAvIDExMzY7XHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSB3eFtcImNyZWF0ZVVzZXJJbmZvQnV0dG9uXCJdKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgICAgICAgICBpbWFnZTogJ2J0bl9zdGFydEdhbWUucG5nJyxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmJ0bl9zdGFydEdhbWUueCAqIHNjYWxlWCxcclxuICAgICAgICAgICAgICAgIHRvcDogdGhpcy5idG5fc3RhcnRHYW1lLnkgKiBzY2FsZVksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5idG5fc3RhcnRHYW1lLndpZHRoICogc2NhbGVYLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmJ0bl9zdGFydEdhbWUuaGVpZ2h0ICogc2NhbGVZLFxyXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogNDAsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBidXR0b24ub25UYXAoKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlck1nci5nZXRJbnN0YW5jZShQbGF5ZXJDb250cm9sbGVyKS5teVBsYXllckluZm8ubmFtZSA9IHJlcy51c2VySW5mby5uaWNrTmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlci5ydW4oKTtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuYnRuX3N0YXJ0R2FtZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX3N0YXJ0R2FtZSA9IGJ1dHRvbjtcclxuICAgICAgICAgICAgV1hUb29sLmFkZEJ0bih0aGlzLmJ0bl9zdGFydEdhbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5idG5fc3RhcnRHYW1lLnpvb21PbihMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIGlmKGUudHlwZSA9PSBMYXlhLkV2ZW50Lk1PVVNFX1VQKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlci5ydW4oKTtcclxuICAgICAgICAgICAgfSxudWxsLGZhbHNlKSk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJ0bl9zaG93UmFuay56b29tT24oTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKGUpIDogdm9pZHtcclxuICAgICAgICAgICAgaWYoZS50eXBlICE9IExheWEuRXZlbnQuTU9VU0VfVVApcmV0dXJuO1xyXG4gICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2hvd1JhbmsucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlck1nci5nZXRJbnN0YW5jZShUaXBDb250cm9sbGVyKS5zaG93VGlwKFwi5bC95oOF5pyf5b6FXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0sbnVsbCxmYWxzZSkpO1xyXG4gICAgICAgIHRoaXMuYnRuX3NoYXJlLnpvb21PbihMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICAgICAgaWYoZS50eXBlICE9IExheWEuRXZlbnQuTU9VU0VfVVApcmV0dXJuO1xyXG4gICAgICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3eFtcInNoYXJlQXBwTWVzc2FnZVwiXSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgOiAn5Y+R546w5pyJ5Liq5pyJ6Laj55qE5ri45oiPJyxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybCA6IFwiaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvaWFVVnV4QXJFOUw5RzI4RjZYcnhLQUlFdEpPczl4MVljbTJNWW1DMlV6NVQ5TzRSTHEwZWp2RzNpYzJLbFVCaWFWZi8wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmxJZCA6IFwiTmVsZW5IUExSWEsxLUFXRU5uMGFad1wiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoVGlwQ29udHJvbGxlcikuc2hvd1RpcChcIuWwveaDheacn+W+hVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sbnVsbCxmYWxzZSkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFdYVG9vbC5yZW1vdmVCdG4odGhpcy5idG5fc3RhcnRHYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5idG5fc3RhcnRHYW1lLmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9zdGFydEdhbWUub2ZmQWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBQcmVmZWJCYXNlIGZyb20gXCIuL1ByZWZlYkJhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpcEl0ZW0gZXh0ZW5kcyBQcmVmZWJCYXNlIHtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTp0ZXh0LCB0aXBzOlwi5a2X56ym5Liy57G75Z6L56S65L6LXCIsIHR5cGU6U3RyaW5nLCBkZWZhdWx0OlwiZFwifSovXHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nID0gXCJkXCI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHR4dF90ZXh0IDogTGF5YS5UZXh0O1xyXG4gICAgcHJvdGVjdGVkIGltZ19iZyA6IExheWEuSW1hZ2U7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XHJcbiAgICAgICAgdGhpcy50eHRfdGV4dC50ZXh0ID0gdGhpcy50ZXh0O1xyXG4gICAgICAgIHRoaXMuaW1nX2JnLndpZHRoID0gdGhpcy50eHRfdGV4dC5kaXNwbGF5V2lkdGggKyAzNjtcclxuICAgICAgICB0aGlzLm93bmVyW1wid2lkdGhcIl0gPSB0aGlzLmltZ19iZy53aWR0aDsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxufSIsImltcG9ydCBTY2VuZUJhc2UgZnJvbSBcIi4vU2NlbmVCYXNlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkaW5nU2NlbmUgIGV4dGVuZHMgU2NlbmVCYXNlIHtcclxuICAgIHByaXZhdGUgdHh0X3Byb2dyZXNzIDogTGF5YS5UZXh0O1xyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrDov5vluqbmnaHnmb7liIbmr5RcclxuICAgICAqIEBwYXJhbSB2YWx1ZSDnmb7liIbmr5QgMC0xMDBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZVBlcmNlbnQodmFsdWUgOiBudW1iZXIpIDogdm9pZHtcclxuICAgICAgICB0aGlzLnR4dF9wcm9ncmVzcy50ZXh0ID0gXCLmraPlnKjliqDovb3otYTmupAgXCIgKyB2YWx1ZSArIFwiJVwiO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IE1hcEZvbnRJbmZvIGZyb20gXCIuLi9tb2RlbC9NYXBGb250SW5mb1wiO1xyXG5pbXBvcnQgU3RhcnRHYW1lIGZyb20gXCIuLi9wcmVmZWIvU3RhcnRHYW1lXCI7XHJcbmltcG9ydCBTY2VuZUJhc2UgZnJvbSBcIi4vU2NlbmVCYXNlXCI7XHJcbmltcG9ydCBGb250R3JpZCBmcm9tIFwiLi4vcHJlZmViL0ZvbnRHcmlkXCI7XHJcbmltcG9ydCBQbGF5ZXJJbmZvIGZyb20gXCIuLi9tb2RlbC9QbGF5ZXJJbmZvXCI7XHJcbmltcG9ydCBQbGF5ZXJDb250cm9sbGVyIGZyb20gXCIuLi9jb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IEdhbWVSZXN1bHQgZnJvbSBcIi4uL3ByZWZlYi9HYW1lUmVzdWx0XCI7XHJcbmltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiO1xyXG5pbXBvcnQgeyBSZXNNZ3IgfSBmcm9tIFwiLi4vLi4vUmVzTWdyXCI7XHJcbmltcG9ydCBVUkkgZnJvbSBcIi4uLy4uL1VSSVwiO1xyXG5pbXBvcnQgVGlwQ29udHJvbGxlciBmcm9tIFwiLi4vY29udHJvbGxlci9UaXBDb250cm9sbGVyXCI7XHJcbmltcG9ydCBDb250cm9sbGVyTWdyIGZyb20gXCIuLi9jb250cm9sbGVyL0NvbnRyb2xsZXJNZ3JcIjtcclxuaW1wb3J0IE5hdGl2ZUJyaWRnZTQzOTkgZnJvbSBcIi4uL3Rvb2wvTmF0aXZlQnJpZGdlNDM5OVwiO1xyXG5pbXBvcnQgU291bmRUb29sIGZyb20gXCIuLi90b29sL1NvdW5kVG9vbFwiO1xyXG5pbXBvcnQgR2FtZVNldHRpbmcgZnJvbSBcIi4uL3ByZWZlYi9HYW1lU2V0dGluZ1wiO1xyXG5cclxuZW51bSBHYW1lU3RhdGV7XHJcbiAgICBFbmQgPSAwLFxyXG4gICAgUGF1c2UgPSAxLFxyXG4gICAgUGxheWluZyA9IDIsXHJcbiAgICBpbml0ID0gMyxcclxuICAgIEVmZmVjdFBhdXNlID0gNCAvL+mHiuaUvueJueaViOWvvOiHtOeahOaaguWBnFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluR2FtZVNjZW5lIGV4dGVuZHMgU2NlbmVCYXNlIHtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpwcmVmYWJfc3RhcnRHYW1lLHRpcHM6XCLlvIDlp4vmuLjmiI9wcmVmYWJcIix0eXBlOlByZWZhYn0qL1xyXG4gICAgcHJlZmFiX3N0YXJ0R2FtZTogTGF5YS5QcmVmYWI7XHJcbiAgICAvKiogQHByb3Age25hbWU6cHJlZmFiX2dhbWVSZXN1bHQsdGlwczpcIua4uOaIj+e7k+aenHByZWZhYlwiLHR5cGU6UHJlZmFifSovXHJcbiAgICBwcmVmYWJfZ2FtZVJlc3VsdDogTGF5YS5QcmVmYWI7XHJcbiAgICAvKiogQHByb3Age25hbWU6cHJlZmFiX2dhbWVTZXR0aW5nLHRpcHM6XCLmuLjmiI/orr7nva5cIix0eXBlOlByZWZhYn0qL1xyXG4gICAgcHJlZmFiX2dhbWVTZXR0aW5nOiBMYXlhLlByZWZhYjtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpwcmVmYWJfZm9udEdyaWQsdGlwczpcIuagvOWtkHByZWZhYlwiLHR5cGU6UHJlZmFifSovXHJcbiAgICBwcmVmYWJfZm9udEdyaWQ6IExheWEuUHJlZmFiO1xyXG4gICAgcHJpdmF0ZSBfZm9udHMgPSBbXTtcclxuICAgIHByaXZhdGUgbGlzdF9ncmlkcyA6IExheWEuTGlzdDtcclxuICAgIHByaXZhdGUgbGlzdF9zdGFyIDogTGF5YS5MaXN0O1xyXG4gICAgcHJpdmF0ZSB0eHRfbmV4dEZvbnQgOiBMYXlhLlRleHQ7XHJcbiAgICBwcml2YXRlIHR4dF9wbGF5ZXJOYW1lIDogTGF5YS5UZXh0O1xyXG4gICAgcHJpdmF0ZSB0eHRfc2NvcmUgOiBMYXlhLlRleHQ7XHJcbiAgICBwcml2YXRlIHR4dF9wb3B1bGFyR3JvdXAgOiBMYXlhLlRleHQ7XHJcbiAgICBwcml2YXRlIGltZ19wb3B1bGFyR3JvdXBCZyA6IExheWEuSW1hZ2U7XHJcbiAgICBwcml2YXRlIG1jX2Rpc3BlbFRleHQgOiBMYXlhLlNwcml0ZVxyXG4gICAgcHJpdmF0ZSB0eHRfZGlzcGVsVGV4dCA6IExheWEuVGV4dDtcclxuICAgIHByaXZhdGUgdHh0X2N1cnJlbnRQaW5ZaW4gOiBMYXlhLlRleHQ7XHJcbiAgICBwcml2YXRlIGJ0bl9wYXVzZU9yU3RhcnQgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHByaXZhdGUgYnRuX3NldHRpbmcgOiBMYXlhLkJ1dHRvbjtcclxuICAgIHByaXZhdGUgbGlzdF9udVFpIDogTGF5YS5MaXN0O1xyXG4gICAgcHJpdmF0ZSBfZ2FtZVN0YXRlIDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZHJvcGluZ0ZvbnRJbmZvIDogTWFwRm9udEluZm87XHJcbiAgICBwcml2YXRlIF9uZXh0RHJvcGluZ0ZvbnRJbmZvIDogTWFwRm9udEluZm87XHJcbiAgICBwcml2YXRlIF9zeXNEcm9waW5nRm9udEluZm9zIDogTWFwRm9udEluZm9bXSA9IFtdOyAvL+a2iOmZpOS6p+eUn+eahOaWsOWtl++8jOiHquWKqOS4i+iQvVxyXG4gICAgcHJpdmF0ZSBfc3lzRGlzcGVsRm9udEluZm9TdGFjayA6IE1hcEZvbnRJbmZvW10gPSBbXTsgLy/mtojpmaTkuqfnlJ/nmoTmlrDlrZfvvIzlnKjoh6rliqjkuIvokL3lrozmr5XlkI7vvIzlrZjlgqjvvIznlKjkuo7miYDmnInlrZfkuIvokL3lrozmr5Xnu5/kuIDmiafooYzmtojpmaTmk43kvZxcclxuICAgIHByaXZhdGUgX3N0YXJ0UG9pbnQgPSBuZXcgTGF5YS5Qb2ludCgyLDApO1xyXG4gICAgcHJpdmF0ZSBfdGlja1RpbWUgOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXhUaWNrVGltZSA9IDI2O1xyXG4gICAgcHJpdmF0ZSBfc3lzVGlja1RpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbWF4U3lzVGlja1RpbWUgPSA4O1xyXG4gICAgcHJpdmF0ZSBfcG9wdWxhckdyb3VwIDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfd29yZHMgOiBNYXBGb250SW5mb1tdID0gW107IC8v5bem6L655a2X56ym5YiX6KGo77yM5qyi6L+O5a2X56ym5YiX6KGoXHJcbiAgICBwcml2YXRlIF9zcGxpdEZvbnRXb3JkcyA6IE1hcEZvbnRJbmZvW10gPSBbXTsvL+WIhuWtl+Wtl+espuWIl+ihqFxyXG4gICAgcHJpdmF0ZSBfc3BsaXRHcm91cFdvcmRzIDogTWFwRm9udEluZm9bXSA9IFtdOy8v5YiG6K+N5a2X56ym5YiX6KGoXHJcbiAgICBwcml2YXRlIF9taW5Xb3Jkc0xlbmd0aCA9IDU7XHJcbiAgICBwcml2YXRlIF9pc01vdXNlRG93biA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX2lzUXVpY2tEcm9wIDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfbXlQbGF5ZXJJbmZvIDogUGxheWVySW5mbztcclxuICAgIHByaXZhdGUgX3Njb3JlIDogbnVtYmVyID0gMDsgLy/lvZPliY3lsYDliIbmlbBcclxuICAgIHByaXZhdGUgX251UWkgOiBudW1iZXIgPSAwOyAvL+aAkuawlO+8jOeUqOadpeinpuWPkeaKgOiDvVxyXG4gICAgcHJpdmF0ZSBfZGVidWdNb2RlID0gZmFsc2U7IC8v6LCD6K+VXHJcbiAgICBwcml2YXRlIF9kZWJ1Z0ZvbnRzID0gW1xyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBcIuawtVwiLG51bGwsbnVsbCxcIuawtVwiLG51bGwsXHJcbiAgICBdXHJcbiAgICBwcml2YXRlIF9kZWJ1Z0Ryb3BGb250cyA9IFtcIuWNgVwiXTtcclxuICAgIHByaXZhdGUgX2d1aWRlRHJvcEZvbnRzID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfSBcclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgICAgICBzd2l0Y2goQXBwQ29uZmlnLnBsYXRmb3JtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSBcInd4XCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X3BsYXllck5hbWUudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0X3N0YXIueSA9IDg0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfc2NvcmUueSA9IDE0MjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighQXBwQ29uZmlnLmhhZEd1aWRhbmNlKCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9ndWlkZURyb3BGb250cyA9IFtcIuacqFwiLFwi5pyoXCIsXCLlpJVcIixcIuaDs1wiLFwi5Y+IXCIsXCLmrKBcIixcIuS5kFwiLFwi5pyoXCIsXCLnm65cIixcIuW/g1wiLFwi5YyWXCIsXCLljYFcIl07XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5zZXRHdWlkYW5jZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0X2dyaWRzLnJlbmRlckhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkdyaWRSZW5kZXIsbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5saXN0X3N0YXIucmVuZGVySGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uU3RhclJlbmRlcixudWxsLGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0X251UWkucmVuZGVySGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTnVRaVJlbmRlcixudWxsLGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbXlQbGF5ZXJJbmZvID0gQ29udHJvbGxlck1nci5nZXRJbnN0YW5jZShQbGF5ZXJDb250cm9sbGVyKS5teVBsYXllckluZm87XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5idG5fcGF1c2VPclN0YXJ0W1wiem9vbU9uXCJdKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uUGF1c2VPclN0YXJ0TW91c2VFdmVudCxbXSxmYWxzZSkpO1xyXG4gICAgICAgIHRoaXMuYnRuX3NldHRpbmdbXCJ6b29tT25cIl0oTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25TZXR0aW5nTW91c2VFdmVudCxbXSxmYWxzZSkpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuaW5pdCk7XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICAvLyBsZXQgc2sgPSBSZXNNZ3IuSW5zdGFuY2UoKS5jcmVhdGVTcGluZShVUkkuc3BpbmVVcmwgKyBcInpmX3dhbnFpYW5zaGlqaWUuc2tcIixcImhpdFwiLHRydWUsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgIC8vICAgICAvLyB0aGlzLl9oZUNoZW5nRWZmZWN0LmRlc3Ryb3koKTtcclxuICAgICAgICAvLyAgICAgLy8gdGhpcy5faGVDaGVuZ0VmZmVjdCA9IG51bGw7XHJcbiAgICAgICAgLy8gfSkpO1xyXG4gICAgICAgIC8vIHNrLnggPSBzay55ID0gNDQ7XHJcbiAgICAgICAgLy8gdGhpcy5vd25lci5hZGRDaGlsZChzayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNldHRpbmdNb3VzZUV2ZW50KGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgaWYoZS50eXBlID09IExheWEuRXZlbnQuTU9VU0VfVVApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLlBhdXNlKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93R2FtZVNldHRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUGF1c2VPclN0YXJ0TW91c2VFdmVudChlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgIGlmKGUudHlwZSA9PSBMYXlhLkV2ZW50Lk1PVVNFX1VQKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5QYXVzZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5QbGF5aW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+aJk+WNsOW9k+WJjeaJgOacieagvOWtkOS/oeaBr1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwOyBqIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFk7aisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bal0gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwibnVsbCxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBcIidcIiArIHRoaXMuX2ZvbnRzW2ldW2pdLnRleHQgKyBcIicsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5QYXVzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93U3RhcnRHYW1lKCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBzdGFydEdhbWVTcHIgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiU3RhcnRHYW1lXCIsdGhpcy5wcmVmYWJfc3RhcnRHYW1lLmNyZWF0ZSx0aGlzLnByZWZhYl9zdGFydEdhbWUpO1xyXG4gICAgICAgIGxldCBzdGFydEdhbWVTY3JpcHQgPSBzdGFydEdhbWVTcHIuZ2V0Q29tcG9uZW50KFN0YXJ0R2FtZSkgYXMgU3RhcnRHYW1lXHJcbiAgICAgICAgc3RhcnRHYW1lU2NyaXB0LmhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5jaGFuZ2VHYW1lU3RhdHVlLFtHYW1lU3RhdGUuUGxheWluZ10sZmFsc2UpO1xyXG4gICAgICAgIHN0YXJ0R2FtZVNjcmlwdC5vblNob3dSYW5rID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuc2hvd1JhbmssbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5hZGRQb3BVcChcIlN0YXJ0R2FtZVwiLHN0YXJ0R2FtZVNwcixmYWxzZSxmYWxzZSxmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93R2FtZVJlc3VsdCgpIDogdm9pZHtcclxuICAgICAgICBsZXQgZ2FtZVJlc3VsdFNwciA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJHYW1lUmVzdWx0XCIsdGhpcy5wcmVmYWJfZ2FtZVJlc3VsdC5jcmVhdGUsdGhpcy5wcmVmYWJfZ2FtZVJlc3VsdCkgYXMgTGF5YS5TcHJpdGU7XHJcbiAgICAgICAgbGV0IGdhbWVSZXN1bHRTY3JpcHQgPSBnYW1lUmVzdWx0U3ByLmdldENvbXBvbmVudChHYW1lUmVzdWx0KSBhcyBHYW1lUmVzdWx0O1xyXG4gICAgICAgIGxldCBzdG9yYWdlT2JqID0ge1xyXG4gICAgICAgICAgICBcInd4Z2FtZVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwic2NvcmVcIjp0aGlzLl9zY29yZSxcclxuICAgICAgICAgICAgICAgICAgXCJ1cGRhdGVfdGltZVwiOiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwic2NvcmVcIjp0aGlzLl9zY29yZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kYXRhVmlld2VyLnBvc3RNc2coe1xyXG4gICAgICAgICAgICBjbWQgOiBcInd4LnNldFVzZXJDbG91ZFN0b3JhZ2VcIixcclxuICAgICAgICAgICAgZGF0YSA6IHN0b3JhZ2VPYmpcclxuICAgICAgICB9KTtcclxuICAgICAgICBnYW1lUmVzdWx0U2NyaXB0LnNjb3JlID0gdGhpcy5fc2NvcmU7XHJcbiAgICAgICAgZ2FtZVJlc3VsdFNjcmlwdC5zaG93SG9tZUhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5jaGFuZ2VHYW1lU3RhdHVlLFtHYW1lU3RhdGUuaW5pdF0sZmFsc2UpO1xyXG4gICAgICAgIGdhbWVSZXN1bHRTY3JpcHQucmVzdGFydEhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5yZXN0YXJ0LG51bGwsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYWRkUG9wVXAoXCJHYW1lUmVzdWx0XCIsZ2FtZVJlc3VsdFNwcixmYWxzZSxmYWxzZSxmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93R2FtZVNldHRpbmcoKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGdhbWVTZXR0aW5nU3ByID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcIkdhbWVTZXR0aW5nXCIsdGhpcy5wcmVmYWJfZ2FtZVNldHRpbmcuY3JlYXRlLHRoaXMucHJlZmFiX2dhbWVTZXR0aW5nKSBhcyBMYXlhLlNwcml0ZTtcclxuICAgICAgICBsZXQgZ2FtZVNldHRpbmdTY3JpcHQgPSBnYW1lU2V0dGluZ1Nwci5nZXRDb21wb25lbnQoR2FtZVNldHRpbmcpIGFzIEdhbWVTZXR0aW5nO1xyXG4gICAgICAgIGdhbWVTZXR0aW5nU2NyaXB0Lm9uQ2xvc2VIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuY2hhbmdlR2FtZVN0YXR1ZSxbR2FtZVN0YXRlLlBsYXlpbmddLGZhbHNlKTtcclxuICAgICAgICBnYW1lU2V0dGluZ1NjcmlwdC5zaG93SG9tZUhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5jaGFuZ2VHYW1lU3RhdHVlLFtHYW1lU3RhdGUuaW5pdF0sZmFsc2UpO1xyXG4gICAgICAgIGdhbWVTZXR0aW5nU2NyaXB0LnJlc3RhcnRIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMucmVzdGFydCxudWxsLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFkZFBvcFVwKFwiZ2FtZVNldHRpbmdcIixnYW1lU2V0dGluZ1Nwcix0cnVlLHRydWUsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdGFydCgpIDogdm9pZHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIlN0b3JhZ2VWZXJzaW9uXCIsbnVsbCk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJDYWNoZURhdGFcIixudWxsKTtcclxuICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSBHYW1lU3RhdGUuRW5kO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuUGxheWluZyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gZ2FtZVN0YXRlIOWPmOabtOeKtuaAgVxyXG4gICAgICogQHBhcmFtIG5leHRTdGF0ZSDkuIvkuIDkuKrnirbmgIFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjaGFuZ2VHYW1lU3RhdHVlKGdhbWVTdGF0ZSA6IG51bWJlciwgbmV4dFN0YXRlIDogbnVtYmVyID0gLTEpIDogdm9pZHtcclxuICAgICAgICBzd2l0Y2goZ2FtZVN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuRW5kOlxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJDYWNoZURhdGFcIixudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0dhbWVSZXN1bHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5QbGF5aW5nOlxyXG4gICAgICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwiYW5kcm9pZDQzOTlcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBOYXRpdmVCcmlkZ2U0Mzk5LnNob3dCYW5uZXJBZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX3BhdXNlT3JTdGFydC5za2luID0gXCJtYXAvYnRuX3BhdXNlLnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlUG9wVXAoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgIT0gR2FtZVN0YXRlLlBhdXNlICYmIHRoaXMuX2dhbWVTdGF0ZSAhPSBHYW1lU3RhdGUuRWZmZWN0UGF1c2UpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJvb2w7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29sID0gdGhpcy5yZXN0b3JlQWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIkNhY2hlRGF0YVwiLG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29sID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFib29sKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NvcmUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9udVFpID0gdGhpcy5fZGVidWdNb2RlID8gMTIgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9udVFpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDAgOyAgaiA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZIDsgaisrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1tpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9kZWJ1Z01vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHh0ID0gdGhpcy5fZGVidWdGb250c1tpICsgaiAqIDVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0eHQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbaV1bal0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiB0eHR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby54ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby55ID0gajtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW2ldW2pdID0gdGVtcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1tpXVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BvcHVsYXJHcm91cCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3JkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVDaVNwbGl0VGltZXMgPSAwOyAvL+WQiOaIkOW9k+WJjeW3pui+ueivjee7hOWksei0peasoeaVsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlQ2l6dVJhdGUgPSAxMDsgLy/lh7rnjrDlt6bovrnpgqPkuKror43nu4TnmoTmpoLnjodcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5aaVJhdGUgPSAxMCA7IC8vIOWHuueOsOiDvei3n+S6lOWIl+acgOWklui+ueaxieWtl+WQiOaIkOaxieWtl+eahOamgueOh1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNpWnVSYXRlID0gMTA7IC8vIOWHuueOsOiDvei3n+S6lOWIl+acgOWklui+ueaxieWtl+WQiOaIkOivjee7hOeahOamgueOh1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5QYXVzZTpcclxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX3BhdXNlT3JTdGFydC5za2luID0gXCJtYXAvYnRuX3N0YXJ0LnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuRWZmZWN0UGF1c2U6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuaW5pdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1N0YXJ0R2FtZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwiYW5kcm9pZDQzOTlcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBOYXRpdmVCcmlkZ2U0Mzk5LnNob3dCYW5uZXJBZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gZ2FtZVN0YXRlO1xyXG4gICAgICAgIGlmKG5leHRTdGF0ZSAhPSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShuZXh0U3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTnVRaVJlbmRlcihjZWxsIDogTGF5YS5Cb3gsIGluZGV4IDogbnVtYmVyKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBjZWxsLmRhdGFTb3VyY2U7XHJcbiAgICAgICAgY2VsbC5nZXRDaGlsZEJ5TmFtZShcImltZ19zdGFyXCIpW1widmlzaWJsZVwiXSA9IGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkdyaWRSZW5kZXIoY2VsbCA6IExheWEuQm94LGluZGV4IDogbnVtYmVyKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAgY2VsbC5kYXRhU291cmNlIGFzIE1hcEZvbnRJbmZvO1xyXG4gICAgICAgIGxldCBmb250R3JpZFNjcmlwID0gY2VsbC5nZXRDb21wb25lbnQoRm9udEdyaWQpIGFzIEZvbnRHcmlkO1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvbnRHcmlkU2NyaXAuZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvbnRHcmlkU2NyaXAuY2xlYXJFZmZlY3RzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb250R3JpZFNjcmlwLmZvbnQgPSBkYXRhLnRleHQ7XHJcbiAgICAgICAgICAgIGZvbnRHcmlkU2NyaXAuYWRkRWZmZWN0KGRhdGEuZ2V0U3R1bnRGb250RWZmZWN0KCkpO1xyXG4gICAgICAgICAgICBmb250R3JpZFNjcmlwLnF1YWxpdHkgPSBkYXRhLnF1YWxpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TdGFyUmVuZGVyKGNlbGwgOiBMYXlhLkltYWdlLCBpbmRleCA6IG51bWJlcikgOiB2b2lke1xyXG4gICAgICAgIGxldCBpc1NoaW5lID0gY2VsbC5kYXRhU291cmNlOyAvLyDmmK/lkKbngrnkuq5cclxuICAgICAgICBpZihpc1NoaW5lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2VsbC5za2luID0gXCJtYXAvaW1nX3N0YXIucG5nXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjZWxsLnNraW4gPSBcIm1hcC9pbWdfc3RhckJnLnBuZ1wiOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbW91c2VEb3duUG9pbnQgOiBMYXlhLlBvaW50O1xyXG4gICAgb25Nb3VzZURvd24oKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5QbGF5aW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbW91c2VEb3duUG9pbnQgPSBuZXcgTGF5YS5Qb2ludChMYXlhLnN0YWdlLm1vdXNlWCxMYXlhLnN0YWdlLm1vdXNlWSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUXVpY2tEcm9wID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLlBsYXlpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9tb3VzZURvd25Qb2ludCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGFic1ggPSBNYXRoLmFicyhMYXlhLnN0YWdlLm1vdXNlWCAtIHRoaXMuX21vdXNlRG93blBvaW50LngpO1xyXG4gICAgICAgICAgICBsZXQgYWJzWSA9IExheWEuc3RhZ2UubW91c2VZIC0gdGhpcy5fbW91c2VEb3duUG9pbnQueTtcclxuICAgICAgICAgICAgaWYoYWJzWCA+IDEwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihhYnNZID4gYWJzWCAqIDIuNSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+erluedgOenu+WKqFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzUXVpY2tEcm9wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBTb3VuZFRvb2wucGxheVhpYUh1YUVmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEcm9waW5nRm9udChMYXlhLnN0YWdlLm1vdXNlWCA8IHRoaXMuX21vdXNlRG93blBvaW50LngpXHJcbiAgICAgICAgICAgICAgICAgICAgU291bmRUb29sLnBsYXlZaURvbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGFic1kgPiAyNSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNRdWlja0Ryb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgU291bmRUb29sLnBsYXlYaWFIdWFFZmZlY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9tb3VzZURvd25Qb2ludCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5QbGF5aW5nKVxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLlBhdXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLlBsYXlpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+WIpOaWreW9k+WJjeWtl+espuaYr+WQpuS4jei2s1xyXG4gICAgICAgICAgICBsZXQgaXNFZGl0TGlzdCA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3B1bGFyR3JvdXAoKTtcclxuICAgICAgICAgICAgLy/mtojpmaTkuqfnlJ/nmoTmvILmta7lrZfnp7vliqjlj4rmtojpmaRcclxuICAgICAgICAgICAgaWYodGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zeXNUaWNrVGltZSA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzVGlja1RpbWUgLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c1RpY2tUaW1lID0gdGhpcy5fbWF4U3lzVGlja1RpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN5c0RlbEFyciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MubGVuZ3RoID09IHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2subGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5pbnZva2VTdHVudEZvbnQoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxDaVp1KHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5mb3JFYWNoKGVsZW1lbnQ9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkpICE9IGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrU3lzRHJvcEZvbnRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRWRpdExpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmZvckVhY2goZWxlbWVudD0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5pbmRleE9mKGVsZW1lbnQpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2VsZW1lbnQueF1bZWxlbWVudC55ICsgMV0gPT0gbnVsbCAmJiBlbGVtZW50LnkgKyAxIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nu6fnu63kuIvokL1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8oZWxlbWVudC54LCBlbGVtZW50LnkgKyAxLGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXoOazleS4i+iQve+8jOaJp+ihjOa2iOmZpOWKqOS9nFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0VkaXRMaXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/mlrnlnZfnirbmgIHmo4DmtYtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3RpY2tUaW1lID4gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9pc1F1aWNrRHJvcCAmJiB0aGlzLl90aWNrVGltZSA+IDEpdGhpcy5fdGlja1RpbWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpY2tUaW1lIC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpY2tUaW1lID0gKDEwMCAtIHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3BlZWRfcmF0ZSkgKiB0aGlzLl9tYXhUaWNrVGltZSAvIDEwMDtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvL+WIpOaWreaYr+WQpuacieaOieiQveS4reeahOWtl++8jOayoeacieeahOivne+8jOeUn+aIkOWtl1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNRdWlja0Ryb3AgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbdGhpcy5fc3RhcnRQb2ludC54XVt0aGlzLl9zdGFydFBvaW50LnldICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57uT5p2fXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLkVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9tTmV4dEZvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7aWQgOiB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnQgPSB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmraPlnKjmjonokL3nmoTmsYnlrZDvvJpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmd1aWRlVG9HcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERpc3BlbFRleHQodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21OZXh0Rm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVOZXh0RHJvcGluZ0ZvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mby54ID0gdGhpcy5fc3RhcnRQb2ludC54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgPSB0aGlzLl9zdGFydFBvaW50Lnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueF1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnldID0gdGhpcy5fZHJvcGluZ0ZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFZGl0TGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlQWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2lzUXVpY2tEcm9wKXRoaXMuX3RpY2tUaW1lID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54XVt0aGlzLl9kcm9waW5nRm9udEluZm8ueSArIDFdID09IG51bGwgJiYgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKyAxIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nu6fnu63kuIvokL1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8odGhpcy5fZHJvcGluZ0ZvbnRJbmZvLngsIHRoaXMuX2Ryb3BpbmdGb250SW5mby55ICsgMSx0aGlzLl9kcm9waW5nRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXoOazleS4i+iQve+8jOaJp+ihjOa2iOmZpOWKqOS9nFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlRG93blBvaW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3lHdWlkZUltZ3MoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXNEaXNwZWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY291dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3V0ID0gdGhpcy5kaXNwZWxDaVp1KFt0aGlzLl9kcm9waW5nRm9udEluZm9dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb3V0ID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc3BlbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdXQgPSB0aGlzLmRpc3BlbCh0aGlzLl9kcm9waW5nRm9udEluZm8ueCx0aGlzLl9kcm9waW5nRm9udEluZm8ueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY291dCA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNwZWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihpc0Rpc3BlbCA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuc2V0RGlzcGVsVGV4dCh0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0VkaXRMaXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpc0VkaXRMaXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmiYDmnInpnZ7nqbrpobblrZfnrKZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRBbGxGb250cygpIDogTWFwRm9udEluZm9bXXtcclxuICAgICAgICBsZXQgY291dCA9IFtdXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX2ZvbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gdGhpcy5fZm9udHNbMF0ubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW2pdICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291dC5wdXNoKHRoaXMuX2ZvbnRzW2ldW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jYWNoZVByb3BlcnRpZXMgPSBbXCJoZUNpU3BsaXRUaW1lc1wiLFwiaGVDaXp1UmF0ZVwiLFwiY2ladVJhdGVcIixcIl9zY29yZVwiLFwiX251UWlcIixcIl9wb3B1bGFyR3JvdXBcIixcIl9ndWlkZVJhdGVcIixcImJ1U2hvdVJhdGVcIl07XHJcbiAgICBwcml2YXRlIGNhY2hlQWxsKCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBvYmogOiBhbnkgPSB7fTtcclxuICAgICAgICB0aGlzLl9jYWNoZVByb3BlcnRpZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgb2JqW2VsZW1lbnRdID0gdGhpc1tlbGVtZW50XTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIG9iai5fd29yZFRleHRzID0gW107IFxyXG4gICAgICAgIHRoaXMuX3dvcmRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIG9iai5fd29yZFRleHRzLnB1c2goe3RleHQgOiBlbGVtZW50LnRleHQsIGlzU3R1bnRGb250IDogZWxlbWVudC5pc1N0dW50Rm9udH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iai5fc3BsaXRGb250V29yZFRleHRzID0gW107XHJcbiAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgb2JqLl9zcGxpdEZvbnRXb3JkVGV4dHMucHVzaCh7dGV4dCA6IGVsZW1lbnQudGV4dCwgaXNTdHVudEZvbnQgOiBlbGVtZW50LmlzU3R1bnRGb250fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqLl9zcGxpdEdyb3VwV29yZFRleHRzID1bXTtcclxuICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgb2JqLl9zcGxpdEdyb3VwV29yZFRleHRzLnB1c2goe3RleHQgOiBlbGVtZW50LnRleHQsIGlzU3R1bnRGb250IDogZWxlbWVudC5pc1N0dW50Rm9udH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICBvYmouX2Ryb3BpbmdGb250SW5mb1RleHQgPSB7dGV4dCA6IHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0LCBpc1N0dW50Rm9udCA6IHRoaXMuX2Ryb3BpbmdGb250SW5mby5pc1N0dW50Rm9udH07XHJcbiAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgIG9iai5fbmV4dERyb3BpbmdGb250SW5mb1RleHQgPSB7dGV4dCA6IHRoaXMuX25leHREcm9waW5nRm9udEluZm8udGV4dCwgaXNTdHVudEZvbnQgOiB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250fTtcclxuICAgICAgICBvYmouX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2tQb3NlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2suZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgb2JqLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrUG9zZXMucHVzaChuZXcgTGF5YS5Qb2ludChlbGVtZW50LngsIGVsZW1lbnQueSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iai5fc3lzRHJvcGluZ0ZvbnRJbmZvc1Bvc2VzID0gW107XHJcbiAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBvYmouX3N5c0Ryb3BpbmdGb250SW5mb3NQb3Nlcy5wdXNoKG5ldyBMYXlhLlBvaW50KGVsZW1lbnQueCwgZWxlbWVudC55KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqLl9mb250VGV4dHMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5fZm9udHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBvYmouX2ZvbnRUZXh0c1tpXSA9IFtdXHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDAgOyAgaiA8IHRoaXMuX2ZvbnRzW2ldLmxlbmd0aCA7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bal0gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouX2ZvbnRUZXh0c1tpXVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5fZm9udFRleHRzW2ldW2pdID0ge3RleHQgOiB0aGlzLl9mb250c1tpXVtqXS50ZXh0LCBpc1N0dW50Rm9udCA6IHRoaXMuX2ZvbnRzW2ldW2pdLmlzU3R1bnRGb250fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIlN0b3JhZ2VWZXJzaW9uXCIsQXBwQ29uZmlnLnZlcnNpb24pO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiQ2FjaGVEYXRhXCIsSlNPTi5zdHJpbmdpZnkob2JqKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXN0b3JlQWxsKCkgOiBib29sZWFue1xyXG4gICAgICAgIGlmKHRoaXMuX2RlYnVnTW9kZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHN0b3JhZ2VWZXJzaW9uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJTdG9yYWdlVmVyc2lvblwiKTtcclxuICAgICAgICBpZihzdG9yYWdlVmVyc2lvbiA9PSBBcHBDb25maWcudmVyc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU3RyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJDYWNoZURhdGFcIik7XHJcbiAgICAgICAgICAgIGlmKGRhdGFTdHIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdG9yZU9iaiA9IEpTT04ucGFyc2UoZGF0YVN0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvIDogTWFwRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbaV0gPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDAgOyAgaiA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZIDsgaisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzdG9yZU9iai5fZm9udFRleHRzW2ldID09IG51bGwgfHwgcmVzdG9yZU9iai5fZm9udFRleHRzW2ldW2pdID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW2ldW2pdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLl9mb250c1tpXVtqXSA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHJlc3RvcmVPYmouX2ZvbnRUZXh0c1tpXVtqXS50ZXh0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8uaXNTdHVudEZvbnQgPSByZXN0b3JlT2JqLl9mb250VGV4dHNbaV1bal0uaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8ueCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8ueSA9IGo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZVByb3BlcnRpZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2VsZW1lbnRdID0gcmVzdG9yZU9ialtlbGVtZW50XTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLl93b3JkcyA9IFtdXHJcbiAgICAgICAgICAgICAgICByZXN0b3JlT2JqLl93b3JkVGV4dHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiBlbGVtZW50LnRleHR9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8udGV4dCA9PSBudWxsKXJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8uaXNTdHVudEZvbnQgPSBlbGVtZW50LmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmRzLnB1c2godGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHJlc3RvcmVPYmouX3NwbGl0Rm9udFdvcmRUZXh0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IGVsZW1lbnQudGV4dH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mby50ZXh0ID09IG51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mby5pc1N0dW50Rm9udCA9IGVsZW1lbnQuaXNTdHVudEZvbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMucHVzaCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHJlc3RvcmVPYmouX3NwbGl0R3JvdXBXb3JkVGV4dHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiBlbGVtZW50LnRleHR9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8udGV4dCA9PSBudWxsKXJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8uaXNTdHVudEZvbnQgPSBlbGVtZW50LmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5wdXNoKHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmKHJlc3RvcmVPYmouX2Ryb3BpbmdGb250SW5mb1RleHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiByZXN0b3JlT2JqLl9kcm9waW5nRm9udEluZm9UZXh0LnRleHR9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnQgPSByZXN0b3JlT2JqLl9kcm9waW5nRm9udEluZm9UZXh0LmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGlzcGVsVGV4dCh0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggPSB0aGlzLl9zdGFydFBvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgPSB0aGlzLl9zdGFydFBvaW50Lnk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9tTmV4dEZvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8gPSB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYocmVzdG9yZU9iai5fbmV4dERyb3BpbmdGb250SW5mb1RleHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogcmVzdG9yZU9iai5fbmV4dERyb3BpbmdGb250SW5mb1RleHQudGV4dH0pO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9PSBudWxsIHx8IHRoaXMuX25leHREcm9waW5nRm9udEluZm8udGV4dCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9tTmV4dEZvbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby5pc1N0dW50Rm9udCA9IHJlc3RvcmVPYmouX25leHREcm9waW5nRm9udEluZm9UZXh0LmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjayA9IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU9iai5fc3lzRGlzcGVsRm9udEluZm9TdGFja1Bvc2VzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sucHVzaCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU9iai5fc3lzRHJvcGluZ0ZvbnRJbmZvc1Bvc2VzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MucHVzaCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGlja1RpbWUgPSAoMTAwIC0gdGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zcGVlZF9yYXRlKSAqIHRoaXMuX21heFRpY2tUaW1lIC8gMTAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiQ2FjaGVEYXRhXCIsbnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbW92ZURyb3BpbmdGb250KGxlZnQgOiBib29sZWFuKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtaW5UaWNrVGltZSA9IDAuMyAqICgxMDAgLSB0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnNwZWVkX3JhdGUpICogdGhpcy5fbWF4VGlja1RpbWUgLyAxMDBcclxuICAgICAgICBpZihsZWZ0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggPiAwICYmIHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54IC0gMV1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnldICA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8odGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggLSAxLCB0aGlzLl9kcm9waW5nRm9udEluZm8ueSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aWNrVGltZSA9IHRoaXMuX3RpY2tUaW1lID4gbWluVGlja1RpbWUgPyB0aGlzLl90aWNrVGltZSA6IG1pblRpY2tUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8ueCA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYIC0gMSAmJiB0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueCArIDFdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55XSAgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKHRoaXMuX2Ryb3BpbmdGb250SW5mby54ICsgMSwgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGlja1RpbWUgPSB0aGlzLl90aWNrVGltZSA+IG1pblRpY2tUaW1lID8gdGhpcy5fdGlja1RpbWUgOiBtaW5UaWNrVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBsZXQgdGFyZ2V0TWMgPSB0aGlzLmxpc3RfZ3JpZHMuZ2V0Q2VsbCh0aGlzLl9kcm9waW5nRm9udEluZm8ueSAqIHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYICsgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLngpO1xyXG4gICAgICAgIC8vIGxldCBpdGVtV2lkdGggPSB0YXJnZXRNYy53aWR0aDtcclxuICAgICAgICAvLyBsZXQgcG9pbnQgPSBuZXcgTGF5YS5Qb2ludCh0YXJnZXRNYy54ICsgdGFyZ2V0TWMud2lkdGggLyAyLCB0YXJnZXRNYy55ICsgdGFyZ2V0TWMuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgLy8gcG9pbnQgPSAodGFyZ2V0TWMucGFyZW50IGFzIExheWEuU3ByaXRlKS5sb2NhbFRvR2xvYmFsKHBvaW50KTtcclxuICAgICAgICAvLyAvL+WIpOaWreS4i+enu+WIsOW6lVxyXG4gICAgICAgIC8vIGlmKE1hdGguYWJzKHBvaW50LnggLSBMYXlhLnN0YWdlLm1vdXNlWCkgPCBpdGVtV2lkdGggLyAyKVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgaWYoTGF5YS5zdGFnZS5tb3VzZVkgLSBwb2ludC55ID4gaXRlbVdpZHRoIC8gMilcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgLy/np7vliqjliLDlupVcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuX2lzUXVpY2tEcm9wID0gdHJ1ZTtcclxuICAgICAgICAvLyAgICAgICAgIC8vIHdoaWxlKHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54XVt0aGlzLl9kcm9waW5nRm9udEluZm8ueSArIDFdID09IG51bGwgJiYgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKyAxIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkpXHJcbiAgICAgICAgLy8gICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKHRoaXMuX2Ryb3BpbmdGb250SW5mby54LCB0aGlzLl9kcm9waW5nRm9udEluZm8ueSArIDEpXHJcbiAgICAgICAgLy8gICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gZWxzZSBcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIGlmKExheWEuc3RhZ2UubW91c2VYIDwgcG9pbnQueClcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgLy/lkJHlt6bnp7vliqhcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mby54ID4gMCAmJiB0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueCAtIDFdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55XSAgPT0gbnVsbClcclxuICAgICAgICAvLyAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8odGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggLSAxLCB0aGlzLl9kcm9waW5nRm9udEluZm8ueSk7XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgICAgZWxzZSBcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgLy/lkJHlj7PkuIDlrppcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mby54IDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggLSAxICYmIHRoaXMuX2ZvbnRzW3RoaXMuX2Ryb3BpbmdGb250SW5mby54ICsgMV1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnldICA9PSBudWxsKVxyXG4gICAgICAgIC8vICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyh0aGlzLl9kcm9waW5nRm9udEluZm8ueCArIDEsIHRoaXMuX2Ryb3BpbmdGb250SW5mby55KTtcclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBpZihpc1JlZnJlc2hMaXN0KVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+ajgOafpea2iOmZpOS6p+eUn+eahOa8gua1ruWtl+WKoOWFpeWIl+ihqFxyXG4gICAgcHJpdmF0ZSBjaGVja1N5c0Ryb3BGb250cygpIDogdm9pZHtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBpc0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSAtIDEgOyAgaiA+PTAgIDsgai0tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtqXSAhPSBudWxsICYmIChpc0FkZCB8fCAoaisxIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkgJiYgdGhpcy5fZm9udHNbaV1baisxXSA9PSBudWxsKSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MuaW5kZXhPZih0aGlzLl9mb250c1tpXVtqXSkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MucHVzaCh0aGlzLl9mb250c1tpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/np7vliqjmraPlnKjmk43kvZznmoTlrZdcclxuICAgIHByaXZhdGUgY2hhbmdlRHJvcEZvbnRUbyh4IDogbnVtYmVyICwgeSA6IG51bWJlcixmb250SW5mbyA6IE1hcEZvbnRJbmZvID0gbnVsbCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHkgPCAwIHx8IHggPCAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih4ID49IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYIHx8IHkgPj0gdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb250SW5mbyA9IHRoaXMuX2Ryb3BpbmdGb250SW5mbztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZm9udHNbZm9udEluZm8ueF1bZm9udEluZm8ueV0gPSBudWxsO1xyXG4gICAgICAgIGZvbnRJbmZvLnggPSB4O1xyXG4gICAgICAgIGZvbnRJbmZvLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuX2ZvbnRzW2ZvbnRJbmZvLnhdW2ZvbnRJbmZvLnldID0gZm9udEluZm87XHJcbiAgICB9XHJcblxyXG4gICAgLy/mm7TmlrDmloflrZfliJfooahcclxuICAgIHByaXZhdGUgcmVuZGVyR3JpZExpc3QoKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDA7IGogPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WTsgaisrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMCA7ICBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHRoaXMuX2ZvbnRzW2ldW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpc3RfZ3JpZHMuZGF0YVNvdXJjZSA9IGFycjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zdHVudEZvbnRzQ2hlY2tBcnIxIDogYW55W10gPSBbXTsgLy/lkIjmiJDmtojpmaTnoa7orqTpmJ/liJdcclxuICAgIHByaXZhdGUgX3N0dW50Rm9udHNDaGVja0FycjIgOiBhbnlbXSA9IFtdOyAvL+e7hOivjea2iOmZpOehruiupOmYn+WIl1xyXG4gICAgLyoqXHJcbiAgICAgKiDmtojpmaTmsYnlrZBcclxuICAgICAqIEBwYXJhbSB4IHjlnZDmoIfmiJbogIVtYXBmb250aW5mb1xyXG4gICAgICogQHBhcmFtIHkgeeWdkOagh1xyXG4gICAgICogQHBhcmFtIHN0dW50Q2hlY2sg5piv5ZCm5omn6KGM5oqA6IO9IOm7mOiupHRydWVcclxuICAgICAqIEBwYXJhbSBpc0hlQ2hlbmdIYW5aaSAg5piv5ZCm5piv5ZCI5oiQ5rGJ5a2Q5pe25YCZ55qE5raI6ZmkIOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwZWxGb250KHggOiBudW1iZXIgfCBNYXBGb250SW5mbywgeSA6IG51bWJlciA9IDApIDogdm9pZHtcclxuICAgICAgICBsZXQgZGlzcGVsRm9udEluZm8gOiBNYXBGb250SW5mbztcclxuICAgICAgICBsZXQgaW5kWCA6IG51bWJlcjtcclxuICAgICAgICBsZXQgaW5kWSA6IG51bWJlcjtcclxuICAgICAgICBpZih4IGluc3RhbmNlb2YgTWFwRm9udEluZm8pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwZWxGb250SW5mbyA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnRzW3gueF1beC55XSA9IG51bGw7XHJcbiAgICAgICAgICAgIGluZFggPSB4Lng7XHJcbiAgICAgICAgICAgIGluZFkgPSB4Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwZWxGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oeCx5KTtcclxuICAgICAgICAgICAgaWYoZGlzcGVsRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW3hdW3ldID0gbnVsbDtcclxuICAgICAgICAgICAgaW5kWCA9IHg7XHJcbiAgICAgICAgICAgIGluZFkgPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkaXNwZWxGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHN5c0luZCA9IHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MuaW5kZXhPZihkaXNwZWxGb250SW5mbykgXHJcbiAgICAgICAgICAgIGlmKHN5c0luZCAhPSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5zcGxpY2Uoc3lzSW5kICwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3lzSW5kID0gdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5pbmRleE9mKGRpc3BlbEZvbnRJbmZvKSBcclxuICAgICAgICAgICAgaWYoc3lzSW5kICE9IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLnNwbGljZShzeXNJbmQgLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkaXNwZWxGb250SW5mby5kZXN0cm95U3R1bnRFZmZlY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmioDog73msYnlrZDmlYjmnpxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnZva2VTdHVudEZvbnQoKSA6IGJvb2xlYW57XHJcbiAgICAgICAgbGV0IHBvaW50czEgPSBbXTtcclxuICAgICAgICBsZXQgcG9pbnRzMiA9IFtdO1xyXG4gICAgICAgIGxldCBzY29yZSA6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IHRlbXBGb250SW5mbyA6IE1hcEZvbnRJbmZvO1xyXG4gICAgICAgIGxldCBlZmZlY3RPYmogPSB7fTtcclxuICAgICAgICBsZXQgcHVzaEFyckZ1biA9IGZ1bmN0aW9uKHggOiBudW1iZXIsIHkgOiBudW1iZXIsIGFyciA6IExheWEuUG9pbnRbXSkgOiB2b2lke1xyXG4gICAgICAgICAgICBpZihlZmZlY3RPYmpbeCArIFwiX1wiICsgeV0gPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2gobmV3IExheWEuUG9pbnQoeCx5KSk7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3RPYmpbeCArIFwiX1wiICsgeV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjEuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgLy/mtojpmaTmioDog73moLzlrZDlm5vlkahcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5mb250SW5mbyAhPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQuZm9udEluZm8ueCxlbGVtZW50LmZvbnRJbmZvLnkpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+aKgOiDveaxieWtl+W3sue7j+iiq+a2iOmZpOS4jeinpuWPkeaKgOiDvVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHB1c2hBcnJGdW4oZWxlbWVudC5mb250SW5mby54IC0gMSxlbGVtZW50LmZvbnRJbmZvLnkscG9pbnRzMSk7XHJcbiAgICAgICAgICAgIHB1c2hBcnJGdW4oZWxlbWVudC5mb250SW5mby54ICsgMSxlbGVtZW50LmZvbnRJbmZvLnkscG9pbnRzMSk7XHJcbiAgICAgICAgICAgIHB1c2hBcnJGdW4oZWxlbWVudC5mb250SW5mby54LGVsZW1lbnQuZm9udEluZm8ueSAtIDEscG9pbnRzMSk7XHJcbiAgICAgICAgICAgIHB1c2hBcnJGdW4oZWxlbWVudC5mb250SW5mby54LGVsZW1lbnQuZm9udEluZm8ueSArIDEscG9pbnRzMSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL+a2iOmZpOWMheWQq+W9k+WJjeWtl+eahOaJgOacieaxieWtkOagvOWtkFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMuX2ZvbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5fZm9udHNbaV0ubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5fZm9udHNbaV1bal0gYXMgTWFwRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8uZ2V0U3RydWN0SW5mb3MoZWxlbWVudC5pZCxmYWxzZSkubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmUgKz0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoQXJyRnVuKHRlbXBGb250SW5mby54LHRlbXBGb250SW5mby55LHBvaW50czIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMi5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAvL+a2iOmZpOWMheWQq+W9k+WJjeWtl+eahOaJgOacieaxieWtkOagvOWtkFxyXG4gICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5fZm9udHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCB0aGlzLl9mb250c1tpXS5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLl9mb250c1tpXVtqXSBhcyBNYXBGb250SW5mbztcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mby5nZXRTdHJ1Y3RJbmZvcyhlbGVtZW50LmlkLGZhbHNlKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29yZSArPTEwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEFyckZ1bih0ZW1wRm9udEluZm8ueCx0ZW1wRm9udEluZm8ueSxwb2ludHMyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCB0aW1lVG9VcGRhdGUgOiBudW1iZXI7XHJcbiAgICAgICAgaWYocG9pbnRzMS5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5RWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIHRpbWVUb1VwZGF0ZSA9IDcwMDtcclxuICAgICAgICAgICAgcG9pbnRzMS5mb3JFYWNoKGVsZW1lbnQyID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudDIueCxlbGVtZW50Mi55KTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlICs9IDEwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQyLngsZWxlbWVudDIueSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg1MDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHBvaW50czEuZm9yRWFjaChlbGVtZW50MyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQzLngsZWxlbWVudDMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LmZvbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5jbGVhckVmZmVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQub25VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg3MDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Rhcih0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnN0YXJfbnVtKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg4NTAsdGhpcyxmdW5jdGlvbigpICA6dm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihwb2ludHMyLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgdGltZVRvVXBkYXRlID0gMTAwMDtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDMwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lkeyAgIFxyXG4gICAgICAgICAgICAgICAgcG9pbnRzMi5mb3JFYWNoKGVsZW1lbnQyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQyLngsZWxlbWVudDIueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQyLngsZWxlbWVudDIueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzMi5mb3JFYWNoKGVsZW1lbnQzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudDMueCxlbGVtZW50My55KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQuZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LmNsZWFyRWZmZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5vblVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTE1MCx0aGlzLGZ1bmN0aW9uKCkgIDp2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zY29yZSArPSBzY29yZTtcclxuICAgICAgICBpZih0aW1lVG9VcGRhdGUgPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKHRpbWVUb1VwZGF0ZSx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFyKHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3Rhcl9udW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjEgPSBbXTtcclxuICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyID0gW107XHJcbiAgICAgICAgcmV0dXJuIHBvaW50czEubGVuZ3RoID4gMCB8fCBwb2ludHMyLmxlbmd0aCA+IDBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa2iOmZpOivjee7hFxyXG4gICAgICogQHBhcmFtIGNoYW5nZUZvbnRJbmZvcyDmnInlj5jmm7TnmoTmsYnlrZDliJfooahcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwZWxDaVp1KGNoYW5nZUZvbnRJbmZvcyA6IE1hcEZvbnRJbmZvW10pIDogYm9vbGVhbntcclxuICAgICAgICBsZXQgY2hlY2tGb250VHh0cyA9IFtdOy8v5b2T5YmN5omA5pyJ5rGJ5a2Q5YiX6KGoXHJcbiAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMDsgaiA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZOyBqKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwIDsgIGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCA7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oaSxqKTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0eHQgPSB0ZW1wRm9udEluZm8udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBpZihjaGVja0ZvbnRUeHRzLmluZGV4T2YodHh0KSA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRm9udFR4dHMucHVzaCh0eHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2hlY2tBcnIgPSBbXTsvL+afpeaJvuaJgOacieWxj+W5leS4iuaJgOacieWtl+eahOivjeWFuO+8jOaJvuWHuuWPr+iDveeahOe7hOWQiOWIl+ihqFxyXG4gICAgICAgIGNoZWNrRm9udFR4dHMuZm9yRWFjaChlbGVtZW50MT0+e1xyXG4gICAgICAgICAgICBsZXQgdGVtcEFyciA9IE1hcEZvbnRJbmZvLmdldEdyb3VwKGVsZW1lbnQxKTtcclxuICAgICAgICAgICAgdGVtcEFyci5mb3JFYWNoKGVsZW1lbnQyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGNoZWNrQXJyLmluZGV4T2YoZWxlbWVudDIpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBjaGFycyA9IGVsZW1lbnQyLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzRml4IDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hlY2tGb250VHh0cy5pbmRleE9mKGNoYXJzW2ldKSA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRml4ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKGlzRml4KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQyID09IHRoaXMuX3BvcHVsYXJHcm91cClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrQXJyLnVuc2hpZnQoZWxlbWVudDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tBcnIucHVzaChlbGVtZW50Mik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/pgY3ljoblj5jmm7TliJfooajvvIzlr7vmib7lj6/mtojpmaTnmoTor43nu4TlubbmiafooYzmtojpmaRcclxuICAgICAgICBsZXQgaXNEaXNwZWwgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgY2hhbmdlRm9udEluZm9zLmZvckVhY2goZWxlbWVudCA9PntcclxuICAgICAgICAgICAgaWYodGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55KSAhPSBlbGVtZW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGNvdXQgPSB0aGlzLmRpc3BlbENpWnVJdGVtKGVsZW1lbnQueCxlbGVtZW50LnksY2hlY2tBcnIpO1xyXG4gICAgICAgICAgICBpZihjb3V0ID09IHRydWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlzRGlzcGVsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGlzRGlzcGVsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NoZWNrQ2hhcnMgOiBzdHJpbmdbXTtcclxuICAgIHByaXZhdGUgZGlzcGVsQ2ladUl0ZW0oeCA6IG51bWJlciwgeSA6IG51bWJlcixjaGVja0FyciA6IHN0cmluZ1tdKSA6IGJvb2xlYW57XHJcbiAgICAgICAgbGV0IHJvb3QgPSB0aGlzLmdldEZvbnRJbmZvKHgseSk7XHJcbiAgICAgICAgaWYocm9vdCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgY2hlY2tBcnIubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBjaGVja0FycltpXTtcclxuICAgICAgICAgICAgaWYoZ3JvdXAuaW5kZXhPZihyb290LnRleHQpID09IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jaGVja0NoYXJzID0gZ3JvdXAuc3BsaXQoXCJcIik7XHJcbiAgICAgICAgICAgIGxldCBhU3RhckluZm8gPSB0aGlzLmRpc3BlbENpWnVJdGVtU3VyZSh4LHksbnVsbCk7XHJcbiAgICAgICAgICAgIGlmKGFTdGFySW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+a2iOmZpOivjee7hFxyXG4gICAgICAgICAgICAgICAgU291bmRUb29sLnBsYXlYaWFvQ2h1RWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgICAgIGlmKGdyb3VwID09IHRoaXMuX3BvcHVsYXJHcm91cClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb3B1bGFyR3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmtojpmaTor43nu4TvvJo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLor43nu4TvvJpcIiArIGdyb3VwKVxyXG4gICAgICAgICAgICAgICAgbGV0IHNjb3JlID0gNDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRzID0gYVN0YXJJbmZvLmdldFN1cmVMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2ladU9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2ladU9ialtlbGVtZW50LnggKyBcIl9cIiArIGVsZW1lbnQueV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udCA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicG9pbnQgOiAoXCIrdGVtcEZvbnQueCtcIixcIit0ZW1wRm9udC55K1wiLFwiK3RlbXBGb250LnRleHQrXCIpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udC5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMi5wdXNoKHtmb250SW5mbyA6IHRlbXBGb250LGlkIDogdGVtcEZvbnQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lICsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250ID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LnggLSAxLGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250LmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyLnB1c2goe2ZvbnRJbmZvIDogdGVtcEZvbnQsaWQgOiB0ZW1wRm9udC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250ID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LnggKyAxLGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250LmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyLnB1c2goe2ZvbnRJbmZvIDogdGVtcEZvbnQsaWQgOiB0ZW1wRm9udC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnQgPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQuaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIucHVzaCh7Zm9udEluZm8gOiB0ZW1wRm9udCxpZCA6IHRlbXBGb250LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udCA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udC5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMi5wdXNoKHtmb250SW5mbyA6IHRlbXBGb250LGlkIDogdGVtcEZvbnQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzY29yZSArPSAodGltZSAqIDEwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njb3JlICs9IHNjb3JlO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDUwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LmZvbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5jbGVhckVmZmVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQub25VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMjAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBYID0gZWxlbWVudC54IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBZID0gZWxlbWVudC55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaVp1T2JqW3RlbXBYICsgXCJfXCIgKyB0ZW1wWV0gIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQodGVtcFgsdGVtcFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBYID0gZWxlbWVudC54ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFkgPSBlbGVtZW50Lnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNpWnVPYmpbdGVtcFggKyBcIl9cIiArIHRlbXBZXSAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdCh0ZW1wWCx0ZW1wWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFggPSBlbGVtZW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBZID0gZWxlbWVudC55IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2ladU9ialt0ZW1wWCArIFwiX1wiICsgdGVtcFldICE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KHRlbXBYLHRlbXBZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wWCA9IGVsZW1lbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFkgPSBlbGVtZW50LnkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaVp1T2JqW3RlbXBYICsgXCJfXCIgKyB0ZW1wWV0gIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQodGVtcFgsdGVtcFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSg3MDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERpc3BlbFRleHQoZ3JvdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFyKHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3Rhcl9udW0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODUwLHRoaXMsZnVuY3Rpb24oKSAgOnZvaWR7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRpc3BlbENpWnVJdGVtU3VyZSh4IDogbnVtYmVyLCB5IDogbnVtYmVyLHBhcmVudEFTdGFySW5mbyA6IFNlYXJjaEluZm8pIDogU2VhcmNoSW5mb3tcclxuICAgICAgICBcclxuICAgICAgICBsZXQgY3VycmVudEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyh4LHkpO1xyXG4gICAgICAgIGlmKGN1cnJlbnRGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjaGFycyA9IHBhcmVudEFTdGFySW5mbyA9PSBudWxsID8gdGhpcy5fY2hlY2tDaGFycy5jb25jYXQoKSA6cGFyZW50QVN0YXJJbmZvLmNoYXJzLmNvbmNhdCgpO1xyXG4gICAgICAgIGlmKGNoYXJzLmluZGV4T2YoY3VycmVudEZvbnRJbmZvLnRleHQpID09IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBhU3RhckluZm8gPSBuZXcgU2VhcmNoSW5mbygpO1xyXG4gICAgICAgIGFTdGFySW5mby5jdXJyZW50UG9pbnQueCA9IHg7XHJcbiAgICAgICAgYVN0YXJJbmZvLmN1cnJlbnRQb2ludC55ID0geTtcclxuICAgICAgICBhU3RhckluZm8uc2V0T3Blbkxpc3QocGFyZW50QVN0YXJJbmZvID09IG51bGwgPyBbXSA6IHBhcmVudEFTdGFySW5mby5nZXRPcGVuTGlzdCgpLmNvbmNhdCgpKVxyXG4gICAgICAgIGFTdGFySW5mby5zZXRTdXJlTGlzdChwYXJlbnRBU3RhckluZm8gPT0gbnVsbCA/IFtdIDogcGFyZW50QVN0YXJJbmZvLmdldFN1cmVMaXN0KCkuY29uY2F0KCkpO1xyXG4gICAgICAgIGFTdGFySW5mby5vcGVuKHgseSxmYWxzZSk7XHJcbiAgICAgICAgYVN0YXJJbmZvLnN1cmUoeCx5KTtcclxuICAgICAgICBhU3RhckluZm8uY2hhcnMgPSBjaGFycztcclxuICAgICAgICBhU3RhckluZm8uY2hhcnMuc3BsaWNlKGFTdGFySW5mby5jaGFycy5pbmRleE9mKGN1cnJlbnRGb250SW5mby50ZXh0KSwxKTtcclxuICAgICAgICBpZihhU3RhckluZm8uY2hhcnMubGVuZ3RoID09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gYVN0YXJJbmZvO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4IC0gMSx5KSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4IC0gMSx5KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHggLSAxLHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4ICsgMSx5KSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4ICsgMSx5KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHggKyAxLHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4LHkgLSAxKSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4LHkgLSAxKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHgseSAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighYVN0YXJJbmZvLmlzT3Blbih4LHkgKyAxKSAmJiAhYVN0YXJJbmZvLmlzU3VyZSh4LHkgKyAxKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFTdGFySW5mby5vcGVuKHgseSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3Blbkxpc3QgPSBhU3RhckluZm8uZ2V0T3Blbkxpc3QoKTtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IG9wZW5MaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgY291dCA9IHRoaXMuZGlzcGVsQ2ladUl0ZW1TdXJlKGVsZW1lbnQueCwgZWxlbWVudC55LCBhU3RhckluZm8pO1xyXG4gICAgICAgICAgICBpZihjb3V0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5raI5a2XXHJcbiAgICAgKiBAcGFyYW0geCBcclxuICAgICAqIEBwYXJhbSB5IFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRpc3BlbCh4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IGJvb2xlYW57XHJcbiAgICAgICAgbGV0IHRhcmdldEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyh4LHkpO1xyXG4gICAgICAgIGlmKHRhcmdldEZvbnRJbmZvID09IG51bGwpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBjYW5IZUNoZW5nRm9udEluZm9zID0gdGFyZ2V0Rm9udEluZm8uY2FuSGVDaGVuZ0ZvbnRJbmZvcztcclxuICAgICAgICBpZihjYW5IZUNoZW5nRm9udEluZm9zLmxlbmd0aCA9PSAwKXJldHVybiBmYWxzZTtcclxuICAgICAgICBsZXQgcG9wdWxhckdyb3VwID0gdGhpcy5fcG9wdWxhckdyb3VwO1xyXG4gICAgICAgIGlmKHBvcHVsYXJHcm91cCAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FuSGVDaGVuZ0ZvbnRJbmZvcy5zb3J0KGZ1bmN0aW9uKGEgOiBNYXBGb250SW5mbywgYiA6IE1hcEZvbnRJbmZvKSA6IG51bWJlcntcclxuICAgICAgICAgICAgICAgIGlmKHBvcHVsYXJHcm91cC5pbmRleE9mKGEudGV4dCkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihwb3B1bGFyR3JvdXAuaW5kZXhPZihiLnRleHQpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v6YGN5Y6G5Y+Y5pu05YiX6KGo77yM5a+75om+5Y+v5raI6Zmk55qE6K+N57uE5bm25omn6KGM5raI6ZmkXHJcbiAgICAgICAgbGV0IGhhc0hlQ2hlbmcgPSBmYWxzZTtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPTAgOyBpPCBjYW5IZUNoZW5nRm9udEluZm9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoaGFzSGVDaGVuZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA9IGNhbkhlQ2hlbmdGb250SW5mb3NbaV07XHJcbiAgICAgICAgICAgIGxldCBzdHJ1Y3RJbmZvTGlzdCA9IHRlbXBGb250SW5mby5zdHJ1Y3RJbmZvLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMDsgaiA8IHN0cnVjdEluZm9MaXN0Lmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RydWN0TGlzdCA9IHN0cnVjdEluZm9MaXN0W2pdLnNwbGl0KFwiX1wiKTtcclxuICAgICAgICAgICAgICAgIGlmKHN0cnVjdExpc3QubGVuZ3RoID4gMSAmJiBzdHJ1Y3RMaXN0LmluZGV4T2YodGFyZ2V0Rm9udEluZm8uaWQudG9TdHJpbmcoKSkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdXQgPSB0aGlzLmRpc3BlbEl0ZW0odGFyZ2V0Rm9udEluZm8ueCx0YXJnZXRGb250SW5mby55LHN0cnVjdExpc3QsdGVtcEZvbnRJbmZvLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb3V0KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzSGVDaGVuZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGFzSGVDaGVuZ1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NoZWNrSWRzIDogc3RyaW5nW10gPSBbXTtcclxuICAgIHByaXZhdGUgZGlzcGVsSXRlbSh4IDogbnVtYmVyLHkgOiBudW1iZXIsY2hlY2tBcnIgOiBzdHJpbmdbXSxmb250SWQgOiBudW1iZXIpIDogYm9vbGVhbntcclxuICAgICAgICBsZXQgcm9vdCA9IHRoaXMuZ2V0Rm9udEluZm8oeCx5KTtcclxuICAgICAgICBpZihyb290ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NoZWNrSWRzID0gY2hlY2tBcnI7XHJcbiAgICAgICAgbGV0IHNlYXJjaEluZm8gPSB0aGlzLmRpc3BlbEl0ZW1TdXJlKHgseSxudWxsKTtcclxuICAgICAgICBpZihzZWFyY2hJbmZvICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+a2iOmZpOW5tuWQiOaIkOaxieWtkFxyXG4gICAgICAgICAgICBTb3VuZFRvb2wucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5RWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIGxldCBtYXhRdWFsaXR5ID0gMDtcclxuICAgICAgICAgICAgbGV0IHBvaW50cyA9IHNlYXJjaEluZm8uZ2V0U3VyZUxpc3QoKTtcclxuICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRHcmlkID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LCBlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgaWYobWF4UXVhbGl0eSA8IHRlbXBGb250SW5mby5xdWFsaXR5KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1heFF1YWxpdHkgPSB0ZW1wRm9udEluZm8ucXVhbGl0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRlbXBGb250R3JpZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250R3JpZC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5raI6Zmk5qC85a2QOiAoXCIrZWxlbWVudC54K1wiLFwiK2VsZW1lbnQueStcIilcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZXQgY291dEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHtpZCA6IGZvbnRJZH0pO1xyXG4gICAgICAgICAgICB0aGlzLnNldERpc3BlbFRleHQoY291dEZvbnRJbmZvLnRleHQpO1xyXG4gICAgICAgICAgICBjb3V0Rm9udEluZm8ueCA9IHg7XHJcbiAgICAgICAgICAgIGNvdXRGb250SW5mby55ID0geTtcclxuICAgICAgICAgICAgY291dEZvbnRJbmZvLnF1YWxpdHkgPSBtYXhRdWFsaXR5ICsgMTtcclxuICAgICAgICAgICAgbGV0IHRhcmdldENlbGwgPSB0aGlzLmdldEZvbnRDZWxsKHgseSk7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRQb2ludCA9IG5ldyBMYXlhLlBvaW50KHRhcmdldENlbGwueCwgdGFyZ2V0Q2VsbC55KTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDUwMCx0aGlzLGZ1bmN0aW9uKHBhcl9wb2ludHMpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHBhcl9wb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsIGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvID09IG51bGwpcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQueCAhPSB4IHx8IGVsZW1lbnQueSAhPSB5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vdmVTdGFydENlbGwgPSB0aGlzLmdldEZvbnRDZWxsKGVsZW1lbnQueCwgZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vdmVTdGFydEZvbnRHcmlkU2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlU3RhcnRGb250R3JpZFNjcmlwdC5mb250ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZVN0YXJ0Rm9udEdyaWRTY3JpcHQuY2xlYXJFZmZlY3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlQ2VsbCA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJGb250R3JpZFwiLCB0aGlzLnByZWZhYl9mb250R3JpZC5jcmVhdGUsIHRoaXMucHJlZmFiX2ZvbnRHcmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUNlbGxbXCJ4XCJdID0gbW92ZVN0YXJ0Q2VsbFtcInhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVDZWxsW1wieVwiXSA9IG1vdmVTdGFydENlbGxbXCJ5XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZUZvbnRHcmlkU2NyaXB0ID0gKG1vdmVDZWxsLmdldENvbXBvbmVudChGb250R3JpZCkgYXMgRm9udEdyaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRm9udEdyaWRTY3JpcHQuZm9udCA9IHRlbXBGb250SW5mby50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRm9udEdyaWRTY3JpcHQuYWRkRWZmZWN0KHRlbXBGb250SW5mby5nZXRTdHVudEZvbnRFZmZlY3QoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVGb250R3JpZFNjcmlwdC5vblVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RfZ3JpZHMuYWRkQ2hpbGQobW92ZUNlbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMYXlhLlR3ZWVuLnRvKG1vdmVDZWxsLHt4IDogdGFyZ2V0UG9pbnQueCwgeSA6IHRhcmdldFBvaW50Lnl9LDEwMCxudWxsLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbih0YXJnZXRNYykgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TWMuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxbbW92ZUNlbGxdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAmJiB0ZW1wRm9udEluZm8uaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIxLnB1c2goe2ZvbnRJbmZvIDogY291dEZvbnRJbmZvLGlkIDogdGVtcEZvbnRJbmZvLmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxbcG9pbnRzXSk7XHJcbiAgICAgICAgICAgIGxldCBzY29yZSA9IDEwO1xyXG4gICAgICAgICAgICBsZXQgdGltZSA9IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHNjb3JlICs9IDEwICogdGltZTtcclxuICAgICAgICAgICAgdGhpcy5fc2NvcmUgKz0gc2NvcmU7XHJcbiAgICAgICAgICAgIENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoVGlwQ29udHJvbGxlcikuc2hvd0xlZnRCb3R0b21UaXAoXCIrXCIgKyBzY29yZSk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg1NTAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW3hdW3ldID0gY291dEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoeCx5KTtcclxuICAgICAgICAgICAgICAgIHRhcmdldEZvbnRTY3JpcHQuZm9udCA9IGNvdXRGb250SW5mby50ZXh0O1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Rm9udFNjcmlwdC5hZGRFZmZlY3QoY291dEZvbnRJbmZvLmdldFN0dW50Rm9udEVmZmVjdCgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Rhcih0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnN0YXJfbnVtKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX251UWkgKys7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU51UWkoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDcwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLlkIjmiJDmsYnlrZDvvJo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIoXCIrY291dEZvbnRJbmZvLngrXCIsXCIrY291dEZvbnRJbmZvLnkrXCIsXCIrY291dEZvbnRJbmZvLnRleHQrXCIpXCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLnB1c2goY291dEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGlzcGVsSXRlbVN1cmUoeCA6IG51bWJlciwgeSA6IG51bWJlcixwYXJlbnRBU3RhckluZm8gOiBTZWFyY2hJbmZvKSA6IFNlYXJjaEluZm9cclxuICAgIHtcclxuICAgICAgICBsZXQgY3VycmVudEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyh4LHkpO1xyXG4gICAgICAgIGlmKGN1cnJlbnRGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjaGFycyA9IHBhcmVudEFTdGFySW5mbyA9PSBudWxsID8gdGhpcy5fY2hlY2tJZHMuY29uY2F0KCkgOnBhcmVudEFTdGFySW5mby5jaGFycy5jb25jYXQoKTtcclxuICAgICAgICBpZihjaGFycy5pbmRleE9mKGN1cnJlbnRGb250SW5mby5pZC50b1N0cmluZygpKSA9PSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYVN0YXJJbmZvID0gbmV3IFNlYXJjaEluZm8oKTtcclxuICAgICAgICBhU3RhckluZm8uY3VycmVudFBvaW50LnggPSB4O1xyXG4gICAgICAgIGFTdGFySW5mby5jdXJyZW50UG9pbnQueSA9IHk7XHJcbiAgICAgICAgYVN0YXJJbmZvLnNldE9wZW5MaXN0KHBhcmVudEFTdGFySW5mbyA9PSBudWxsID8gW10gOiBwYXJlbnRBU3RhckluZm8uZ2V0T3Blbkxpc3QoKS5jb25jYXQoKSlcclxuICAgICAgICBhU3RhckluZm8uc2V0U3VyZUxpc3QocGFyZW50QVN0YXJJbmZvID09IG51bGwgPyBbXSA6IHBhcmVudEFTdGFySW5mby5nZXRTdXJlTGlzdCgpLmNvbmNhdCgpKTtcclxuICAgICAgICBhU3RhckluZm8ub3Blbih4LHksZmFsc2UpO1xyXG4gICAgICAgIGFTdGFySW5mby5zdXJlKHgseSk7XHJcbiAgICAgICAgYVN0YXJJbmZvLmNoYXJzID0gY2hhcnM7XHJcbiAgICAgICAgYVN0YXJJbmZvLmNoYXJzLnNwbGljZShhU3RhckluZm8uY2hhcnMuaW5kZXhPZihjdXJyZW50Rm9udEluZm8uaWQudG9TdHJpbmcoKSksMSk7XHJcbiAgICAgICAgaWYoYVN0YXJJbmZvLmNoYXJzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFTdGFySW5mbztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCAtIDEseSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCAtIDEseSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4IC0gMSx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCArIDEseSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCArIDEseSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4ICsgMSx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCx5IC0gMSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCx5IC0gMSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4LHkgLSAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCx5ICsgMSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCx5ICsgMSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4LHkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG9wZW5MaXN0ID0gYVN0YXJJbmZvLmdldE9wZW5MaXN0KCk7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBvcGVuTGlzdFtpXTtcclxuICAgICAgICAgICAgbGV0IGNvdXQgPSB0aGlzLmRpc3BlbEl0ZW1TdXJlKGVsZW1lbnQueCwgZWxlbWVudC55LCBhU3RhckluZm8pO1xyXG4gICAgICAgICAgICBpZihjb3V0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2d1aWRlSW1ncyA9IHt9O1xyXG4gICAgcHJpdmF0ZSBfZ3VpZGVSYXRlIDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZGVzdHJveUd1aWRlSW1ncygpIDogdm9pZHtcclxuICAgICAgICBmb3IobGV0IHRlbXBQcm9wZXJ0eSBpbiB0aGlzLl9ndWlkZUltZ3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdGVtcEltZyA9IHRoaXMuX2d1aWRlSW1nc1t0ZW1wUHJvcGVydHldO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRlbXBJbWcpO1xyXG4gICAgICAgICAgICBMYXlhLlR3ZWVuLmNsZWFyQWxsKHRlbXBJbWcpO1xyXG4gICAgICAgICAgICB0ZW1wSW1nLmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2d1aWRlSW1ncyA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlvqrnjq/miYDmnInpobbmoLzvvIzmmL7npLrot5/lvZPliY3po5jokL3nmoTmsYnlrZDmnInlhbPogZTnmoTmoLzlrZDvvIzljbPlj6/nu4TmiJDor43or63miJbogIXlkozlkIjmiJDmsYnlrZDnmoTmoLzlrZBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBndWlkZVRvR3JpZCgpIDogdm9pZHtcclxuICAgICAgICBmb3IobGV0IHRlbXBQcm9wZXJ0eSBpbiB0aGlzLl9ndWlkZUltZ3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdGVtcEltZyA9IHRoaXMuX2d1aWRlSW1nc1t0ZW1wUHJvcGVydHldO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRlbXBJbWcpO1xyXG4gICAgICAgICAgICBMYXlhLlR3ZWVuLmNsZWFyQWxsKHRlbXBJbWcpO1xyXG4gICAgICAgICAgICB0ZW1wSW1nLmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2d1aWRlSW1ncyA9IHt9O1xyXG4gICAgICAgIGxldCByYXRlID0gTWF0aC5yYW5kb20oKSAqIDEwMDtcclxuICAgICAgICBpZihyYXRlID4gdGhpcy5fZ3VpZGVSYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ3VpZGVSYXRlID0gTWF0aC5taW4oIHRoaXMuX2d1aWRlUmF0ZSArIDEsNSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRyb3BpbmdGb250Q2FuSGVDaGVuZ0ZvbnRJbmZvcyA9IHRoaXMuX2Ryb3BpbmdGb250SW5mby5jYW5IZUNoZW5nRm9udEluZm9zO1xyXG4gICAgICAgIGxldCBkcm9waW5nRm9udENhbkhlQ2hlbmdHcm91cHMgPSB0aGlzLl9kcm9waW5nRm9udEluZm8uY2FuSGVDaGVuZ0dyb3VwcztcclxuICAgICAgICBsZXQgdG9wRm9udEluZm9zID0gdGhpcy5nZXRUb3BGb250SW5mb3MoKTtcclxuICAgICAgICBsZXQgcG9pbnRzID0gW107XHJcbiAgICAgICAgdG9wRm9udEluZm9zLmZvckVhY2godGVtcEZvbnRJbmZvID0+IHtcclxuICAgICAgICAgICAgZHJvcGluZ0ZvbnRDYW5IZUNoZW5nR3JvdXBzLmZvckVhY2godGVtcEdyb3VwID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBHcm91cC5sZW5ndGggIT0gMilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBBcnIgPSB0ZW1wR3JvdXAuc3BsaXQoXCJcIik7XHJcbiAgICAgICAgICAgICAgICBncm91cEFyci5zcGxpY2UoZ3JvdXBBcnIuaW5kZXhPZih0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCksMSk7XHJcbiAgICAgICAgICAgICAgICBpZihncm91cEFyci5pbmRleE9mKHRlbXBGb250SW5mby50ZXh0KSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+WPr+WQiOaIkOivjee7hFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBMYXlhLlBvaW50KHRlbXBGb250SW5mby54LHRlbXBGb250SW5mby55KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZHJvcGluZ0ZvbnRDYW5IZUNoZW5nRm9udEluZm9zLmZvckVhY2godGVtcE1lcmdlRm9udEluZm8gPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0cnVjdEluZm9zID0gdGVtcE1lcmdlRm9udEluZm8uZ2V0U3RydWN0SW5mb3ModGVtcEZvbnRJbmZvLmlkKTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzdHJ1Y3RJbmZvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcFN0cnVja0luZm8gPSBzdHJ1Y3RJbmZvc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcFN0cnVja0FyciA9IHRlbXBTdHJ1Y2tJbmZvLnNwbGl0KFwiX1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wU3RydWNrQXJyLmxlbmd0aCAhPSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBTdHJ1Y2tBcnIuc3BsaWNlKHRlbXBTdHJ1Y2tBcnIuaW5kZXhPZih0ZW1wRm9udEluZm8uaWQudG9TdHJpbmcoKSksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcFN0cnVja0Fyci5pbmRleE9mKHRoaXMuX2Ryb3BpbmdGb250SW5mby5pZC50b1N0cmluZygpKSAhPSAtMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+v5ZCI5oiQ5rGJ5a2QXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBMYXlhLlBvaW50KHRlbXBGb250SW5mby54LHRlbXBGb250SW5mby55KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYocG9pbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9ndWlkZVJhdGUgPSAwO1xyXG4gICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2d1aWRlSW1nc1tlbGVtZW50LnggKyBcIi1cIiArIGVsZW1lbnQueV0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEdyaWQgPSB0aGlzLmdldEZvbnRDZWxsKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBJbWcgPSBuZXcgTGF5YS5JbWFnZShcIm1hcC90el9qaWFudG91LnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgIHRlbXBJbWcuc2NhbGVYID0gdGVtcEltZy5zY2FsZVkgPSAwLjc7XHJcbiAgICAgICAgICAgICAgICB0ZW1wSW1nLnJvdGF0aW9uID0gOTA7XHJcbiAgICAgICAgICAgICAgICB0ZW1wSW1nLnggPSA3NTtcclxuICAgICAgICAgICAgICAgIHRlbXBJbWcueSA9IC03NTtcclxuICAgICAgICAgICAgICAgIHRlbXBHcmlkLmFkZENoaWxkKHRlbXBJbWcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVJbWdzW2VsZW1lbnQueCArIFwiLVwiICsgZWxlbWVudC55XSA9IHRlbXBJbWc7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLmxvb3AoMTAwMCx0ZW1wSW1nLGZ1bmN0aW9uKHBhcl9pbWcgOiBMYXlhLkltYWdlKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldFkgPSBwYXJfaW1nLnkgPT0gLTc1PyAtODUgOiAtNzU7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5YS5Ud2Vlbi50byhwYXJfaW1nLHt5IDogdGFyZ2V0WX0sNzUwKTtcclxuICAgICAgICAgICAgICAgIH0sW3RlbXBJbWddKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZvbnRJbmZvKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogTWFwRm9udEluZm9cclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLl9mb250c1t4XSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb250c1t4XVt5XTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZvbnRDZWxsKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogTGF5YS5Cb3hcclxuICAgIHtcclxuICAgICAgICBpZih5IDwgMCB8fCB5ID49IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZIHx8IHggPCAwIHx8IHggPj0gdGhpcy5saXN0X2dyaWRzLnJlcGVhdFgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdF9ncmlkcy5nZXRDZWxsKHkgKiB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCArIHgpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGb250U2NyaXB0KHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogRm9udEdyaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgZm9udENlbGwgPSB0aGlzLmdldEZvbnRDZWxsKHgsIHkpO1xyXG4gICAgICAgIGlmKGZvbnRDZWxsID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBmb250Q2VsbC5nZXRDb21wb25lbnQoRm9udEdyaWQpIGFzIEZvbnRHcmlkO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5L+h5oGv5pu05pawXHJcbiAgICBwdWJsaWMgcmVmcmVzaCgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLnNldFN0YXIodGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zdGFyX251bSk7XHJcbiAgICAgICAgdGhpcy50eHRfcGxheWVyTmFtZS50ZXh0ID0gdGhpcy5fbXlQbGF5ZXJJbmZvLm5hbWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVOZXh0RHJvcGluZ0ZvbnQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQb3B1bGFyR3JvdXAoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU51UWkoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTY29yZSgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLnR4dF9zY29yZS50ZXh0ID0gdGhpcy5fc2NvcmUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvcHVsYXJHcm91cCgpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9wb3B1bGFyR3JvdXAgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBiYW5rID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImJhbmtcIl07XHJcbiAgICAgICAgICAgIHRoaXMuX3BvcHVsYXJHcm91cCA9IGJhbmtbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYmFuay5sZW5ndGgpXTtcclxuICAgICAgICAgICAgdGhpcy5oZUNpU3BsaXRUaW1lcyA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3BvcHVsYXJHcm91cCAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy50eHRfcG9wdWxhckdyb3VwLnRleHQgPSB0aGlzLl9wb3B1bGFyR3JvdXA7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nX3BvcHVsYXJHcm91cEJnLmhlaWdodCA9IHRoaXMudHh0X3BvcHVsYXJHcm91cC5kaXNwbGF5SGVpZ2h0ICsgMTY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTmV4dERyb3BpbmdGb250KCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudHh0X25leHRGb250LnRleHQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy50eHRfbmV4dEZvbnQudGV4dCA9IHRoaXMuX25leHREcm9waW5nRm9udEluZm8udGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXREaXNwZWxUZXh0KHRleHQgOiBzdHJpbmcpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlR3ZWVuLmNsZWFyQWxsKHRoaXMubWNfZGlzcGVsVGV4dCk7XHJcbiAgICAgICAgdGhpcy5tY19kaXNwZWxUZXh0LnNjYWxlWCA9IHRoaXMubWNfZGlzcGVsVGV4dC5zY2FsZVkgPSAwLjQ7XHJcbiAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC50ZXh0ID0gdGV4dDtcclxuICAgICAgICBzd2l0Y2godGV4dC5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LmZvbnRTaXplID0gMTIwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5zaXplKDEyMCwxMjApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuZm9udFNpemUgPSA2MDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuc2l6ZSgxMjAsNjApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuZm9udFNpemUgPSA0MDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuc2l6ZSgxMjAsNDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuZm9udFNpemUgPSAzMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuc2l6ZSgxMjAsMzApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExheWEuVHdlZW4udG8odGhpcy5tY19kaXNwZWxUZXh0LHtzY2FsZVggOiAxLHNjYWxlWSA6IDF9LDMwMClcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFN0YXIoc3RhciA6IG51bWJlcikgOiB2b2lke1xyXG4gICAgICAgIGxldCBsaXN0ID0gW107XHJcbiAgICAgICAgd2hpbGUoc3RhciA+IDAgfHwgbGlzdC5sZW5ndGggPCA1KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHN0YXIgPiAwKVxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRydWUpXHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goZmFsc2UpXHJcbiAgICAgICAgICAgIHN0YXIgLS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGlzdF9zdGFyLmRhdGFTb3VyY2UgPSBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTnVRaSgpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9udVFpID49IDEzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9cYuinpuWPkeaAkuawlO+8jOmaj+acuua2iOmZpOS4gOihjOS4gOWIl1xyXG4gICAgICAgICAgICBsZXQgZm9udHNBcnIgPSB0aGlzLmdldEFsbEZvbnRzKCk7XHJcbiAgICAgICAgICAgIGlmKGZvbnRzQXJyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBzY29yZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgIGxldCBudVFpRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQoZm9udHNBcnIpIGFzIE1hcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpICsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW251UWlGb250SW5mby55XSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmUgKz0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKG5ldyBMYXlhLlBvaW50KGksIG51UWlGb250SW5mby55KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFk7IGkgKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaSAhPSBudVFpRm9udEluZm8ueClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKG5ldyBMYXlhLlBvaW50KG51UWlGb250SW5mby54LCBpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW251UWlGb250SW5mby54XVtpXSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29yZSArPSAxMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njb3JlICs9IHNjb3JlO1xyXG4gICAgICAgICAgICAgICAgU291bmRUb29sLnBsYXlUZUppRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlOdVFpRWZmZWN0KGFycik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9udVFpID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGxldCBpID0gdGhpcy5fbnVRaVxyXG4gICAgICAgIHdoaWxlKGkgPiAwIHx8IGxpc3QubGVuZ3RoIDwgMTMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoaSA+IDApXHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godHJ1ZSlcclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChmYWxzZSlcclxuICAgICAgICAgICAgaSAtLTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGlzdCA9IGxpc3QucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMubGlzdF9udVFpLmRhdGFTb3VyY2UgPSBsaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGxheU51UWlFZmZlY3QocG9pbnRzIDogTGF5YS5Qb2ludFtdKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5wbGF5RWZmZWN0SW5jKCk7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wRm9udEdyaWQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgIGlmKHRlbXBGb250R3JpZCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRm9udEdyaWQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5oCS5rCU5raI6ZmkOiAoXCIrZWxlbWVudC54K1wiLFwiK2VsZW1lbnQueStcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNTAwLHRoaXMsZnVuY3Rpb24gKCkgOiB2b2lke1xyXG4gICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8uaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMS5wdXNoKHtmb250SW5mbyA6IHRlbXBGb250SW5mbyxpZCA6IHRlbXBGb250SW5mby5pZH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDY1MCx0aGlzLGZ1bmN0aW9uICgpIDogdm9pZHtcclxuICAgICAgICAgICAgdGhpcy5lbmRFZmZlY3RJbmMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXIodGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zdGFyX251bSk7XHJcbiAgICAgICAgICAgIHRoaXMuX251UWkgKys7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/nlJ/miJDlrZdcclxuICAgIHByaXZhdGUgaGVDaVNwbGl0VGltZXMgOiBudW1iZXIgPSAxOyAvL+WQiOaIkOW9k+WJjeW3pui+ueivjee7hOWksei0peasoeaVsFxyXG4gICAgcHJpdmF0ZSBoZUNpenVSYXRlIDogbnVtYmVyID0gNDA7IC8v5Ye6546w5bem6L656YKj5Liq6K+N57uE55qE5qaC546HXHJcbiAgICBwcml2YXRlIGhhblppUmF0ZSA6IG51bWJlciA9IDYwIDsgLy8g5Ye6546w6IO96Lef5LqU5YiX5pyA5aSW6L655rGJ5a2X5ZCI5oiQ5rGJ5a2X55qE5qaC546HXHJcbiAgICBwcml2YXRlIGNpWnVSYXRlIDogbnVtYmVyID0gNjA7IC8vIOWHuueOsOiDvei3n+S6lOWIl+acgOWklui+ueaxieWtl+WQiOaIkOivjee7hOeahOamgueOh1xyXG4gICAgcHJpdmF0ZSBidVNob3VSYXRlIDogbnVtYmVyID0gMDsgLy/lh7rnjrDnibnmrorpg6jpppbnmoTmpoLnjodcclxuICAgIHJhbmRvbU5leHRGb250KCk6dm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fZGVidWdNb2RlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHR4dCA9IHRoaXMuX2RlYnVnRHJvcEZvbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiB0eHR9KTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mby50ZXh0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihNYXRoLnJhbmRvbSgpICogMTAwID4gdGhpcy5idVNob3VSYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5idVNob3VSYXRlID0gTWF0aC5taW4odGhpcy5idVNob3VSYXRlICsgMSw1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVTaG91UmF0ZSA9IDA7XHJcbiAgICAgICAgICAgIGxldCB0eHQgPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQoTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcInN0dW50X2ZvbnRcIl0pIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHR4dH0pO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLnRleHQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby5pc1N0dW50Rm9udCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fZ3VpZGVEcm9wRm9udHMubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0eHQgPSB0aGlzLl9ndWlkZURyb3BGb250cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogdHh0fSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8udGV4dCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc3BsaXRGb250V29yZHMubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQodGhpcy5fc3BsaXRGb250V29yZHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3Jkcy5zcGxpY2UodGhpcy5fc3BsaXRGb250V29yZHMuaW5kZXhPZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvKSwgMSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudCh0aGlzLl9zcGxpdEdyb3VwV29yZHMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMuc3BsaWNlKHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5pbmRleE9mKHRoaXMuX25leHREcm9waW5nRm9udEluZm8pLCAxKTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy/moLnmja7lvZPliY3moLzlrZDmlbDku6Xlj4rlvZPliY3mmJ/nuqcg6I635b6X5LiA5Liq5Zuw6Zq+57O75pWwIOavlOWmguaYrzUwXHJcbiAgICAgICAgbGV0IGt1bk5hbiA6IG51bWJlciA9IHRoaXMuZ2V0TmFuRHVYaVNodSgpICogdGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zcGxpdF9yYXRlO1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBNYXRoLm1pbigxMDAsTWF0aC5mbG9vcih0aGlzLmhlQ2l6dVJhdGUqa3VuTmFuLzEwMDAwKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0UmFuZG9tUmVzdWx0KHJlc3VsdCkpIHsgLy/pmo/mnLrliLDlh7rlt6bovrnor43nu4Tnm7jlhbPogZTmsYnlrZdcclxuICAgICAgICAgICAgdGhpcy5oYW5aaVJhdGUgKz0gMTA7IC8vIOaOpeS4i+adpeWHuueOsOaXoOWFs+iBlOaxieWtl+amgueOh+WKoDEwXHJcbiAgICAgICAgICAgIHRoaXMuY2ladVJhdGUgKz0gMTAgLy8g5o6l5LiL5p2l5Ye6546w5peg5YWz6IGU5rGJ5a2X5bm25LiONeWIl+iDveWQiOaIkOivjeeahOamgueOh+WKoDEwXHJcbiAgICAgICAgICAgIHRoaXMuaGVDaXp1UmF0ZSA9IDEwO1xyXG4gICAgICAgICAgICBpZih0aGlzLl93b3Jkcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZUNpU3BsaXRUaW1lcyArKztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dvcmRzID0gdGhpcy5zcGxpdEdyb3VwVG9Gb250SW5mb3ModGhpcy5fcG9wdWxhckdyb3VwLG51bGwsIHRoaXMuaGVDaVNwbGl0VGltZXMgPiAyID8gXCJzcGVjaWFsXCI6IFwiY29tbWVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQodGhpcy5fd29yZHMpO1xyXG4gICAgICAgICAgICB0aGlzLl93b3Jkcy5zcGxpY2UodGhpcy5fd29yZHMuaW5kZXhPZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvKSwxKTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IFxyXG4gICAgICAgIHRoaXMuaGVDaXp1UmF0ZSArPSAxNTtcclxuICAgICAgICBsZXQgdG9wRm9udEluZm9zID0gdGhpcy5nZXRUb3BGb250SW5mb3MoKTtcclxuICAgICAgICBpZih0b3BGb250SW5mb3MubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0b3BGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudCh0b3BGb250SW5mb3MpIGFzIE1hcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICBpZih0b3BGb250SW5mby5jYW5IZUNoZW5nRm9udCAmJiB0aGlzLmdldFJhbmRvbVJlc3VsdCAodGhpcy5oYW5aaVJhdGUqa3VuTmFuLzEwMDAwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8v6ZqP5py65Yiw6KaB6L+b6KGM5Y+v5rGJ5a2X5ouG5YiGXHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhblppUmF0ZSA9IDIwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaVp1UmF0ZSArPSAxMFxyXG4gICAgICAgICAgICAgICAgbGV0IGZvbnRJbmZvcyA9IHRvcEZvbnRJbmZvLmNhbkhlQ2hlbmdGb250SW5mb3M7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXRGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudChmb250SW5mb3MpIGFzIE1hcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMgPSB0aGlzLnNwbGl0Rm9udFRvRm9udEluZm9zKHNwbGl0Rm9udEluZm8sdG9wRm9udEluZm8uaWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IHRoaXMuZ2V0UmFuZG9tRWxlbWVudCh0aGlzLl9zcGxpdEZvbnRXb3Jkcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEZvbnRXb3Jkcy5zcGxpY2UodGhpcy5fc3BsaXRGb250V29yZHMuaW5kZXhPZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvKSwgMSk7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRvcEZvbnRJbmZvLmNhbkhlQ2hlbmdHcm91cCAmJiB0aGlzLmdldFJhbmRvbVJlc3VsdCAodGhpcy5jaVp1UmF0ZSprdW5OYW4vMTAwMDApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+maj+acuuWIsOimgei/m+ihjOaLhuWIhuivjee7hFxyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5aaVJhdGUgKz0gMTU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNpWnVSYXRlID0gMTBcclxuICAgICAgICAgICAgICAgIGxldCBncm91cHMgPSB0b3BGb250SW5mby5jYW5IZUNoZW5nR3JvdXBzO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwbGl0R3JvdXAgPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQoZ3JvdXBzKSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMgPSB0aGlzLnNwbGl0R3JvdXBUb0ZvbnRJbmZvcyhzcGxpdEdyb3VwLHRvcEZvbnRJbmZvLnRleHQsXCJzcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQodGhpcy5fc3BsaXRHcm91cFdvcmRzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5zcGxpY2UodGhpcy5fc3BsaXRHcm91cFdvcmRzLmluZGV4T2YodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyksIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNpWnVSYXRlICs9MTA7XHJcbiAgICAgICAgdGhpcy5oYW5aaVJhdGUgKz0gMTU7XHJcbiAgICAgICAgLy/pmo/mnLrku47msYnlrZflupPmir3kuIDkuKrmsYnlrZdcclxuICAgICAgICBsZXQgZm9udERhdGFBcnIgPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQoTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRcIl0pO1xyXG4gICAgICAgIGxldCBtYXBGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSgpO1xyXG4gICAgICAgIG1hcEZvbnRJbmZvLnNldERhdGFCeVZhbHVlQXJyKGZvbnREYXRhQXJyKTtcclxuICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gbWFwRm9udEluZm87XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRUb3BGb250SW5mb3MoKSA6IE1hcEZvbnRJbmZvW11cclxuICAgIHtcclxuICAgICAgICBsZXQgY291dCA9IFtdO1xyXG4gICAgICAgIGxldCBmb250ID0gbnVsbDtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyAgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb250ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyPSAwIDsgaiAgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WTsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtqXSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQgPSB0aGlzLl9mb250c1tpXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihmb250ICE9bnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY291dC5wdXNoKGZvbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHN0ciDpnIDopoHmi4bliIbnmoTlrZfnrKbkuLJcclxuICAgICAqIEBwYXJhbSBzcGxpdFR5cGUg5ouG5YiG5pa55byPIGNvbW1lbumaj+acuuaLhuWIhiBzcGNpYWzkuI3mi4bliIZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzcGxpdEdyb3VwVG9Gb250SW5mb3Moc3RyIDogc3RyaW5nLHJlbW92ZUZvbnRUZXh0IDogc3RyaW5nID0gbnVsbCxzcGxpdFR5cGUgOiBzdHJpbmcgPSBcImNvbW1lblwiKTpNYXBGb250SW5mb1tde1xyXG4gICAgICAgIGxldCBjb3V0ID0gW11cclxuICAgICAgICBzdHIuc3BsaXQoJycpLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQgPT0gcmVtb3ZlRm9udFRleHQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiBlbGVtZW50fSk7XHJcbiAgICAgICAgICAgIGlmKGZvbnRJbmZvLmlkID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFjayBmb250OlwiICsgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoc3BsaXRUeXBlID09IFwiY29tbWVuXCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvdXQgPSBjb3V0LmNvbmNhdCh0aGlzLnNwbGl0Rm9udFRvRm9udEluZm9zKGZvbnRJbmZvLG51bGwsc3BsaXRUeXBlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY291dC5wdXNoKGZvbnRJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzcGxpdEZvbnRUb0ZvbnRJbmZvcyhmb250VHh0IDogc3RyaW5nIHwgTWFwRm9udEluZm8scmVtb3ZlRm9udElkIDogbnVtYmVyID0gbnVsbCwgc3BsaXRUeXBlIDogc3RyaW5nID0gXCJjb21tZW5cIikgOiBNYXBGb250SW5mb1tdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGZvbnRJbmZvIDogTWFwRm9udEluZm87XHJcbiAgICAgICAgaWYoZm9udFR4dCBpbnN0YW5jZW9mIE1hcEZvbnRJbmZvKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9udEluZm8gPSBmb250VHh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiBmb250VHh0fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNwbGl0VHlwZSAhPSBcImNvbW1lblwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtmb250SW5mb107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb3V0ID0gW107XHJcbiAgICAgICAgbGV0IHN0cnVjdEluZm9zID0gZm9udEluZm8uc3RydWN0SW5mby5zcGxpdChcIixcIik7XHJcbiAgICAgICAgbGV0IHN0cnVjdEluZm8gPSBzdHJ1Y3RJbmZvc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzdHJ1Y3RJbmZvcy5sZW5ndGgpXTtcclxuICAgICAgICBpZihzdHJ1Y3RJbmZvID09IGZvbnRJbmZvLmlkLnRvU3RyaW5nKCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0LnB1c2goZm9udEluZm8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RydWN0SW5mby5zcGxpdChcIl9cIikuZm9yRWFjaChlbGVtZW50MiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50MiA9PSBcIlwiIHx8IChyZW1vdmVGb250SWQgIT0gbnVsbCAmJiBlbGVtZW50MiA9PSByZW1vdmVGb250SWQudG9TdHJpbmcoKSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHNwbGl0Rm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe2lkIDogZWxlbWVudDJ9KTtcclxuICAgICAgICAgICAgICAgIGlmKHNwbGl0Rm9udEluZm8uaWQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhY2sgZm9udCBpZDpcIisgZWxlbWVudDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvdXQucHVzaChzcGxpdEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRSYW5kb21SZXN1bHQodmFsOm51bWJlcik6Ym9vbGVhbntcclxuICAgICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMCk8IHZhbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bpmr7luqbns7vmlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXROYW5EdVhpU2h1KCkgOiBudW1iZXJ7XHJcbiAgICAgICAgbGV0IGZvbnRHcmlkTnVtIDogbnVtYmVyID0wO1xyXG4gICAgICAgIGZvcihsZXQgaSA9MDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFk7IGogKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW2pdICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEdyaWROdW0gKz0gdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkgLSBqO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZGVncmVlX2RpZmZpY3VsdHlcIl1bZm9udEdyaWROdW1dO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UmFuZG9tRWxlbWVudChhcnIpIDogYW55e1xyXG4gICAgICAgIGlmKGFyci5sZW5ndGggPT0gMClyZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wbGF5ZXJFZmZlY3RJbmQgOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBwbGF5RWZmZWN0SW5jKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX3BsYXllckVmZmVjdEluZCArKztcclxuICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLkVmZmVjdFBhdXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGVuZEVmZmVjdEluYygpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9wbGF5ZXJFZmZlY3RJbmQgLS07XHJcbiAgICAgICAgaWYodGhpcy5fcGxheWVyRWZmZWN0SW5kIDwwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWVyRWZmZWN0SW5kID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fcGxheWVyRWZmZWN0SW5kID09IDAgJiYgdGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5FZmZlY3RQYXVzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuUGxheWluZyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTeXNEcm9wRm9udHMoKTtcclxuICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjayA9IFtdO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmludm9rZVN0dW50Rm9udCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBTZWFyY2hJbmZvIHtcclxuICAgIHB1YmxpYyBjdXJyZW50UG9pbnQgID0gbmV3IExheWEuUG9pbnQoKTtcclxuICAgIHB1YmxpYyBjaGFycyA6IHN0cmluZ1tdO1xyXG4gICAgcHJpdmF0ZSBfb3Blbkxpc3QgOiBMYXlhLlBvaW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgX29wZW5PYmogPSB7fTtcclxuICAgIHByaXZhdGUgX3N1cmVMaXN0IDogTGF5YS5Qb2ludFtdID0gW107XHJcbiAgICBwcml2YXRlIF9zdXJlT2JqID0ge307XHJcblxyXG4gICAgcHVibGljIHNldE9wZW5MaXN0KHBvaW50cyA6IExheWEuUG9pbnRbXSkgOiB2b2lke1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQ9PntcclxuICAgICAgICAgICAgdGhpcy5vcGVuKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0T3Blbkxpc3QoKSA6IExheWEuUG9pbnRbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcGVuTGlzdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRTdXJlTGlzdChwb2ludHMgOiBMYXlhLlBvaW50W10pIDogdm9pZHtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50PT57XHJcbiAgICAgICAgICAgIHRoaXMuc3VyZShlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFN1cmVMaXN0KCkgOiBMYXlhLlBvaW50W117XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cmVMaXN0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIG9wZW4oeCA6IG51bWJlciAseSA6IG51bWJlciwgaXNPcGVuIDogYm9vbGVhbiA9IHRydWUpIDogdm9pZHtcclxuICAgICAgICBsZXQga2V5ID0geC50b1N0cmluZygpICsgXCJfXCIgKyB5LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaWYoaXNPcGVuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gbmV3IExheWEuUG9pbnQoeCx5KTtcclxuICAgICAgICAgICAgdGhpcy5fb3Blbkxpc3QucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIHRoaXMuX29wZW5PYmpba2V5XSA9IHBvaW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fb3Blbk9ialtrZXldICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29wZW5MaXN0LnNwbGljZSh0aGlzLl9vcGVuTGlzdC5pbmRleE9mKHRoaXMuX29wZW5PYmpba2V5XSksMSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fb3Blbk9ialtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc09wZW4oeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGtleSA9IHgudG9TdHJpbmcoKSArIFwiX1wiICsgeS50b1N0cmluZygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcGVuT2JqW2tleV0gIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3VyZSh4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGtleSA9IHgudG9TdHJpbmcoKSArIFwiX1wiICsgeS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBwb2ludCA9IG5ldyBMYXlhLlBvaW50KHgseSk7XHJcbiAgICAgICAgdGhpcy5fc3VyZUxpc3QucHVzaChwb2ludCk7XHJcbiAgICAgICAgdGhpcy5fc3VyZU9ialtrZXldID0gcG9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzU3VyZSh4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IGJvb2xlYW57XHJcbiAgICAgICAgbGV0IGtleSA9IHgudG9TdHJpbmcoKSArIFwiX1wiICsgeS50b1N0cmluZygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXJlT2JqW2tleV0gIT0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuLi8uLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBXWFRvb2wgZnJvbSBcIi4uL3Rvb2wvV1hUb29sXCI7XHJcbmltcG9ydCBTY2VuZU1nciBmcm9tIFwiLi9TY2VuZU1nclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NlbmVCYXNlIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHJvdGVjdGVkIF9wb3BVcFNwciA6IExheWEuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBfYWxwaGFTcHIgOiBMYXlhLlNwcml0ZTtcclxuICAgIHByaXZhdGUgX3BvcFVwU2lnbiA6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3BvcFVwQ29udGVudCA6IExheWEuU3ByaXRlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZGlhbG9nU3ByIDogTGF5YS5TcHJpdGU7XHJcbiAgICBwcml2YXRlIF9hbHBoYURpYWxvZ1NwciA6IExheWEuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBfZGlhbG9nQ29udGVudCA6IExheWEuU3ByaXRlO1xyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgU2NlbmVNZ3IuY3VyU2NlbmVTY3JpcHQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlV3hPcGVuRGF0YVZpZXdlcigpO1xyXG4gICAgICAgIGxldCBhcnIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLm93bmVyKTtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgYXJyLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQuaW5kZXhPZihcIl9cIikgPT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdGVtcFByb3BlcnR5U3RyID0gZWxlbWVudC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBsZXQgdGVtcFByb3BlcnR5TGlzdCA9IHRlbXBQcm9wZXJ0eVN0ci5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgIHN3aXRjaCh0ZW1wUHJvcGVydHlMaXN0WzBdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInR4dFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImltZ1wiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImJ0blwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1jXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZlt0ZW1wUHJvcGVydHlTdHJdID0gc2VsZi5vd25lclt0ZW1wUHJvcGVydHlTdHJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgYWRkUG9wVXAoc2lnbiA6IHN0cmluZywgY29udGVudCA6IExheWEuU3ByaXRlIHwgTGF5YS5Cb3gsIGlzQ2VudGVyIDogYm9vbGVhbiA9IHRydWUsIGlzU2hvd0FscGhhU3ByIDogYm9vbGVhbiA9IHRydWUsIGlzRW5hYmxlQWxwaGFDbG9zZSA6IGJvb2xlYW4gPSBmYWxzZSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcG9wVXBTaWduID0gc2lnbjtcclxuICAgICAgICB0aGlzLl9wb3BVcENvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICAgIGlmKHRoaXMuX3BvcFVwU3ByID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9wb3BVcFNwciA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX3BvcFVwU3ByKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BvcFVwU3ByLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc0NlbnRlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGNvbnRlbnQgaW5zdGFuY2VvZiBMYXlhLlNwcml0ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29udGVudC54ID0gKEdhbWVDb25maWcud2lkdGggLSBjb250ZW50LndpZHRoKSAvIDI7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnkgPSAoR2FtZUNvbmZpZy5oZWlnaHQgLSBjb250ZW50LmhlaWdodCkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQuY2VudGVyWCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LmNlbnRlclkgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzU2hvd0FscGhhU3ByKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fYWxwaGFTcHIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByLndpZHRoID0gR2FtZUNvbmZpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByLmhlaWdodCA9IEdhbWVDb25maWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIuZ3JhcGhpY3MuZHJhd1JlY3QoMCwwLEdhbWVDb25maWcud2lkdGgsR2FtZUNvbmZpZy5oZWlnaHQsXCIjMDAwMDAwXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIuYWxwaGEgPSAwLjQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3BVcFNwci5hZGRDaGlsZCh0aGlzLl9hbHBoYVNwcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGlzRW5hYmxlQWxwaGFDbG9zZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFTcHIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLCB0aGlzLmhpZGVQb3BVcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbHBoYVNwcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcG9wVXBTcHIuYWRkQ2hpbGQodGhpcy5fcG9wVXBDb250ZW50KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZVBvcFVwKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5fcG9wVXBTcHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9wb3BVcFNwci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3BvcFVwQ29udGVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3BvcFVwQ29udGVudCA9PSB0aGlzLl9kYXRhVmlld2VyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3BVcENvbnRlbnQudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BvcFVwQ29udGVudC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcG9wVXBTaWduID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWRkRGlhbG9nKGNvbnRlbnQgOiBMYXlhLlNwcml0ZSwgaXNDZW50ZXIgOiBib29sZWFuID0gdHJ1ZSwgaXNTaG93QWxwaGFTcHIgOiBib29sZWFuID0gdHJ1ZSwgaXNFbmFibGVBbHBoYUNsb3NlIDogYm9vbGVhbiA9IGZhbHNlKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9kaWFsb2dDb250ZW50ID0gY29udGVudDtcclxuICAgICAgICBpZih0aGlzLl9kaWFsb2dTcHIgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpYWxvZ1NwciA9IG5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKHRoaXMuX2RpYWxvZ1Nwcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kaWFsb2dTcHIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzQ2VudGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29udGVudC54ID0gKEdhbWVDb25maWcud2lkdGggLSBjb250ZW50LndpZHRoKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnRlbnQueSA9IChHYW1lQ29uZmlnLmhlaWdodCAtIGNvbnRlbnQuaGVpZ2h0KSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlzU2hvd0FscGhhU3ByKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fYWxwaGFEaWFsb2dTcHIgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLndpZHRoID0gR2FtZUNvbmZpZy53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLmhlaWdodCA9IEdhbWVDb25maWcuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIuZ3JhcGhpY3MuZHJhd1JlY3QoMCwwLEdhbWVDb25maWcud2lkdGgsR2FtZUNvbmZpZy5oZWlnaHQsXCIjMDAwMDAwXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIuYWxwaGEgPSAwLjQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci5tb3VzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIubW91c2VUaHJvdWdoID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWFsb2dTcHIuYWRkQ2hpbGQodGhpcy5fYWxwaGFEaWFsb2dTcHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihpc0VuYWJsZUFscGhhQ2xvc2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcywgdGhpcy5oaWRlRGlhbG9nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX2FscGhhRGlhbG9nU3ByKXtcclxuICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kaWFsb2dTcHIuYWRkQ2hpbGQodGhpcy5fZGlhbG9nQ29udGVudCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVEaWFsb2coKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLl9kaWFsb2dTcHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kaWFsb2dTcHIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9kaWFsb2dDb250ZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fZGlhbG9nQ29udGVudCA9PSB0aGlzLl9kYXRhVmlld2VyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWFsb2dDb250ZW50LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFdYVG9vbC5zaG93QWxsQnRuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlhbG9nQ29udGVudC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kYXRhVmlld2VyIDogTGF5YS5XWE9wZW5EYXRhVmlld2VyO1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVXeE9wZW5EYXRhVmlld2VyKCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX2RhdGFWaWV3ZXIgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIgPSBuZXcgTGF5YS5XWE9wZW5EYXRhVmlld2VyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIud2lkdGggPSA2MTA7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIuaGVpZ2h0ID0gNzU3O1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlld2VyLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2hvd1JhbmsoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fZGF0YVZpZXdlci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9kYXRhVmlld2VyLnBvc3RNc2coe2NtZCA6IFwicmVmcmVzaFJhbmtMaXN0XCJ9KTtcclxuICAgICAgICB0aGlzLmFkZERpYWxvZyh0aGlzLl9kYXRhVmlld2VyLHRydWUsdHJ1ZSx0cnVlKTtcclxuICAgICAgICBXWFRvb2wuaGlkZUFsbEJ0bigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNjZW5lQmFzZSBmcm9tIFwiLi9TY2VuZUJhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lTWdyIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHVibGljIHN0YXRpYyBjdXJTY2VuZVNjcmlwdCA6IFNjZW5lQmFzZTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdGl2ZUJyaWRnZTQzOTkgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNob3dCYW5uZXJBZChibyA6IGJvb2xlYW4pIDogdm9pZHtcclxuICAgICAgICB2YXIgb3MgPSBMYXlhLkJyb3dzZXIud2luZG93LmNvbmNoQ29uZmlnLmdldE9TKCk7XHJcbiAgICAgICAgdmFyIGJyaWRnZTtcclxuICAgICAgICB2YXIgb2JqID0ge307XHJcbiAgICAgICAgaWYgKG9zID09IFwiQ29uY2gtaW9zXCIpIHtcclxuICAgICAgICAgICAgYnJpZGdlID0gTGF5YS5Ccm93c2VyLndpbmRvdy5QbGF0Zm9ybUNsYXNzLmNyZWF0ZUNsYXNzKFwiSlNCcmlkZ2VcIik7Ly/liJvlu7rohJrmraXku6PnkIZcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob3MgPT0gXCJDb25jaC1hbmRyb2lkXCIpIHtcclxuICAgICAgICAgICAgLy/pnIDopoHlrozmlbTnmoTnsbvot6/lvoTvvIzms6jmhI/kuI5pT1PnmoTkuI3lkIxcclxuICAgICAgICAgICAgYnJpZGdlID0gTGF5YS5Ccm93c2VyLndpbmRvdy5QbGF0Zm9ybUNsYXNzLmNyZWF0ZUNsYXNzKFwiZGVtby5KU0JyaWRnZVwiKTsvL+WIm+W7uuiEmuatpeS7o+eQhlxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYgKG9zID09IFwiQ29uY2gtaW9zXCIpIHtcclxuICAgICAgICAgICAgLy9pT1Pms6jmhI/lh73mlbDnrb7lkI3vvIzms6jmhI/kuI5BbmRyb2lk55qE5LiN5ZCMXHJcbiAgICAgICAgICAgIGJyaWRnZS5jYWxsKFwic2V0QmFubmVyQWRWaXNpYmxlOlwiLGJvKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvcyA9PSBcIkNvbmNoLWFuZHJvaWRcIikge1xyXG4gICAgICAgICAgICBicmlkZ2UuY2FsbChcInNldEJhbm5lckFkVmlzaWJsZVwiLGJvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFVSSSBmcm9tIFwiLi4vLi4vVVJJXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VuZFRvb2x7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlCZ011c2ljKCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlNdXNpYyhVUkkuc291bmRVcmwgKyBcImJnX211c2ljLndhdlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlYaWFvQ2h1RWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChVUkkuc291bmRVcmwgKyBcInhpYW9jaHUud2F2XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheUhlQ2hlbmdFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFVSSS5zb3VuZFVybCArIFwiaGVjaGVuZy53YXZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5VGVKaUVmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoVVJJLnNvdW5kVXJsICsgXCJ0ZWppLndhdlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlYaWFIdWFFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFVSSS5zb3VuZFVybCArIFwieGlhaHVhLndhdlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlZaURvbmdFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFVSSS5zb3VuZFVybCArIFwieWlkb25nLndhdlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfc291bmRWb2x1bWUgOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNvdW5kVm9sdW1lKCkgOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIFNvdW5kVG9vbC5fc291bmRWb2x1bWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFNvdW5kVm9sdW1lKHZhbHVlIDogbnVtYmVyID0gMC4yKSA6IHZvaWR7XHJcbiAgICAgICAgaWYoTnVtYmVyW1wiaXNOYU5cIl0odmFsdWUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFsdWUgPSAwLjI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNvdW5kVG9vbC5fc291bmRWb2x1bWUgPSB2YWx1ZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5zZXRTb3VuZFZvbHVtZSh2YWx1ZSk7XHJcbiAgICAgICAgTGF5YS5Mb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNvdW5kVm9sdW1lXCIsKHZhbHVlICogMTAwKS50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfbXVzaWNWb2x1bWUgOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE11c2ljVm9sdW1lKCkgOiBudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIFNvdW5kVG9vbC5fbXVzaWNWb2x1bWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNldE11c2ljVm9sdW1lKHZhbHVlIDogbnVtYmVyID0gMC4yKSA6IHZvaWR7XHJcbiAgICAgICAgaWYoTnVtYmVyW1wiaXNOYU5cIl0odmFsdWUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFsdWUgPSAwLjI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNvdW5kVG9vbC5fbXVzaWNWb2x1bWUgPSB2YWx1ZTtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5zZXRNdXNpY1ZvbHVtZSh2YWx1ZSk7XHJcbiAgICAgICAgTGF5YS5Mb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm11c2ljVm9sdW1lXCIsKHZhbHVlICogMTAwKS50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBTb3VuZFRvb2wuc2V0U291bmRWb2x1bWUocGFyc2VJbnQoTGF5YS5Mb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNvdW5kVm9sdW1lXCIpKS8xMDApO1xyXG4gICAgICAgIFNvdW5kVG9vbC5zZXRNdXNpY1ZvbHVtZShwYXJzZUludChMYXlhLkxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXVzaWNWb2x1bWVcIikpLzEwMCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXWFRvb2wgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfYnRucyA6IGFueVtdID0gW107XHJcbiAgICBwdWJsaWMgc3RhdGljIGFkZEJ0bihidG4gOiBhbnkpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9idG5zLnB1c2goYnRuKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUJ0bihidG4gOiBhbnkpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9idG5zLnNsaWNlKHRoaXMuX2J0bnMuaW5kZXhPZihidG4pLDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaGlkZUFsbEJ0biAoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fYnRucy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmhpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNob3dBbGxCdG4gKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2J0bnMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5oaWRkZW4gPSBmYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59IiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5pbXBvcnQgVmlldz1MYXlhLlZpZXc7XG5pbXBvcnQgRGlhbG9nPUxheWEuRGlhbG9nO1xuaW1wb3J0IFNjZW5lPUxheWEuU2NlbmU7XG52YXIgUkVHOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcbmV4cG9ydCBtb2R1bGUgdWkudGVzdCB7XHJcbiAgICBleHBvcnQgY2xhc3MgVGVzdFNjZW5lVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgc2NvcmVMYmw6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgdGlwTGJsbDpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwidGVzdC9UZXN0U2NlbmVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkudGVzdC5UZXN0U2NlbmVVSVwiLFRlc3RTY2VuZVVJKTtcclxufVxyIl19
