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
var ResMgr_1 = require("./ResMgr");
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
                "btn_startGame.png",
                "fileconfig.json",
                "version.json",
                "loading/Loading.json",
                "res/atlas/loading.atlas",
                "res/atlas/loading.png",
                "main/MainGame.json",
                "res/atlas/map.atlas",
                "res/atlas/map.png",
                "test/TestScene.json",
                "res/atlas/test.atlas",
                "res/data.json",
                "res/spine/other_taozhuangxitong1.sk",
                "res/spine/other_taozhuangxitong1.png",
                "res/spine/other_wupinghuanrao_kin_little.sk",
                "res/spine/other_wupinghuanrao_kin_little.png",
                "prefab/Bullet.json",
                "prefab/DropBox.json",
                "prefab/FontGrid.json",
                "prefab/GameResult.json",
                "prefab/GameSetting.json",
                "prefab/StartGame.json",
                "prefab/TipItem.json",
                "res/atlas/test.png"
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
        ResMgr_1.ResMgr.Instance().loadList(AppConfig_1.default.getInitLoadingUrls(), this, function (index, total) {
            this.updateLoadingProgress(index / total * 90);
        }, function () {
            this.loadStartScene();
        });
        // Laya.loader.load(AppConfig.getInitLoadingUrls(),Laya.Handler.create(this,this.loadStartScene),Laya.Handler.create(this,function(progress : number) : void{
        // 	this.updateLoadingProgress(progress * 90);
        // }));
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

},{"./AppConfig":1,"./CodeExpand":2,"./GameConfig":3,"./ResMgr":5,"./script/controller/ControllerMgr":12,"./script/controller/TipController":14,"./script/model/MapFontInfo":15,"./script/scene/LoadingScene":25,"./script/scene/SceneMgr":28,"./script/tool/SoundTool":30}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0xheWEvTGF5YUFpcklERV8yLjEuMGJldGExLmFwcC9Db250ZW50cy9SZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQXBwQ29uZmlnLnRzIiwic3JjL0NvZGVFeHBhbmQudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9NYWluLnRzIiwic3JjL1Jlc01nci50cyIsInNyYy9VUkkudHMiLCJzcmMvc2NyaXB0L0J1bGxldC50cyIsInNyYy9zY3JpcHQvRHJvcEJveC50cyIsInNyYy9zY3JpcHQvR2FtZUNvbnRyb2wudHMiLCJzcmMvc2NyaXB0L0dhbWVVSS50cyIsInNyYy9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyQmFzZS50cyIsInNyYy9zY3JpcHQvY29udHJvbGxlci9Db250cm9sbGVyTWdyLnRzIiwic3JjL3NjcmlwdC9jb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIudHMiLCJzcmMvc2NyaXB0L2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlci50cyIsInNyYy9zY3JpcHQvbW9kZWwvTWFwRm9udEluZm8udHMiLCJzcmMvc2NyaXB0L21vZGVsL01hcFN0YXJJbmZvLnRzIiwic3JjL3NjcmlwdC9tb2RlbC9Nb2RlbEJhc2UudHMiLCJzcmMvc2NyaXB0L21vZGVsL1BsYXllckluZm8udHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9Gb250R3JpZC50cyIsInNyYy9zY3JpcHQvcHJlZmViL0dhbWVSZXN1bHQudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9HYW1lU2V0dGluZy50cyIsInNyYy9zY3JpcHQvcHJlZmViL1ByZWZlYkJhc2UudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9TdGFydEdhbWUudHMiLCJzcmMvc2NyaXB0L3ByZWZlYi9UaXBJdGVtLnRzIiwic3JjL3NjcmlwdC9zY2VuZS9Mb2FkaW5nU2NlbmUudHMiLCJzcmMvc2NyaXB0L3NjZW5lL01haW5HYW1lU2NlbmUudHMiLCJzcmMvc2NyaXB0L3NjZW5lL1NjZW5lQmFzZS50cyIsInNyYy9zY3JpcHQvc2NlbmUvU2NlbmVNZ3IudHMiLCJzcmMvc2NyaXB0L3Rvb2wvTmF0aXZlQnJpZGdlNDM5OS50cyIsInNyYy9zY3JpcHQvdG9vbC9Tb3VuZFRvb2wudHMiLCJzcmMvc2NyaXB0L3Rvb2wvV1hUb29sLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSw2QkFBd0I7QUFFeEI7SUFBdUMsNkJBQVc7SUFBbEQ7O0lBb0VBLENBQUM7SUFsRWlCLDRCQUFrQixHQUFoQztRQUVJLElBQUcsU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQzdCO1lBQ0ksT0FBTztnQkFDSCxxQkFBcUI7Z0JBQ3JCLGVBQWU7Z0JBQ2YsOENBQThDO2dCQUM5QyxhQUFHLENBQUMsUUFBUSxHQUFHLDRCQUE0QjtnQkFDM0Msc0RBQXNEO2dCQUN0RCxhQUFHLENBQUMsUUFBUSxHQUFHLG9DQUFvQztnQkFDbkQsc0JBQXNCO2dCQUN0QixvQkFBb0I7Z0JBQ3BCLG1CQUFtQjtnQkFDbkIsZ0JBQWdCO2dCQUNoQixrQkFBa0I7Z0JBQ2xCLG1CQUFtQjtnQkFDbkIsa0JBQWtCO2FBQ3JCLENBQUE7U0FDSjthQUVEO1lBQ0ksT0FBTztnQkFDSCxlQUFlO2dCQUNmLGFBQUcsQ0FBQyxRQUFRLEdBQUcsMkJBQTJCO2dCQUMxQyxhQUFHLENBQUMsUUFBUSxHQUFHLG1DQUFtQztnQkFDbEQsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLGdCQUFnQjtnQkFDaEIsa0JBQWtCO2dCQUNsQixtQkFBbUI7Z0JBQ25CLGtCQUFrQjthQUNyQixDQUFBO1NBQ0o7SUFDTCxDQUFDO0lBRUQsV0FBVztJQUNHLHFCQUFXLEdBQXpCO1FBRUksSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FB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QUksQ0FBQyxFQUM5QjtZQUNJLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO1FBQ0QsSUFBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsRUFDM0Q7WUFDSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0I7UUFDRCxJQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUMzRDtZQUNJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztTQUMzQjtRQUNELElBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQzNEO1lBQ0ksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsSUFBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDM0Q7WUFDSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDM0I7UUFDRCxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkMsS0FBSSxJQUFJLENBQUMsR0FBWSxD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Q3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQ0wsa0JBQUM7UUFBRCxDQVJBLEFBUUMsQ0FSZ0MsS0FBSyxHQVFyQztRQVJZLGdCQUFXLGNBUXZCLENBQUE7UUFDRCxHQUFHLENBQUMscUJBQXFCLEVBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxFQVhnQixJQUFJLEdBQUosT0FBSSxLQUFKLE9BQUksUUFXcEI7QUFBRCxDQUFDLEVBWGEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBV2YiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFVSSSBmcm9tIFwiLi9VUklcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENvbmZpZyBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEluaXRMb2FkaW5nVXJscygpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICBpZihBcHBDb25maWcucGxhdGZvcm0gPT0gXCJ3eFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIFwicmVzL2F0bGFzL21hcC5hdGxhc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJyZXMvZGF0YS5qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3Rhb3podWFuZ3hpdG9uZzEuc2tcIixcclxuICAgICAgICAgICAgICAgIFVSSS5zcGluZVVybCArIFwib3RoZXJfdGFvemh1YW5neGl0b25nMS5wbmdcIixcclxuICAgICAgICAgICAgICAgIC8vIFVSSS5zcGluZVVybCArIFwib3RoZXJfd3VwaW5naHVhbnJhb19raW5fbGl0dGxlLnNrXCIsXHJcbiAgICAgICAgICAgICAgICBVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3d1cGluZ2h1YW5yYW9fa2luX2xpdHRsZS5wbmdcIixcclxuICAgICAgICAgICAgICAgIFwicmVzL2F0bGFzL3Rlc3QuYXRsYXNcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQvYmdfbXVzaWMud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL2hlY2hlbmcud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3Rlamkud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3hpYWh1YS53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQveGlhb2NodS53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQveWlkb25nLndhdlwiXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBcInJlcy9kYXRhLmpzb25cIixcclxuICAgICAgICAgICAgICAgIFVSSS5zcGluZVVybCArIFwib3RoZXJfdGFvemh1YW5neGl0b25nMS5za1wiLFxyXG4gICAgICAgICAgICAgICAgVVJJLnNwaW5lVXJsICsgXCJvdGhlcl93dXBpbmdodWFucmFvX2tpbl9saXR0bGUuc2tcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQvYmdfbXVzaWMud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL2hlY2hlbmcud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3Rlamkud2F2XCIsXHJcbiAgICAgICAgICAgICAgICBcInNvdW5kL3hpYWh1YS53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQveGlhb2NodS53YXZcIixcclxuICAgICAgICAgICAgICAgIFwic291bmQveWlkb25nLndhdlwiXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/mmK/lkKblt7Lnu4/mlrDmiYvlvJXlr7zov4dcclxuICAgIHB1YmxpYyBzdGF0aWMgaGFkR3VpZGFuY2UoKSA6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICBsZXQgYm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImd1aWRlXCIpO1xyXG4gICAgICAgIGlmKGJvID09IFwidHJ1ZVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldEd1aWRhbmNlKHZhbHVlIDogYm9vbGVhbikgOiB2b2lke1xyXG4gICAgICAgIGlmKHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJndWlkZVwiLFwidHJ1ZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZ3VpZGVcIixcImZhbHNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBvb2xzID0ge307XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBwbGF0Zm9ybSA9IFwidGVzdFwiOyAvL2xheWHmtYvor5VcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxhdGZvcm0gPSBcInd4XCI7IC8v5b6u5L+h5rWL6K+VXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIHBsYXRmb3JtID0gXCJhbmRyb2lkXCI7IC8vYW5kcm9pZCBuYXRpdmVcclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgcGxhdGZvcm0gPSBcImFuZHJvaWQ0Mzk5XCI7IC8vYW5kcm9pZCBuYXRpdmU0Mzk5XHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIHBsYXRmb3JtID0gXCJpb3NcIjsgLy9pb3MgbmF0aXZlXHJcbiAgICBwdWJsaWMgc3RhdGljIHZlcnNpb24gPSBcIjEuOFwiO1xyXG59IiwiLyoqXHJcbiog5rqQ5Luj56CB5ouT5bGVXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVFeHBhbmR7XHJcblx0cHVibGljIHN0YXRpYyBpbml0KCkgOiB2b2lke1xyXG5cdFx0Ly8gTGF5YS5TcHJpdGXmi5PlsZVcclxuXHRcdHZhciBzcHJpdGVQcm90bzogTGF5YS5TcHJpdGUgPSBMYXlhLlNwcml0ZS5wcm90b3R5cGU7XHJcblx0XHQvLyDmt7vliqDngrnlh7vnvKnmlL7nmoTnm5HlkKxcclxuXHRcdHNwcml0ZVByb3RvW1wiem9vbU9uXCJdID0gZnVuY3Rpb24oaGFuZGxlcjogTGF5YS5IYW5kbGVyLCBzY2FsZTogbnVtYmVyID0gMS4xKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0aWYgKCFzZWxmW1wiaW5pdFNYXCJdKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZltcImluaXRTWFwiXSA9IHNlbGYuc2NhbGVYO1xyXG5cdFx0XHRcdHNlbGZbXCJpbml0U1lcIl0gPSBzZWxmLnNjYWxlWTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2NhbGUgPiAwICYmIHNjYWxlICE9IDEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgY2VudGVyWCA9IHNlbGYuZ2V0Q2VudGVyWCgpO1xyXG5cdFx0XHRcdHZhciBjZW50ZXJZID0gc2VsZi5nZXRDZW50ZXJZKCk7XHJcblx0XHRcdFx0c2VsZi5waXZvdFggPSBzZWxmLndpZHRoIC8gMjtcclxuXHRcdFx0XHRzZWxmLnBpdm90WSA9IHNlbGYuaGVpZ2h0IC8gMjtcclxuXHRcdFx0XHRzZWxmLnBvcyhjZW50ZXJYLCBjZW50ZXJZKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2VsZi5oYXNMaXN0ZW5lcihcInByZXNzXCIpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZi5vZmYoTGF5YS5FdmVudC5NT1VTRV9ET1dOLCBzZWxmLCBzZWxmW1wibW91c2VEb3duXCJdKTtcclxuXHRcdFx0XHRzZWxmLm9mZihMYXlhLkV2ZW50Lk1PVVNFX1VQLCBzZWxmLCBzZWxmW1wibW91c2VVcFwiXSk7XHJcblx0XHRcdFx0c2VsZi5vZmYoTGF5YS5FdmVudC5NT1VTRV9NT1ZFLCBzZWxmLCBzZWxmW1wibW91c2VNb3ZlXCJdKTtcclxuXHRcdFx0XHRzZWxmLm9mZihMYXlhLkV2ZW50Lk1PVVNFX09VVCwgc2VsZiwgc2VsZltcIm1vdXNlT3V0XCJdKTtcclxuXHRcdFx0XHRzZWxmLm9mZihMYXlhLkV2ZW50Lk1PVVNFX09WRVIsIHNlbGYsIHNlbGZbXCJtb3VzZU92ZXJcIl0pO1xyXG5cdFx0XHRcdHNlbGYub2ZmKFwicHJlc3NcIiwgc2VsZiwgc2VsZltcInByZXNzXCJdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzZWxmW1wibW91c2VEb3duXCJdID0gZnVuY3Rpb24oZXZlbnQ6IExheWEuRXZlbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoc2VsZltcImlzRG93blwiXSkgcmV0dXJuO1xyXG5cdFx0XHRcdHNlbGYuc2NhbGUoc2VsZltcImluaXRTWFwiXSAqIHNjYWxlLCBzZWxmW1wiaW5pdFNZXCJdICogc2NhbGUpO1xyXG5cdFx0XHRcdHNlbGZbXCJpc0Rvd25cIl0gPSB0cnVlO1xyXG5cdFx0XHRcdGhhbmRsZXIgJiYgaGFuZGxlci5ydW5XaXRoKGV2ZW50KTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGZbXCJpc0Rvd25cIl0pXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbGYuZXZlbnQoXCJwcmVzc1wiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCAyMDApO1xyXG5cclxuXHRcdFx0XHQvLyBpZiAoZ2FtZS5BcHBDb25maWcuc291bmRFZmZlY3QpXHJcblx0XHRcdFx0Ly8ge1xyXG5cdFx0XHRcdC8vIFx0TGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKGdhbWUuVVJJLmF1ZGlvVXJsICsgXCJVSS9idXR0b24ud2F2XCIsIDEpO1xyXG5cdFx0XHRcdC8vIH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNlbGZbXCJtb3VzZVVwXCJdID0gZnVuY3Rpb24oZXZlbnQ6IExheWEuRXZlbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoIXNlbGZbXCJpc0Rvd25cIl0pIHJldHVybjtcclxuXHRcdFx0XHRzZWxmLnNjYWxlKHNlbGZbXCJpbml0U1hcIl0sIHNlbGZbXCJpbml0U1lcIl0pO1xyXG5cdFx0XHRcdGhhbmRsZXIgJiYgaGFuZGxlci5ydW5XaXRoKGV2ZW50KTtcclxuXHRcdFx0XHRzZWxmW1wiaXNEb3duXCJdID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGZbXCJtb3VzZU1vdmVcIl0gPSBmdW5jdGlvbihldmVudDogTGF5YS5FdmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChzZWxmW1wiaXNEb3duXCJdKSB7XHJcblx0XHRcdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIucnVuV2l0aChldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHRcclxuXHJcblx0XHRcdHNlbGZbXCJtb3VzZU92ZXJcIl0gPSBmdW5jdGlvbihldmVudDogTGF5YS5FdmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGhhbmRsZXIgJiYgaGFuZGxlci5ydW5XaXRoKGV2ZW50KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZltcIm1vdXNlT3V0XCJdID0gZnVuY3Rpb24oZXZlbnQ6IExheWEuRXZlbnQpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoc2VsZltcImlzRG93blwiXSkge1xyXG5cdFx0XHRcdFx0c2VsZi5zY2FsZShzZWxmW1wiaW5pdFNYXCJdLCBzZWxmW1wiaW5pdFNZXCJdKTtcclxuXHRcdFx0XHRcdGhhbmRsZXIgJiYgaGFuZGxlci5ydW5XaXRoKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2VsZltcImlzRG93blwiXSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmW1wicHJlc3NcIl0gPSBmdW5jdGlvbihldmVudDogTGF5YS5FdmVudClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBldmVudCA9IG5ldyBMYXlhLkV2ZW50KCk7XHJcblx0XHRcdFx0ZXZlbnQudHlwZSA9IFwicHJlc3NcIjtcclxuXHRcdFx0XHRldmVudC5jdXJyZW50VGFyZ2V0ID0gc2VsZjtcclxuXHRcdFx0XHRoYW5kbGVyICYmIGhhbmRsZXIucnVuV2l0aChldmVudCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYub24oXCJwcmVzc1wiLCB0aGlzLCBzZWxmW1wicHJlc3NcIl0pO1xyXG5cdFx0XHRzZWxmLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgc2VsZltcIm1vdXNlRG93blwiXSk7XHJcblx0XHRcdHNlbGYub24oTGF5YS5FdmVudC5NT1VTRV9VUCwgdGhpcywgc2VsZltcIm1vdXNlVXBcIl0pO1xyXG5cdFx0XHRzZWxmLm9uKExheWEuRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgc2VsZltcIm1vdXNlTW92ZVwiXSk7XHJcblx0XHRcdHNlbGYub24oTGF5YS5FdmVudC5NT1VTRV9PVkVSLCB0aGlzLCBzZWxmW1wibW91c2VPdmVyXCJdKTtcclxuXHRcdFx0c2VsZi5vbihMYXlhLkV2ZW50Lk1PVVNFX09VVCwgdGhpcywgc2VsZltcIm1vdXNlT3V0XCJdKTtcclxuXHRcdFx0Ly8gaWYgKHNlbGZbXCJ0b3BcIl0pXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0Ly8gXHRzZWxmLnkgPSBzZWxmW1widG9wXCJdICsgc2VsZi5waXZvdFk7XHJcblx0XHRcdC8vIFx0c2VsZltcInRvcFwiXSA9IE5hTjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyBpZiAoc2VsZltcImJvdHRvbVwiXSlcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHQvLyBcdHNlbGYueSA9IChzZWxmLnBhcmVudCBhcyBMYXlhLlNwcml0ZSkuaGVpZ2h0IC0gc2VsZltcImJvdHRvbVwiXSAtIHNlbGYuaGVpZ2h0ICsgc2VsZi5waXZvdFk7XHJcblx0XHRcdC8vIFx0c2VsZltcImJvdHRvbVwiXSA9IE5hTjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyBpZiAoc2VsZltcImxlZnRcIl0pXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0Ly8gXHRzZWxmLnggPSBzZWxmW1wibGVmdFwiXSArIHNlbGYucGl2b3RYO1xyXG5cdFx0XHQvLyBcdHNlbGZbXCJsZWZ0XCJdID0gTmFOO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIGlmIChzZWxmW1wicmlnaHRcIl0pXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0Ly8gXHRzZWxmLnggPSAoc2VsZi5wYXJlbnQgYXMgTGF5YS5TcHJpdGUpLndpZHRoIC0gc2VsZltcInJpZ2h0XCJdIC0gc2VsZi53aWR0aCArIHNlbGYucGl2b3RYO1xyXG5cdFx0XHQvLyBcdHNlbGZbXCJyaWdodFwiXSA9IE5hTjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImdldExlZnRcIl0gPSBmdW5jdGlvbigpOiBudW1iZXJcclxuXHRcdHtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0aWYgKHNlbGZbXCJhbmNob3JYXCJdKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZi5waXZvdFggPSBzZWxmLndpZHRoICogc2VsZltcImFuY2hvclhcIl07XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHNlbGYueCAtIHNlbGYucGl2b3RYICogc2VsZi5zY2FsZVg7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJnZXRSaWdodFwiXSA9IGZ1bmN0aW9uKCk6IG51bWJlclxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgc2VsZjogTGF5YS5TcHJpdGUgPSB0aGlzIGFzIExheWEuU3ByaXRlO1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5nZXRMZWZ0KCkgKyBzZWxmLndpZHRoICogc2VsZi5zY2FsZVg7XHJcblx0XHR9XHJcblxyXG5cdFx0c3ByaXRlUHJvdG9bXCJnZXRUb3BcIl0gPSBmdW5jdGlvbigpOiBudW1iZXJcclxuXHRcdHtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0aWYgKHNlbGZbXCJhbmNob3JZXCJdKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c2VsZi5waXZvdFkgPSBzZWxmLmhlaWdodCAqIHNlbGZbXCJhbmNob3JZXCJdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzZWxmLnkgLSBzZWxmLnBpdm90WSAqIHNlbGYuc2NhbGVZO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNwcml0ZVByb3RvW1wiZ2V0Qm90dG9tXCJdID0gZnVuY3Rpb24oKTogbnVtYmVyXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZWxmOiBMYXlhLlNwcml0ZSA9IHRoaXMgYXMgTGF5YS5TcHJpdGU7XHJcblx0XHRcdHJldHVybiBzZWxmLmdldFRvcCgpICsgc2VsZi5oZWlnaHQgKiBzZWxmLnNjYWxlWTtcclxuXHRcdH1cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImdldENlbnRlclhcIl0gPSBmdW5jdGlvbigpOiBudW1iZXJcclxuXHRcdHtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0cmV0dXJuIHNlbGYuZ2V0TGVmdCgpICsgc2VsZi53aWR0aCAvIDIgKiBzZWxmLnNjYWxlWDtcclxuXHRcdH1cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImdldENlbnRlcllcIl0gPSBmdW5jdGlvbigpOiBudW1iZXJcclxuXHRcdHtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0cmV0dXJuIHNlbGYuZ2V0VG9wKCkgKyBzZWxmLmhlaWdodCAvIDIgKiBzZWxmLnNjYWxlWTtcclxuXHRcdH1cclxuXHJcblx0XHRzcHJpdGVQcm90b1tcImNsb25lXCJdID0gZnVuY3Rpb24oKTogTGF5YS5TcHJpdGVcclxuXHRcdHtcclxuXHRcdFx0aWYgKCF0aGlzW1widWlEYXRhXCJdKSByZXR1cm4gbnVsbDtcclxuXHRcdFx0dmFyIHNlbGY6IExheWEuU3ByaXRlID0gdGhpcyBhcyBMYXlhLlNwcml0ZTtcclxuXHRcdFx0bGV0IGNsb25lOiBMYXlhLlNwcml0ZSA9IExheWEuU2NlbmVVdGlscy5jcmVhdGVDb21wKHNlbGZbXCJ1aURhdGFcIl0pO1xyXG5cdFx0XHQvLyBpZiAoc2VsZltcInVpRGF0YVwiXSlcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHQvLyBcdGZvciAodmFyIGtleSBpbiBzZWxmW1widWlEYXRhXCJdW1wicHJvcHNcIl0pIHtcclxuXHRcdFx0Ly8gXHRcdGlmIChzZWxmW1widWlEYXRhXCJdW1wicHJvcHNcIl0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHQvLyBcdFx0XHR2YXIgZWxlbWVudCA9IHNlbGZba2V5XTtcclxuXHRcdFx0Ly8gXHRcdFx0Y2xvbmVbXCJrZXlcIl0gPSBlbGVtZW50O1xyXG5cdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gXHRzZWxmLmNoaWxkcmVuKFtdKS5mb3JFYWNoKGNoaWxkID0+IHtcclxuXHRcdFx0Ly8gXHRcdHZhciBpbmRleCA9IHNlbGYuZ2V0Q2hpbGRJbmRleChjaGlsZClcclxuXHRcdFx0Ly8gXHRcdGNsb25lLnJlbW92ZUNoaWxkQXQoaW5kZXgpO1xyXG5cdFx0XHQvLyBcdFx0Y2xvbmUuYWRkQ2hpbGRBdCgoY2hpbGQgYXMgTGF5YS5TcHJpdGUpLmNsb25lKCksIGluZGV4KTtcclxuXHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRjbG9uZS52aXNpYmxlID0gc2VsZi52aXNpYmxlO1xyXG5cdFx0XHRyZXR1cm4gY2xvbmU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU3RyaW5n5ouT5bGVXHJcblx0XHR2YXIgc3RyaW5nUHJvdG86IFN0cmluZyA9IFN0cmluZy5wcm90b3R5cGU7XHJcblx0XHQvLyDlrZfnrKbkuLLmoLzlvI/ljJYo5Y+q5YGa5LqG566A5Y2V55qEJWQsJXPljLnphY3vvIzmnKrlgZrlj4LmlbDkuKrmlbDlkoznsbvlnovliKTmlq3vvIzkuYvlkI7kvJjljJblrozlloQpXHJcblx0XHRTdHJpbmdbXCJmb3JtYXRcIl0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcblx0XHRcdHZhciBzdHI6IHN0cmluZyA9IGFyZ3NbMF07XHJcblx0XHRcdGFyZ3MgPSBhcmdzLnNsaWNlKDEsIGFyZ3MubGVuZ3RoKTtcclxuXHRcdFx0dmFyIG1hdGNoID0gZnVuY3Rpb24obVN0cmluZzogc3RyaW5nLCBtQXJnczogQXJyYXk8YW55Pikge1xyXG5cdFx0XHRcdHZhciBpbmRleDogbnVtYmVyID0gMDtcclxuXHRcdFx0XHR2YXIgcmVzdWx0OiBBcnJheTxhbnk+ID0gbVN0cmluZy5tYXRjaChuZXcgUmVnRXhwKFwiJVtkLHNdK1wiKSk7XHJcblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcclxuXHRcdFx0XHRcdHJldHVybiBtU3RyaW5nO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtU3RyaW5nID0gbVN0cmluZy5yZXBsYWNlKHJlc3VsdFswXSwgbUFyZ3NbMF0pO1xyXG5cdFx0XHRcdFx0bUFyZ3MgPSBtQXJncy5zbGljZSgxLCBtQXJncy5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoKG1TdHJpbmcsIG1BcmdzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbWF0Y2goc3RyLCBhcmdzKVxyXG5cdFx0fVxyXG5cclxuXHRcdFN0cmluZ1tcImlzRW1vamlDaGFyYWN0ZXJcIl0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcblx0XHRcdHZhciBzdWJzdHJpbmc6IHN0cmluZyA9IGFyZ3NbMF07XHJcblx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHN1YnN0cmluZy5sZW5ndGg7IGkrKykgeyAgXHJcblx0XHRcdFx0dmFyIGhzID0gc3Vic3RyaW5nLmNoYXJDb2RlQXQoaSk7ICBcclxuXHRcdFx0XHRpZiAoMHhkODAwIDw9IGhzICYmIGhzIDw9IDB4ZGJmZikgeyAgXHJcblx0XHRcdFx0XHRpZiAoc3Vic3RyaW5nLmxlbmd0aCA+IDEpIHsgIFxyXG5cdFx0XHRcdFx0XHR2YXIgbHMgPSBzdWJzdHJpbmcuY2hhckNvZGVBdChpICsgMSk7ICBcclxuXHRcdFx0XHRcdFx0dmFyIHVjID0gKChocyAtIDB4ZDgwMCkgKiAweDQwMCkgKyAobHMgLSAweGRjMDApICsgMHgxMDAwMDsgIFxyXG5cdFx0XHRcdFx0XHRpZiAoMHgxZDAwMCA8PSB1YyAmJiB1YyA8PSAweDFmNzdmKSB7ICBcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0XHR9ICBcclxuXHRcdFx0XHRcdH0gIFxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3Vic3RyaW5nLmxlbmd0aCA+IDEpIHsgIFxyXG5cdFx0XHRcdFx0dmFyIGxzID0gc3Vic3RyaW5nLmNoYXJDb2RlQXQoaSArIDEpOyAgXHJcblx0XHRcdFx0XHRpZiAobHMgPT0gMHgyMGUzKSB7ICBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdH0gIFxyXG5cdFx0XHRcdH0gZWxzZSB7ICBcclxuXHRcdFx0XHRcdGlmICgweDIxMDAgPD0gaHMgJiYgaHMgPD0gMHgyN2ZmKSB7ICBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoMHgyQjA1IDw9IGhzICYmIGhzIDw9IDB4MmIwNykgeyAgXHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlOyAgXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKDB4MjkzNCA8PSBocyAmJiBocyA8PSAweDI5MzUpIHsgIFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICgweDMyOTcgPD0gaHMgJiYgaHMgPD0gMHgzMjk5KSB7ICBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7ICBcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaHMgPT0gMHhhOSB8fCBocyA9PSAweGFlIHx8IGhzID09IDB4MzAzZCB8fCBocyA9PSAweDMwMzAgIFxyXG5cdFx0XHRcdFx0XHRcdHx8IGhzID09IDB4MmI1NSB8fCBocyA9PSAweDJiMWMgfHwgaHMgPT0gMHgyYjFiICBcclxuXHRcdFx0XHRcdFx0XHR8fCBocyA9PSAweDJiNTApIHsgIFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTsgIFxyXG5cdFx0XHRcdFx0fSAgXHJcblx0XHRcdFx0fSBcclxuXHRcdFx0fSBcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBcnJheeaLk+WxlVxyXG5cdFx0dmFyIGFycmF5UHJvdG86IGFueSA9IEFycmF5LnByb3RvdHlwZTtcclxuXHRcdC8vIGFycmF55a2X5q615o6S5bqPIDHvvJphcnIuc29ydE9uKFtbXCJrZXkxXCIsIFwidXBcIl0sIFtcImtleTJcIiwgXCJkb3duXCJdXSkgMu+8mmFyci5zb3J0T24oXCJ1cFwiKVxyXG5cdFx0Ly8g5aSN5ZCI5o6S5bqPIGZpZWxkTGlzdOWMheWQq+WkmuS4quWIl+ihqO+8jOavj+S4quWIl+ihqOWMheWQqzLkuKrlgLzvvIznrKzkuIDkuKrooajnpLropoHmjpLluo/nmoRrZXks56ys5LqM5Liq6KGo56S66KaB5o6S5bqP55qE57G75Z6L77yI5Y2H6ZmN5bqPXHJcblx0XHQvLyDlgLzmjpLluo8g5Y+q5Lyg5LiA5Liq5a2X56ym5Liy6KGo56S65a+55YC85YiX6KGo6L+b6KGM5o6S5bqPXHJcblx0XHRhcnJheVByb3RvW1wic29ydE9uXCJdID0gZnVuY3Rpb24oZmllbGRMaXN0OiBhbnkpOiB2b2lkIHtcclxuXHRcdFx0bGV0IGluZGV4OiBudW1iZXIgPSAwO1xyXG5cdFx0XHR2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGE6IE9iamVjdCwgYjogT2JqZWN0KTogbnVtYmVyIHtcclxuXHRcdFx0XHR2YXIgcmVzdWx0OiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcdHZhciBrZXk6IHN0cmluZyA9IGZpZWxkTGlzdFtpbmRleF1bMF07XHJcblx0XHRcdFx0dmFyIHNvcnRUeXBlOiBzdHJpbmcgPSBmaWVsZExpc3RbaW5kZXhdWzFdIHx8IFwidXBcIjtcclxuXHRcdFx0XHR2YXIgdmFsdWVBID0gYVtrZXldO1xyXG5cdFx0XHRcdHZhciB2YWx1ZUIgPSBiW2tleV07XHJcblx0XHRcdFx0aWYgKHR5cGVvZih2YWx1ZUEpID09IFwiYm9vbGVhblwiKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhbHVlQSA9IHZhbHVlQSA/IDEgOiAwO1xyXG5cdFx0XHRcdFx0dmFsdWVCID0gdmFsdWVCID8gMSA6IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh2YWx1ZUEgPiB2YWx1ZUIpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHNvcnRUeXBlID09IFwidXBcIiA/IDEgOiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodmFsdWVBIDwgdmFsdWVCKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBzb3J0VHlwZSA9PSBcInVwXCIgPyAtMSA6IDE7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGluZGV4Kys7XHJcblx0XHRcdFx0XHRpZiAoZmllbGRMaXN0W2luZGV4XSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbXBhcmUoYSwgYik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGluZGV4ID0gMDtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZiAodHlwZW9mKGZpZWxkTGlzdCkgPT0gXCJzdHJpbmdcIikge1xyXG5cdFx0XHRcdCh0aGlzIGFzIEFycmF5PGFueT4pLnNvcnQoZnVuY3Rpb24oYTogYW55LCBiOiBhbnkpOiBudW1iZXIge1xyXG5cdFx0XHRcdFx0dmFyIHJlc3VsdDogbnVtYmVyID0gMDtcclxuXHRcdFx0XHRcdGlmIChhID4gYikge1xyXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBmaWVsZExpc3QgPT0gXCJ1cFwiID8gMSA6IC0xO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYSA8IGIpIHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gZmllbGRMaXN0ID09IFwidXBcIiA/IC0xIDogMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQodGhpcyBhcyBBcnJheTxhbnk+KS5zb3J0KGNvbXBhcmUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0YXJyYXlQcm90b1tcImdldEluZGV4XCJdID0gZnVuY3Rpb24odmFsdWUgOiBhbnkpOiBudW1iZXIge1xyXG5cdFx0XHR2YXIgaSA9IC0xO1xyXG5cclxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAodGhpc1tpXSA9PSB2YWx1ZSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gaTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghSW50MzJBcnJheVtcInByb3RvdHlwZVwiXVtcImZpbGxcIl0pXHJcblx0XHR7XHJcblx0XHRcdEludDMyQXJyYXlbXCJwcm90b3R5cGVcIl1bXCJmaWxsXCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHR2YXIgaSA9IDA7XHJcblxyXG5cdFx0XHRcdHdoaWxlKHR5cGVvZiB0aGlzW2ldICE9IFwidW5kZWZpbmVkXCIpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpc1tpXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIU51bWJlcltcImlzRmluaXRlXCJdKVxyXG5cdFx0e1xyXG5cdFx0XHROdW1iZXJbXCJpc0Zpbml0ZVwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0cmV0dXJuICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIikgJiYgKHZhbHVlICE9IE5hTik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXHJcbmltcG9ydCBMb2FkaW5nU2NlbmUgZnJvbSBcIi4vc2NyaXB0L3NjZW5lL0xvYWRpbmdTY2VuZVwiXG5pbXBvcnQgTWFpbkdhbWVTY2VuZSBmcm9tIFwiLi9zY3JpcHQvc2NlbmUvTWFpbkdhbWVTY2VuZVwiXG5pbXBvcnQgRm9udEdyaWQgZnJvbSBcIi4vc2NyaXB0L3ByZWZlYi9Gb250R3JpZFwiXG5pbXBvcnQgR2FtZVVJIGZyb20gXCIuL3NjcmlwdC9HYW1lVUlcIlxuaW1wb3J0IEdhbWVDb250cm9sIGZyb20gXCIuL3NjcmlwdC9HYW1lQ29udHJvbFwiXG5pbXBvcnQgQnVsbGV0IGZyb20gXCIuL3NjcmlwdC9CdWxsZXRcIlxuaW1wb3J0IERyb3BCb3ggZnJvbSBcIi4vc2NyaXB0L0Ryb3BCb3hcIlxuaW1wb3J0IEdhbWVSZXN1bHQgZnJvbSBcIi4vc2NyaXB0L3ByZWZlYi9HYW1lUmVzdWx0XCJcbmltcG9ydCBHYW1lU2V0dGluZyBmcm9tIFwiLi9zY3JpcHQvcHJlZmViL0dhbWVTZXR0aW5nXCJcbmltcG9ydCBTdGFydEdhbWUgZnJvbSBcIi4vc2NyaXB0L3ByZWZlYi9TdGFydEdhbWVcIlxuaW1wb3J0IFRpcEl0ZW0gZnJvbSBcIi4vc2NyaXB0L3ByZWZlYi9UaXBJdGVtXCJcclxuLypcclxuKiDmuLjmiI/liJ3lp4vljJbphY3nva47XHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb25maWd7XHJcbiAgICBzdGF0aWMgd2lkdGg6bnVtYmVyPTY0MDtcclxuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XHJcbiAgICBzdGF0aWMgc2NhbGVNb2RlOnN0cmluZz1cInNob3dhbGxcIjtcclxuICAgIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cInZlcnRpY2FsXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25WOnN0cmluZz1cIm1pZGRsZVwiO1xyXG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJjZW50ZXJcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOmFueT1cImxvYWRpbmcvTG9hZGluZy5zY2VuZVwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgdmFyIHJlZzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XHJcbiAgICAgICAgcmVnKFwic2NyaXB0L3NjZW5lL0xvYWRpbmdTY2VuZS50c1wiLExvYWRpbmdTY2VuZSk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9zY2VuZS9NYWluR2FtZVNjZW5lLnRzXCIsTWFpbkdhbWVTY2VuZSk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9wcmVmZWIvRm9udEdyaWQudHNcIixGb250R3JpZCk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9HYW1lVUkudHNcIixHYW1lVUkpO1xuICAgICAgICByZWcoXCJzY3JpcHQvR2FtZUNvbnRyb2wudHNcIixHYW1lQ29udHJvbCk7XG4gICAgICAgIHJlZyhcInNjcmlwdC9CdWxsZXQudHNcIixCdWxsZXQpO1xuICAgICAgICByZWcoXCJzY3JpcHQvRHJvcEJveC50c1wiLERyb3BCb3gpO1xuICAgICAgICByZWcoXCJzY3JpcHQvcHJlZmViL0dhbWVSZXN1bHQudHNcIixHYW1lUmVzdWx0KTtcbiAgICAgICAgcmVnKFwic2NyaXB0L3ByZWZlYi9HYW1lU2V0dGluZy50c1wiLEdhbWVTZXR0aW5nKTtcbiAgICAgICAgcmVnKFwic2NyaXB0L3ByZWZlYi9TdGFydEdhbWUudHNcIixTdGFydEdhbWUpO1xuICAgICAgICByZWcoXCJzY3JpcHQvcHJlZmViL1RpcEl0ZW0udHNcIixUaXBJdGVtKTtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4vQXBwQ29uZmlnXCI7XHJcbmltcG9ydCBNYXBGb250SW5mbyBmcm9tIFwiLi9zY3JpcHQvbW9kZWwvTWFwRm9udEluZm9cIjtcclxuaW1wb3J0IFBsYXllckNvbnRyb2xsZXIgZnJvbSBcIi4vc2NyaXB0L2NvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgQ29kZUV4cGFuZCBmcm9tIFwiLi9Db2RlRXhwYW5kXCI7XHJcbmltcG9ydCB7IFJlc01nciB9IGZyb20gXCIuL1Jlc01nclwiO1xyXG5pbXBvcnQgVVJJIGZyb20gXCIuL1VSSVwiO1xyXG5pbXBvcnQgVGlwQ29udHJvbGxlciBmcm9tIFwiLi9zY3JpcHQvY29udHJvbGxlci9UaXBDb250cm9sbGVyXCI7XHJcbmltcG9ydCBDb250cm9sbGVyTWdyIGZyb20gXCIuL3NjcmlwdC9jb250cm9sbGVyL0NvbnRyb2xsZXJNZ3JcIjtcclxuaW1wb3J0IFNjZW5lTWdyIGZyb20gXCIuL3NjcmlwdC9zY2VuZS9TY2VuZU1nclwiO1xyXG5pbXBvcnQgTG9hZGluZ1NjZW5lIGZyb20gXCIuL3NjcmlwdC9zY2VuZS9Mb2FkaW5nU2NlbmVcIjtcclxuaW1wb3J0IFNvdW5kVG9vbCBmcm9tIFwiLi9zY3JpcHQvdG9vbC9Tb3VuZFRvb2xcIjtcclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHQvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdC8vIGxldCBzdHIgPSBcIlwiO1xyXG5cdFx0Ly8gbGV0IGFyciA9IHN0ci5zcGxpdChcIixcIik7XHJcblx0XHQvLyBsZXQgY291dEFyciA9IFtdO1xyXG5cdFx0Ly8gbGV0IGNvdXQgPSBcIlwiO1xyXG5cdFx0Ly8gYXJyLmZvckVhY2goZWxlbWVudCA9PiB7XHJcblx0XHQvLyBcdGxldCBlbGVtZW50U3RyID0gZWxlbWVudC50cmltKCk7XHJcblx0XHQvLyBcdGlmKGVsZW1lbnRTdHIgPT0gXCJcIilcclxuXHRcdC8vIFx0e1xyXG5cdFx0Ly8gXHRcdHJldHVybjtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHRpZihjb3V0QXJyLmluZGV4T2YoZWxlbWVudFN0cikgIT0gLTEpXHJcblx0XHQvLyBcdHtcclxuXHRcdC8vIFx0XHRyZXR1cm47XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0aWYoY291dCAhPSBcIlwiKVxyXG5cdFx0Ly8gXHR7XHJcblx0XHQvLyBcdFx0Y291dCArPSBcIixcIlxyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdGNvdXRBcnIucHVzaChlbGVtZW50U3RyKTtcclxuXHRcdC8vIFx0Y291dCArPSBcIlxcXCJcIiArZWxlbWVudFN0ciArIFwiXFxcIlwiO1xyXG5cdFx0Ly8gfSlcclxuXHRcdExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCxcIndlYmdsXCIpO1xyXG5cdFx0Ly8gTGF5YS5pbml0KDY0MCwgMTEzNik7XHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0Ly8gaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuXHRcdC8vIHtcclxuXHRcdC8vIFx0Ly8gTGF5YS5VUkwuYmFzZVBhdGggPSBcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS93dXBlaTE5ODcvZm9udC1nYW1lLXd4LWFzc2V0L21hc3Rlci9cIjtcclxuXHRcdC8vIFx0d3guc2V0RW5hYmxlRGVidWcoe1xyXG5cdFx0Ly8gXHRcdGVuYWJsZURlYnVnOiB0cnVlLFxyXG5cdFx0Ly8gXHRcdHN1Y2Nlc3M6IChyZXN1bHQ6IF9zZXRFbmFibGVEZWJ1Z1N1Y2Nlc3NPYmplY3QpID0+IHZvaWR7fSxcclxuXHRcdC8vIFx0XHRmYWlsOiAoKSA9PiB2b2lke30sXHJcblx0XHQvLyBcdFx0Y29tcGxldGU6ICgpID0+IHZvaWR7fSxcclxuXHRcdC8vIFx0ICB9KVxyXG5cdFx0Ly8gfVxyXG5cdFx0aWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuXHRcdHtcclxuXHRcdFx0XHJcblx0XHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gXCJmaXh3aWR0aFwiO1xyXG5cdFx0XHRMYXlhLlVSTC5iYXNlUGF0aCA9IFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3d1cGVpMTk4Ny9mb250LWdhbWUtd3gtYXNzZXQvbWFzdGVyL1wiO1xyXG5cdFx0XHRMYXlhLk1pbmlBZHB0ZXIubmF0aXZlZmlsZXMgPSBbXHJcblx0XHRcdFx0XCJidG5fc3RhcnRHYW1lLnBuZ1wiLFxyXG5cdFx0XHRcdFwiZmlsZWNvbmZpZy5qc29uXCIsXHJcblx0XHRcdFx0XCJ2ZXJzaW9uLmpzb25cIixcclxuXHRcdFx0XHRcImxvYWRpbmcvTG9hZGluZy5qc29uXCIsXHJcblx0XHRcdFx0XCJyZXMvYXRsYXMvbG9hZGluZy5hdGxhc1wiLFxyXG5cdFx0XHRcdFwicmVzL2F0bGFzL2xvYWRpbmcucG5nXCIsXHJcblx0XHRcdFx0XCJtYWluL01haW5HYW1lLmpzb25cIixcclxuXHRcdFx0XHRcInJlcy9hdGxhcy9tYXAuYXRsYXNcIixcclxuXHRcdFx0XHRcInJlcy9hdGxhcy9tYXAucG5nXCIsXHJcblx0XHRcdFx0XCJ0ZXN0L1Rlc3RTY2VuZS5qc29uXCIsXHJcblx0XHRcdFx0XCJyZXMvYXRsYXMvdGVzdC5hdGxhc1wiLFxyXG5cdFx0XHRcdFwicmVzL2RhdGEuanNvblwiLFxyXG5cdFx0XHRcdFwicmVzL3NwaW5lL290aGVyX3Rhb3podWFuZ3hpdG9uZzEuc2tcIixcclxuXHRcdFx0XHRcInJlcy9zcGluZS9vdGhlcl90YW96aHVhbmd4aXRvbmcxLnBuZ1wiLFxyXG5cdFx0XHRcdFwicmVzL3NwaW5lL290aGVyX3d1cGluZ2h1YW5yYW9fa2luX2xpdHRsZS5za1wiLFxyXG5cdFx0XHRcdFwicmVzL3NwaW5lL290aGVyX3d1cGluZ2h1YW5yYW9fa2luX2xpdHRsZS5wbmdcIixcclxuXHRcdFx0XHRcInByZWZhYi9CdWxsZXQuanNvblwiLFxyXG5cdFx0XHRcdFwicHJlZmFiL0Ryb3BCb3guanNvblwiLFxyXG5cdFx0XHRcdFwicHJlZmFiL0ZvbnRHcmlkLmpzb25cIixcclxuXHRcdFx0XHRcInByZWZhYi9HYW1lUmVzdWx0Lmpzb25cIixcclxuXHRcdFx0XHRcInByZWZhYi9HYW1lU2V0dGluZy5qc29uXCIsXHJcblx0XHRcdFx0XCJwcmVmYWIvU3RhcnRHYW1lLmpzb25cIixcclxuXHRcdFx0XHRcInByZWZhYi9UaXBJdGVtLmpzb25cIixcclxuXHRcdFx0XHRcInJlcy9hdGxhcy90ZXN0LnBuZ1wiXHJcblx0XHRcdF07XHJcblx0XHR9XHJcblx0XHRlbHNlIFxyXG5cdFx0e1xyXG5cdFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gTGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHYW1lQ29uZmlnLnNjYWxlTW9kZTtcclxuXHRcdExheWEuc3RhZ2UuYWxpZ25WID0gR2FtZUNvbmZpZy5hbGlnblY7XHJcblx0XHRMYXlhLnN0YWdlLmFsaWduSCA9IEdhbWVDb25maWcuYWxpZ25IO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5mcmFtZVJhdGUgPSBcInNsb3dcIjtcclxuXHRcdC8vIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0Ly8gTGF5YS5Ccm93c2VyLndpbmRvdy5zaG93QWxlcnRPbkpzRXhjZXB0aW9uKGZhbHNlKTtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuXHRcdExheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbjtcclxuXHJcblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHYW1lQ29uZmlnLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0Q29kZUV4cGFuZC5pbml0KCk7XHJcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHR9XHJcblxyXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0TGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSx0cnVlLG51bGwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Mb2FkaW5nTG9hZCkpXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmm7TmlrDov5vluqbmnaFcclxuXHQgKiBAcGFyYW0gcGVyY2VudCDnmb7liIbmr5QgMC0xMDBcclxuXHQgKi9cclxuXHRwcml2YXRlIHVwZGF0ZUxvYWRpbmdQcm9ncmVzcyhwZXJjZW50IDogbnVtYmVyKSAgOnZvaWR7XHJcblx0XHRwZXJjZW50ID0gTWF0aC5mbG9vcihwZXJjZW50KTtcclxuXHRcdGlmKFNjZW5lTWdyLmN1clNjZW5lU2NyaXB0ICE9IG51bGwgJiYgU2NlbmVNZ3IuY3VyU2NlbmVTY3JpcHQgaW5zdGFuY2VvZiBMb2FkaW5nU2NlbmUpXHJcblx0XHR7XHJcblx0XHRcdFNjZW5lTWdyLmN1clNjZW5lU2NyaXB0LnVwZGF0ZVBlcmNlbnQocGVyY2VudClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25Mb2FkaW5nTG9hZCgpIDogdm9pZHtcclxuXHRcdGlmKExheWEuQnJvd3Nlci53aW5kb3cubG9hZGluZ1ZpZXcpe1xyXG5cdFx0XHRMYXlhLkJyb3dzZXIud2luZG93LmxvYWRpbmdWaWV3LmhpZGVMb2FkaW5nVmlldygpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVMb2FkaW5nUHJvZ3Jlc3MoMCk7XHJcblx0XHRSZXNNZ3IuSW5zdGFuY2UoKS5sb2FkTGlzdChBcHBDb25maWcuZ2V0SW5pdExvYWRpbmdVcmxzKCksdGhpcyxmdW5jdGlvbihpbmRleCA6IG51bWJlciwgdG90YWwgOiBudW1iZXIpIDogdm9pZHtcclxuXHRcdFx0dGhpcy51cGRhdGVMb2FkaW5nUHJvZ3Jlc3MoaW5kZXggLyB0b3RhbCAqIDkwKTtcclxuXHRcdH0sZnVuY3Rpb24oKSA6IHZvaWR7XHJcblx0XHRcdHRoaXMubG9hZFN0YXJ0U2NlbmUoKTtcclxuXHRcdH0pXHJcblx0XHQvLyBMYXlhLmxvYWRlci5sb2FkKEFwcENvbmZpZy5nZXRJbml0TG9hZGluZ1VybHMoKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5sb2FkU3RhcnRTY2VuZSksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKHByb2dyZXNzIDogbnVtYmVyKSA6IHZvaWR7XHJcblx0XHQvLyBcdHRoaXMudXBkYXRlTG9hZGluZ1Byb2dyZXNzKHByb2dyZXNzICogOTApO1xyXG5cdFx0Ly8gfSkpO1xyXG5cdH1cclxuXHJcblx0bG9hZFN0YXJ0U2NlbmUoKSA6IHZvaWR7XHJcblx0XHRsZXQgZGF0YSA9IExheWEubG9hZGVyLmdldFJlcyhcInJlcy9kYXRhLmpzb25cIik7XHJcblx0XHRNYXBGb250SW5mby5EYXRhU291cmNlID0gZGF0YTtcclxuXHRcdExheWEuU2NlbmUub3BlbihcIm1haW4vTWFpbkdhbWUuc2NlbmVcIix0cnVlLG51bGwsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25HYW1lU3RhcnQpLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uR2FtZUxvYWRQcm9ncmVzcyxbXSxmYWxzZSkpO1xyXG5cdFx0aWYoTGF5YS5Ccm93c2VyLm9uTWluaUdhbWUpXHJcblx0XHR7XHJcblx0XHRcdExheWEuTWluaUFkcHRlci5zZW5kQXRsYXNUb09wZW5EYXRhQ29udGV4dChcInJlcy9hdGxhcy90ZXN0LmF0bGFzXCIpXHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgb25HYW1lTG9hZFByb2dyZXNzKHZhbHVlIDogbnVtYmVyKSA6IHZvaWR7XHJcblx0XHRpZihMYXlhLkJyb3dzZXIud2luZG93LmxvYWRpbmdWaWV3KXtcclxuXHRcdFx0TGF5YS5Ccm93c2VyLndpbmRvdy5sb2FkaW5nVmlldy5sb2FkaW5nKHZhbHVlICogMTAwKTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTG9hZGluZ1Byb2dyZXNzKDkwICsgdmFsdWUgKiAxMCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG9uR2FtZVN0YXJ0KCkgOiB2b2lke1xyXG5cdFx0Q29udHJvbGxlck1nci5nZXRJbnN0YW5jZShUaXBDb250cm9sbGVyKS5pbml0KCk7XHJcblx0XHRTb3VuZFRvb2wuaW5pdCgpO1xyXG5cdFx0U291bmRUb29sLnBsYXlCZ011c2ljKCk7XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxuaW50ZXJmYWNlIGxvYWRJdGVte1xuICAgIHVybHMgOiBzdHJpbmdbXSxcbiAgICBjYWxsZXIgOiBhbnksXG4gICAgaW5kZXggOiBudW1iZXIsXG4gICAgb25Qcm9ncmVzcyA6IChpbmRleCA6IG51bWJlciwgdG90YWwgOiBudW1iZXIpID0+IHZvaWQsXG4gICAgb25Db21wbGV0ZSA6ICgpID0+IHZvaWRcbn1cblxuZXhwb3J0IGNsYXNzIFJlc01nciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2UgPSBudWxsO1xuICAgIHByaXZhdGUgc3BpbmVMaXN0ICAgICAgIDogT2JqZWN0ID0ge307XG4gICAgcHJpdmF0ZSB0ZXh0dXJlTGlzdCAgICAgOiBPYmplY3QgPSB7fTtcbiAgICBwcml2YXRlIGFuaW1hdGlvbkxpc3QgICA6IE9iamVjdCA9IHt9O1xuICAgIHByaXZhdGUgbW9kZWxEZWxheUxpc3QgIDogT2JqZWN0ID0ge307XG5cbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlKCkgOiBSZXNNZ3Ige1xuICAgICAgICBpZiAoUmVzTWdyLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgIFJlc01nci5pbnN0YW5jZSA9IG5ldyBSZXNNZ3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZXNNZ3IuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyByZWxlYXNlU3BpbmUodXJsIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLnNwaW5lTGlzdFt1cmxdKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgc3BpbmUgOiBMYXlhLlRlbXBsZXQgPSB0aGlzLnNwaW5lTGlzdFt1cmxdO1xuICAgICAgICAgICAgLy8gc3BpbmUucmVsZWFzZVJlc291cmNlKHRydWUpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwaW5lW1wiX2xvYWRMaXN0XCJdLmxlbmd0aDsgaSsrKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgdGV4dHVyZSA6IExheWEuVGV4dHVyZSA9IHNwaW5lLmdldFRleHR1cmUoc3BpbmVbXCJfbG9hZExpc3RcIl1baV0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRleHR1cmUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlLmRpc3Bvc2VCaXRtYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzcGluZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIExheWEubG9hZGVyLmNsZWFyUmVzKHVybCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3BpbmVMaXN0W3VybF0gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRTcGluZSh1cmwgOiBhbnksIGNhbGxiayA6IExheWEuSGFuZGxlcikgOiBhbnkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBudW0gID0gMDtcblxuICAgICAgICB2YXIgbG9hZEZ1bmMgPSBmdW5jdGlvbihzcGluZSkge1xuICAgICAgICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zcGluZUxpc3Rbc3BpbmVdID0gZmFjdG9yeTtcblxuICAgICAgICAgICAgICAgIGlmICgodXJsIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG51bSArKztcblxuICAgICAgICAgICAgICAgICAgICBpZiAobnVtID09IHVybC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSBuZXcgTGF5YS5UZW1wbGV0KCk7XG4gICAgICAgICAgICBmYWN0b3J5Lm9uKExheWEuRXZlbnQuQ09NUExFVEUsIHNlbGYsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIC8vIGZhY3Rvcnkub24oRXZlbnQuRVJST1IsIHRoaXMsIHRoaXMub25FcnJvcik7XG4gICAgICAgICAgICBmYWN0b3J5LmxvYWRBbmkoc3BpbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh1cmwgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXJsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbG9hZEZ1bmModXJsW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvYWRGdW5jKHVybCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZFRleHR1cmUodXJsIDogYW55LCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIpIDogYW55IHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICgodXJsIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVybC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpID09ICh1cmwubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBMYXlhLlRleHR1cmUyRC5sb2FkKHVybFtpXSwgY2FsbGJrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTGF5YS5UZXh0dXJlMkQubG9hZCh1cmxbaV0sIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIExheWEuVGV4dHVyZTJELmxvYWQodXJsLCBjYWxsYmspO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKGNhbGxiayAhPSBudWxsKSB7XG4gICAgICAgIC8vICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZFBORyh1cmwgOiBhbnksIGNhbGxiayA6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkucmVsZWFzZWQgPT0gdHJ1ZSlcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBsZXQgdGV4dHVyZSA6IExheWEuVGV4dHVyZSA9IExheWEubG9hZGVyLmdldFJlcyh1cmwpO1xuICAgICAgICAgICAgLy8gICAgIHRleHR1cmUuYml0bWFwLm9uKExheWEuRXZlbnQuUkVDT1ZFUkVELHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XG4gICAgICAgICAgICAvLyAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgICAgICAvLyAgICAgdGV4dHVyZS5hY3RpdmUoKTtcbiAgICAgICAgICAgIC8vICAgICAvLyB0ZXh0dXJlLmxvYWQodXJsKTtcbiAgICAgICAgICAgIC8vICAgICAvLyBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBlbHNlIFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHVybCwgY2FsbGJrLCBudWxsLCBcImltYWdlXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQTkcodXJsIDogc3RyaW5nKSA6IExheWEuVGV4dHVyZSB7XG4gICAgICAgIHJldHVybiBMYXlhLmxvYWRlci5nZXRSZXModXJsKSBhcyBMYXlhLlRleHR1cmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5qC55o2u5Zu+54mH5Zyw5Z2A5Yib5bu6c3ByaXRlXG4gICAgICogQHBhcmFtIHVybCDlm77niYflnLDlnYBcbiAgICAgKiBAcGFyYW0gc3ByaXRlIOm7mOiupOS4uuepuiDlpoLmnpzkuI3kuLrnqbog55u05o6l5Zyo5q2kc3ByaXRl5LiK57uY5Yi2IFxuICAgICAqL1xuICAgIHB1YmxpYyBjcmVhdGVTcHJpdGUodXJsIDogc3RyaW5nLCBzcHJpdGU/OiBMYXlhLlNwcml0ZSkgOiBMYXlhLlNwcml0ZXtcbiAgICAgICAgbGV0IHNwIDogTGF5YS5TcHJpdGUgPSBzcHJpdGUgfHwgbmV3IExheWEuU3ByaXRlKCk7XG4gICAgICAgIGxldCB0ZXg6IExheWEuVGV4dHVyZTtcbiAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgPT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sb2FkUE5HKHVybCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XG4gICAgICAgICAgICAgICAgdGV4ID0gdGhpcy5nZXRQTkcodXJsKTtcbiAgICAgICAgICAgICAgICBzcC5ncmFwaGljcy5kcmF3VGV4dHVyZSh0ZXgpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzcC5zaXplKHRleC5zb3VyY2VXaWR0aCwgdGV4LnNvdXJjZUhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleCA9IHRoaXMuZ2V0UE5HKHVybCk7XG4gICAgICAgICAgICBzcC5ncmFwaGljcy5kcmF3VGV4dHVyZSh0ZXgpO1xuICAgICAgICAgICAgaWYgKHRleClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzcC5zaXplKHRleC5zb3VyY2VXaWR0aCwgdGV4LnNvdXJjZUhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVJbWcodXJsOiBzdHJpbmcsIGltZz86IExheWEuSW1hZ2UpOiBMYXlhLkltYWdlXG4gICAge1xuICAgICAgICBpZiAoIWltZylcbiAgICAgICAge1xuICAgICAgICAgICAgaW1nID0gbmV3IExheWEuSW1hZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRQTkcodXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgaW1nLnNraW4gPSB1cmw7XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIGltZztcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZE1vZGVsKHVybCA6IGFueSwgY2FsbGJrIDogYW55KSA6IGFueSB7XG4gICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyh1cmwpICYmIExheWEubG9hZGVyLmdldFJlcyh1cmwpW1wiX2NoaWxkcmVuXCJdICYmIExheWEubG9hZGVyLmdldFJlcyh1cmwpLmdldENoaWxkQXQoMCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgTGF5YS5sb2FkZXIuY3JlYXRlKHVybCwgY2FsbGJrKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZCh1cmwgOiBzdHJpbmcsIGNhbGxiayA6IExheWEuSGFuZGxlcikgOiB2b2lke1xuICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKSAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmwsY2FsbGJrKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZEpzb24odXJsIDogYW55LCBjYWxsYmsgOiBMYXlhLkhhbmRsZXIpIDogdm9pZHtcbiAgICAgICAgaWYoTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCkgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodXJsLCBjYWxsYmssbnVsbCwgTGF5YS5Mb2FkZXIuSlNPTik7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRBdGxhcyh1cmwgOiBhbnksIGNhbGxiayA6IExheWEuSGFuZGxlcikgOiB2b2lkXG4gICAge1xuICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXModXJsKSAhPSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmwsY2FsbGJrLG51bGwsTGF5YS5Mb2FkZXIuQVRMQVMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkQW5pbWF0aW9uKGFuaVVybDogc3RyaW5nLCBhdGxhc1VybDogc3RyaW5nLCBjYWxsYms6IExheWEuSGFuZGxlcik6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmIChhdGxhc1VybCAhPSBcIlwiICYmIGF0bGFzVXJsICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKExheWEubG9hZGVyLmdldFJlcyhhbmlVcmwpICE9IG51bGwgJiYgTGF5YS5sb2FkZXIuZ2V0UmVzKGF0bGFzVXJsKSAhPSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihMYXlhLmxvYWRlci5nZXRSZXMoYW5pVXJsKSAhPSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhbGxiay5ydW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChhbmlVcmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoYXRsYXNVcmwgIT0gbnVsbCAmJiBhdGxhc1VybCAhPSBcIlwiKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQoYXRsYXNVcmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25MaXN0W2FuaVVybF0gPSBhdGxhc1VybDtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJrLnJ1bigpO1xuICAgICAgICAgICAgICAgIH0pLCBudWxsLCBMYXlhLkxvYWRlci5BVExBUylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYWxsYmsucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwsIGZhbHNlKSwgbnVsbCwgTGF5YS5Mb2FkZXIuSlNPTik7XG4gICAgfVxuXG4gICAgXG4gICAgcHVibGljIGdldFNwaW5lKHVybCA6IHN0cmluZykgOiBMYXlhLlRlbXBsZXQge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGluZUxpc3RbdXJsXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlU3BpbmUodXJsIDogc3RyaW5nLCBhbmltYXRpb24/OiBzdHJpbmcsIGxvb3AgOiBib29sZWFuID0gdHJ1ZSwgY2FsbGJrIDogTGF5YS5IYW5kbGVyID0gbnVsbCkgOiBMYXlhLlNrZWxldG9uIHtcbiAgICAgICAgdmFyIHNrOiBMYXlhLlNrZWxldG9uO1xuICAgICAgICBpZiAodGhpcy5zcGluZUxpc3RbdXJsXSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2sgPSB0aGlzLnNwaW5lTGlzdFt1cmxdLmJ1aWxkQXJtYXR1cmUoMCk7XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uICE9IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2sucGxheShhbmltYXRpb24sIGxvb3ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2FsbGJrICE9IG51bGwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FsbGJrLnJ1bldpdGgoc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgc2sgPSBuZXcgTGF5YS5Ta2VsZXRvbigpO1xuICAgICAgICAgICAgdGhpcy5sb2FkU3BpbmUodXJsLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzay5pbml0KHRoaXMuc3BpbmVMaXN0W3VybF0sIDApO1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb24gIT0gbnVsbClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNrLnBsYXkoYW5pbWF0aW9uLCBsb29wKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJrICE9IG51bGwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmsucnVuV2l0aChzayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNrXG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUFuaW1hdGlvbih1cmw6IHN0cmluZywgYW5pbWF0aW9uPzogc3RyaW5nKTogTGF5YS5BbmltYXRpb25cbiAgICB7XG4gICAgICAgIHZhciBhbmk6IExheWEuQW5pbWF0aW9uID0gbmV3IExheWEuQW5pbWF0aW9uKCk7XG4gICAgICAgIGFuaS5zb3VyY2UgPSB1cmw7XG4gICAgICAgIGlmIChhbmltYXRpb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFuaS5wbGF5KG51bGwsIHRydWUsIGFuaW1hdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBnZXRUZXh0dXJlKHVybCA6IHN0cmluZywgY2FsbGJrIDogTGF5YS5IYW5kbGVyKSA6IHZvaWQge1xuICAgICAgICBsZXQgcmVzID0gTGF5YS5sb2FkZXIuZ2V0UmVzKHVybCk7XG5cbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgY2FsbGJrLnJ1bldpdGgocmVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9hZFRleHR1cmUodXJsLCBjYWxsYmspO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRyeUdldFRleHR1cmUodXJsIDogc3RyaW5nKSA6IExheWEuVGV4dHVyZTJEIHtcbiAgICAgICAgbGV0IHJlcyA9IExheWEubG9hZGVyLmdldFJlcyh1cmwpO1xuXG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaWR4IDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgbG9hZExpc3QodXJscyA6IHN0cmluZ1tdLGNhbGxlciA6IGFueSwgb25Qcm9ncmVzcyA6IChpbmRleCA6IG51bWJlciwgdG90YWwgOiBudW1iZXIpID0+IHZvaWQsIG9uQ29tcGxldGUgOiAoKSA9PiB2b2lkKSA6IFJlc01nclxuICAgIHtcbiAgICAgICAgaWYodXJscy5sZW5ndGggPT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgb25Db21wbGV0ZS5jYWxsKGNhbGxlcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGl0ZW0gID0ge1xuICAgICAgICAgICAgaWQgOiB0aGlzLmlkeCxcbiAgICAgICAgICAgIHVybHMgOiB1cmxzLFxuICAgICAgICAgICAgY2FsbGVyIDogY2FsbGVyLFxuICAgICAgICAgICAgaW5kZXggOiAwLFxuICAgICAgICAgICAgb25Qcm9ncmVzczpvblByb2dyZXNzLFxuICAgICAgICAgICAgb25Db21wbGV0ZSA6IG9uQ29tcGxldGVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlkeCArKztcbiAgICAgICAgdGhpcy5zdGFydExvYWQoaXRlbSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydExvYWQgKGl0ZW0gOiBsb2FkSXRlbSkgOiB2b2lkXG4gICAge1xuICAgICAgICBpZihpdGVtLnVybHMubGVuZ3RoIDw9IGl0ZW0uaW5kZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKGl0ZW0ub25Db21wbGV0ZSAhPSBudWxsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGl0ZW0ub25Db21wbGV0ZS5jYWxsKGl0ZW0uY2FsbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXJsID0gaXRlbS51cmxzW2l0ZW0uaW5kZXhdO1xuICAgICAgICBcbiAgICAgICAgaXRlbS5pbmRleCsrO1xuICAgICAgICBpZihpdGVtLm9uUHJvZ3Jlc3MgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgaXRlbS5vblByb2dyZXNzLmNhbGwoaXRlbS5jYWxsZXIsaXRlbS5pbmRleCxpdGVtLnVybHMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRPbmNlKHVybCwgdGhpcy5zdGFydExvYWQsIGl0ZW0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZE9uY2UodXJsIDogYW55LCBjYWxsQmFjayA6IChpdGVtIDogbG9hZEl0ZW0pID0+IHZvaWQsaXRlbSA6IGxvYWRJdGVtKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGlmKHVybCBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICAge1xuICAgICAgICAgICAgdXJsID0gdXJsLnVybDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHlwZSA6IHN0cmluZyA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy4nKSArIDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBmICA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihwYXJfY2FsbEJrLHBhcl90aGlzLHBhcl9pdGVtLHBhcl91cmwpIDogdm9pZHtcbiAgICAgICAgICAgIHBhcl9jYWxsQmsuY2FsbChwYXJfdGhpcyxwYXJfaXRlbSk7XG4gICAgICAgIH0sW2NhbGxCYWNrLHRoaXMsaXRlbSx1cmxdKTtcbiAgICAgICAgc3dpdGNoKHR5cGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgXCJwbmdcIjpcbiAgICAgICAgICAgICAgICBpZih1cmwuaW5kZXhPZihcInRleHR1cmUvXCIpID09IC0xKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFBORyh1cmwsZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRUZXh0dXJlKHVybCxmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2tcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTcGluZSh1cmwsIGYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImxoXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkTW9kZWwodXJsLCBmKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgICAgICBjYXNlIFwibGFuZ1wiOlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEpzb24odXJsLGYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImF0bGFzXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQXRsYXModXJsLGYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImFuaVwiOlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEFuaW1hdGlvbih1cmwsIG51bGwsIGYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQodXJsLGYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSSSBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcHJlZmFiVXJsICA9IFwicHJlZmFiL1wiO1xyXG4gICAgcHVibGljIHN0YXRpYyBzcGluZVVybCAgPSBcInJlcy9zcGluZS9cIjtcclxuICAgIHB1YmxpYyBzdGF0aWMgc291bmRVcmwgID0gXCJzb3VuZC9cIjtcclxufSIsIi8qKlxyXG4gKiDlrZDlvLnohJrmnKzvvIzlrp7njrDlrZDlvLnpo57ooYzpgLvovpHlj4rlr7nosaHmsaDlm57mlLbmnLrliLZcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1bGxldCBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcblxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy/orr7nva7liJ3lp4vpgJ/luqZcclxuICAgICAgICB2YXIgcmlnOiBMYXlhLlJpZ2lkQm9keSA9IHRoaXMub3duZXIuZ2V0Q29tcG9uZW50KExheWEuUmlnaWRCb2R5KTtcclxuICAgICAgICByaWcuc2V0VmVsb2NpdHkoeyB4OiAwLCB5OiAtMTAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25UcmlnZ2VyRW50ZXIob3RoZXI6IGFueSwgc2VsZjogYW55LCBjb250YWN0OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAvL+WmguaenOiiq+eisOWIsO+8jOWImeenu+mZpOWtkOW8uVxyXG4gICAgICAgIHRoaXMub3duZXIucmVtb3ZlU2VsZigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIC8v5aaC5p6c5a2Q5by56LaF5Ye65bGP5bmV77yM5YiZ56e76Zmk5a2Q5by5XHJcbiAgICAgICAgaWYgKCh0aGlzLm93bmVyIGFzIExheWEuU3ByaXRlKS55IDwgLTEwKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIucmVtb3ZlU2VsZigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy/lrZDlvLnooqvnp7vpmaTml7bvvIzlm57mlLblrZDlvLnliLDlr7nosaHmsaDvvIzmlrnkvr/kuIvmrKHlpI3nlKjvvIzlh4/lsJHlr7nosaHliJvlu7rlvIDplIBcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcImJ1bGxldFwiLCB0aGlzLm93bmVyKTtcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lVUkgZnJvbSBcIi4vR2FtZVVJXCI7XHJcbi8qKlxyXG4gKiDmjonokL3nm5LlrZDohJrmnKzvvIzlrp7njrDnm5LlrZDnorDmkp7lj4rlm57mlLbmtYHnqItcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyb3BCb3ggZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICAvKirnm5LlrZDnrYnnuqcgKi9cclxuICAgIGxldmVsOiBudW1iZXIgPSAxO1xyXG4gICAgLyoq562J57qn5paH5pys5a+56LGh5byV55SoICovXHJcbiAgICBwcml2YXRlIF90ZXh0OiBMYXlhLlRleHQ7XHJcbiAgICAvKirliJrkvZPlr7nosaHlvJXnlKggKi9cclxuICAgIHByaXZhdGUgX3JpZzogTGF5YS5SaWdpZEJvZHlcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgLyoq6I635b6X57uE5Lu25byV55So77yM6YG/5YWN5q+P5qyh6I635Y+W57uE5Lu25bim5p2l5LiN5b+F6KaB55qE5p+l6K+i5byA6ZSAICovXHJcbiAgICAgICAgdGhpcy5fcmlnID0gdGhpcy5vd25lci5nZXRDb21wb25lbnQoTGF5YS5SaWdpZEJvZHkpO1xyXG4gICAgICAgIHRoaXMubGV2ZWwgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiA1KSArIDE7XHJcbiAgICAgICAgdGhpcy5fdGV4dCA9IHRoaXMub3duZXIuZ2V0Q2hpbGRCeU5hbWUoXCJsZXZlbFR4dFwiKSBhcyBMYXlhLlRleHQ7XHJcbiAgICAgICAgdGhpcy5fdGV4dC50ZXh0ID0gdGhpcy5sZXZlbCArIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy/orqnmjIHnu63nm5LlrZDml4vovaxcclxuICAgICAgICAodGhpcy5vd25lciBhcyBMYXlhLlNwcml0ZSkucm90YXRpb24rKztcclxuICAgIH1cclxuXHJcbiAgICBvblRyaWdnZXJFbnRlcihvdGhlcjogYW55LCBzZWxmOiBhbnksIGNvbnRhY3Q6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHZhciBvd25lcjogTGF5YS5TcHJpdGUgPSB0aGlzLm93bmVyIGFzIExheWEuU3ByaXRlO1xyXG4gICAgICAgIGlmIChvdGhlci5sYWJlbCA9PT0gXCJidXR0bGVcIikge1xyXG4gICAgICAgICAgICAvL+eisOaSnuWIsOWtkOW8ueWQju+8jOWinuWKoOenr+WIhu+8jOaSreaUvuWjsOmfs+eJueaViFxyXG4gICAgICAgICAgICBpZiAodGhpcy5sZXZlbCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGV2ZWwtLTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHQuY2hhbmdlVGV4dCh0aGlzLmxldmVsICsgXCJcIik7XHJcbiAgICAgICAgICAgICAgICBvd25lci5nZXRDb21wb25lbnQoTGF5YS5SaWdpZEJvZHkpLnNldFZlbG9jaXR5KHsgeDogMCwgeTogLTEwIH0pO1xyXG4gICAgICAgICAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFwic291bmQvaGl0LndhdlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvd25lci5wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWZmZWN0OiBMYXlhLkFuaW1hdGlvbiA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJlZmZlY3RcIiwgdGhpcy5jcmVhdGVFZmZlY3QsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdC5wb3Mob3duZXIueCwgb3duZXIueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIucGFyZW50LmFkZENoaWxkKGVmZmVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0LnBsYXkoMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIucmVtb3ZlU2VsZigpO1xyXG4gICAgICAgICAgICAgICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChcInNvdW5kL2Rlc3Ryb3kud2F2XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEdhbWVVSS5pbnN0YW5jZS5hZGRTY29yZSgxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG90aGVyLmxhYmVsID09PSBcImdyb3VuZFwiKSB7XHJcbiAgICAgICAgICAgIC8v5Y+q6KaB5pyJ5LiA5Liq55uS5a2Q56Kw5Yiw5Zyw5p2/77yM5YiZ5YGc5q2i5ri45oiPXHJcbiAgICAgICAgICAgIG93bmVyLnJlbW92ZVNlbGYoKTtcclxuICAgICAgICAgICAgR2FtZVVJLmluc3RhbmNlLnN0b3BHYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuS9v+eUqOWvueixoeaxoOWIm+W7uueIhueCuOWKqOeUuyAqL1xyXG4gICAgY3JlYXRlRWZmZWN0KCk6IExheWEuQW5pbWF0aW9uIHtcclxuICAgICAgICBsZXQgYW5pOiBMYXlhLkFuaW1hdGlvbiA9IG5ldyBMYXlhLkFuaW1hdGlvbigpO1xyXG4gICAgICAgIGFuaS5sb2FkQW5pbWF0aW9uKFwidGVzdC9UZXN0QW5pLmFuaVwiKTtcclxuICAgICAgICBhbmkub24oTGF5YS5FdmVudC5DT01QTEVURSwgbnVsbCwgcmVjb3Zlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gcmVjb3ZlcigpOiB2b2lkIHtcclxuICAgICAgICAgICAgYW5pLnJlbW92ZVNlbGYoKTtcclxuICAgICAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJlZmZlY3RcIiwgYW5pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFuaTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgLy/nm5LlrZDooqvnp7vpmaTml7bvvIzlm57mlLbnm5LlrZDliLDlr7nosaHmsaDvvIzmlrnkvr/kuIvmrKHlpI3nlKjvvIzlh4/lsJHlr7nosaHliJvlu7rlvIDplIDjgIJcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcImRyb3BCb3hcIiwgdGhpcy5vd25lcik7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IERyb3BCb3ggZnJvbSBcIi4vRHJvcEJveFwiO1xyXG5pbXBvcnQgQnVsbGV0IGZyb20gXCIuL0J1bGxldFwiO1xyXG4vKipcclxuICog5ri45oiP5o6n5Yi26ISa5pys44CC5a6a5LmJ5LqG5Yeg5LiqZHJvcEJveO+8jGJ1bGxldO+8jGNyZWF0ZUJveEludGVydmFs562J5Y+Y6YeP77yM6IO95aSf5ZyoSURF5pi+56S65Y+K6K6+572u6K+l5Y+Y6YePXHJcbiAqIOabtOWkmuexu+Wei+WumuS5ie+8jOivt+WPguiAg+WumOaWueaWh+aho1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbnRyb2wgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICAvKiogQHByb3Age25hbWU6ZHJvcEJveCx0aXBzOlwi5o6J6JC95a655Zmo6aKE5Yi25L2T5a+56LGhXCIsdHlwZTpQcmVmYWJ9Ki9cclxuICAgIGRyb3BCb3g6IExheWEuUHJlZmFiO1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOmJ1bGxldCx0aXBzOlwi5a2Q5by56aKE5Yi25L2T5a+56LGhXCIsdHlwZTpQcmVmYWJ9Ki9cclxuICAgIGJ1bGxldDogTGF5YS5QcmVmYWI7XHJcbiAgICAvKiogQHByb3Age25hbWU6Y3JlYXRlQm94SW50ZXJ2YWwsdGlwczpcIumXtOmalOWkmuWwkeavq+enkuWIm+W7uuS4gOS4quS4i+i3jOeahOWuueWZqFwiLHR5cGU6aW50LGRlZmF1bHQ6MTAwMH0qL1xyXG4gICAgY3JlYXRlQm94SW50ZXJ2YWw6IG51bWJlciA9IDEwMDA7XHJcbiAgICAvKirlvIDlp4vml7bpl7QqL1xyXG4gICAgcHJpdmF0ZSBfdGltZTogbnVtYmVyID0gMDtcclxuICAgIC8qKuaYr+WQpuW3sue7j+W8gOWni+a4uOaIjyAqL1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoq5a2Q5by55ZKM55uS5a2Q5omA5Zyo55qE5a655Zmo5a+56LGhICovXHJcbiAgICBwcml2YXRlIF9nYW1lQm94OiBMYXlhLlNwcml0ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3RpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuX2dhbWVCb3ggPSB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKFwiZ2FtZUJveFwiKSBhcyBMYXlhLlNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICBvblVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAvL+avj+mXtOmalOS4gOauteaXtumXtOWIm+W7uuS4gOS4quebkuWtkFxyXG4gICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGlmIChub3cgLSB0aGlzLl90aW1lID4gdGhpcy5jcmVhdGVCb3hJbnRlcnZhbCYmdGhpcy5fc3RhcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUJveCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCb3goKTogdm9pZCB7XHJcbiAgICAgICAgLy/kvb/nlKjlr7nosaHmsaDliJvlu7rnm5LlrZBcclxuICAgICAgICBsZXQgYm94OiBMYXlhLlNwcml0ZSA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJkcm9wQm94XCIsIHRoaXMuZHJvcEJveC5jcmVhdGUsIHRoaXMuZHJvcEJveCk7XHJcbiAgICAgICAgYm94LnBvcyhNYXRoLnJhbmRvbSgpICogKExheWEuc3RhZ2Uud2lkdGggLSAxMDApLCAtMTAwKTtcclxuICAgICAgICB0aGlzLl9nYW1lQm94LmFkZENoaWxkKGJveCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdGFnZUNsaWNrKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAvL+WBnOatouS6i+S7tuWGkuazoe+8jOaPkOmrmOaAp+iDve+8jOW9k+eEtuS5n+WPr+S7peS4jeimgVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgLy/oiJ7lj7Dooqvngrnlh7vlkI7vvIzkvb/nlKjlr7nosaHmsaDliJvlu7rlrZDlvLlcclxuICAgICAgICBsZXQgZmx5ZXI6IExheWEuU3ByaXRlID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcImJ1bGxldFwiLCB0aGlzLmJ1bGxldC5jcmVhdGUsIHRoaXMuYnVsbGV0KTtcclxuICAgICAgICBmbHllci5wb3MoTGF5YS5zdGFnZS5tb3VzZVgsIExheWEuc3RhZ2UubW91c2VZKTtcclxuICAgICAgICB0aGlzLl9nYW1lQm94LmFkZENoaWxkKGZseWVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlvIDlp4vmuLjmiI/vvIzpgJrov4fmv4DmtLvmnKzohJrmnKzmlrnlvI/lvIDlp4vmuLjmiI8qL1xyXG4gICAgc3RhcnRHYW1lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3RhcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq57uT5p2f5ri45oiP77yM6YCa6L+H6Z2e5r+A5rS75pys6ISa5pys5YGc5q2i5ri45oiPICovXHJcbiAgICBzdG9wR2FtZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVCb3hJbnRlcnZhbCA9IDEwMDA7XHJcbiAgICAgICAgdGhpcy5fZ2FtZUJveC5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IEdhbWVDb250cm9sIGZyb20gXCIuL0dhbWVDb250cm9sXCJcclxuLyoqXHJcbiAqIOacrOekuuS+i+mHh+eUqOmdnuiEmuacrOeahOaWueW8j+WunueOsO+8jOiAjOS9v+eUqOe7p+aJv+mhtemdouWfuuexu++8jOWunueOsOmhtemdoumAu+i+keOAguWcqElERemHjOmdouiuvue9ruWcuuaZr+eahFJ1bnRpbWXlsZ7mgKfljbPlj6/lkozlnLrmma/ov5vooYzlhbPogZRcclxuICog55u45q+U6ISa5pys5pa55byP77yM57un5om/5byP6aG16Z2i57G777yM5Y+v5Lul55u05o6l5L2/55So6aG16Z2i5a6a5LmJ55qE5bGe5oCn77yI6YCa6L+HSURF5YaFdmFy5bGe5oCn5a6a5LmJ77yJ77yM5q+U5aaCdGhpcy50aXBMYmxs77yMdGhpcy5zY29yZUxibO+8jOWFt+acieS7o+eggeaPkOekuuaViOaenFxyXG4gKiDlu7rorq7vvJrlpoLmnpzmmK/pobXpnaLnuqfnmoTpgLvovpHvvIzpnIDopoHpopHnuYHorr/pl67pobXpnaLlhoXlpJrkuKrlhYPntKDvvIzkvb/nlKjnu6fmib/lvI/lhpnms5XvvIzlpoLmnpzmmK/ni6znq4vlsI/mqKHlnZfvvIzlip/og73ljZXkuIDvvIzlu7rorq7nlKjohJrmnKzmlrnlvI/lrp7njrDvvIzmr5TlpoLlrZDlvLnohJrmnKzjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVVSSBleHRlbmRzIHVpLnRlc3QuVGVzdFNjZW5lVUkge1xyXG4gICAgLyoq6K6+572u5Y2V5L6L55qE5byV55So5pa55byP77yM5pa55L6/5YW25LuW57G75byV55SoICovXHJcbiAgICBzdGF0aWMgaW5zdGFuY2U6IEdhbWVVSTtcclxuICAgIC8qKuW9k+WJjea4uOaIj+enr+WIhuWtl+autSAqL1xyXG4gICAgcHJpdmF0ZSBfc2NvcmU6IG51bWJlcjtcclxuICAgIC8qKua4uOaIj+aOp+WItuiEmuacrOW8leeUqO+8jOmBv+WFjeavj+asoeiOt+WPlue7hOS7tuW4puadpeS4jeW/heimgeeahOaAp+iDveW8gOmUgCAqL1xyXG4gICAgcHJpdmF0ZSBfY29udHJvbDogR2FtZUNvbnRyb2w7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBHYW1lVUkuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgICAgIC8v5YWz6Zet5aSa54K56Kem5o6n77yM5ZCm5YiZ5bCx5peg5pWM5LqGXHJcbiAgICAgICAgTGF5YS5Nb3VzZU1hbmFnZXIubXVsdGlUb3VjaEVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb250cm9sID0gdGhpcy5nZXRDb21wb25lbnQoR2FtZUNvbnRyb2wpO1xyXG4gICAgICAgIC8v54K55Ye75o+Q56S65paH5a2X77yM5byA5aeL5ri45oiPXHJcbiAgICAgICAgdGhpcy50aXBMYmxsLm9uKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMub25UaXBDbGljayk7XHJcbiAgICB9XHJcblxyXG4gICAgb25UaXBDbGljayhlOiBMYXlhLkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy50aXBMYmxsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zY29yZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zY29yZUxibC50ZXh0ID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9jb250cm9sLnN0YXJ0R2FtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWinuWKoOWIhuaVsCAqL1xyXG4gICAgYWRkU2NvcmUodmFsdWU6IG51bWJlciA9IDEpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zY29yZSArPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnNjb3JlTGJsLmNoYW5nZVRleHQoXCLliIbmlbDvvJpcIiArIHRoaXMuX3Njb3JlKTtcclxuICAgICAgICAvL+maj+edgOWIhuaVsOi2iumrmO+8jOmavuW6puWinuWkp1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250cm9sLmNyZWF0ZUJveEludGVydmFsID4gNjAwICYmIHRoaXMuX3Njb3JlICUgMjAgPT0gMCkgdGhpcy5fY29udHJvbC5jcmVhdGVCb3hJbnRlcnZhbCAtPSAyMDtcclxuICAgIH1cclxuXHJcbiAgICAvKirlgZzmraLmuLjmiI8gKi9cclxuICAgIHN0b3BHYW1lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudGlwTGJsbC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRpcExibGwudGV4dCA9IFwi5ri45oiP57uT5p2f5LqG77yM54K55Ye75bGP5bmV6YeN5paw5byA5aeLXCI7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbC5zdG9wR2FtZSgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlckJhc2UgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfY29udHJvbGxlck9ianMgPSB7fTtcclxuICAgIHB1YmxpYyBnZXRTaWduKCkgOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9fcHJvdG9fX1wiXS5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZTxUPihjIDogbmV3KCkgPT4gVCkgOiBUXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgbGV0IHNpZ24gPSBjW1wibmFtZVwiXTtcclxuICAgIC8vICAgICBsZXQgaXRlbSA9IENvbnRyb2xsZXJCYXNlLl9jb250cm9sbGVyT2Jqc1tzaWduXTtcclxuICAgIC8vICAgICBpZihpdGVtID09IG51bGwpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICBpdGVtID0gbmV3IGMoKTtcclxuICAgIC8vICAgICAgICAgQ29udHJvbGxlckJhc2UuX2NvbnRyb2xsZXJPYmpzW3NpZ25dID0gaXRlbTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIHNob3coKSA6IHZvaWR7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZSgpIDogdm9pZHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3koKSA6IHZvaWR7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ29udHJvbGxlckJhc2UgZnJvbSBcIi4vQ29udHJvbGxlckJhc2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXJNZ3Ige1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NvbnRyb2xsZXJPYmpzID0ge307XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlPFQgZXh0ZW5kcyBDb250cm9sbGVyQmFzZT4oYyA6IG5ldygpID0+IFQpIDogVFxyXG4gICAge1xyXG4gICAgICAgIGxldCBzaWduID0gY1tcIm5hbWVcIl07XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBDb250cm9sbGVyTWdyLl9jb250cm9sbGVyT2Jqc1tzaWduXTtcclxuICAgICAgICBpZihpdGVtID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpdGVtID0gbmV3IGMoKTtcclxuICAgICAgICAgICAgQ29udHJvbGxlck1nci5fY29udHJvbGxlck9ianNbc2lnbl0gPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxufSIsImltcG9ydCBDb250cm9sbGVyQmFzZSBmcm9tIFwiLi9Db250cm9sbGVyQmFzZVwiO1xyXG5pbXBvcnQgUGxheWVySW5mbyBmcm9tIFwiLi4vbW9kZWwvUGxheWVySW5mb1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXJCYXNlIHtcclxuICAgIHB1YmxpYyBteVBsYXllckluZm8gPSBuZXcgUGxheWVySW5mbygpO1xyXG59IiwiaW1wb3J0IENvbnRyb2xsZXJCYXNlIGZyb20gXCIuL0NvbnRyb2xsZXJCYXNlXCI7XHJcbmltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuLi8uLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBUaXBJdGVtIGZyb20gXCIuLi9wcmVmZWIvVGlwSXRlbVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlwQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXJCYXNlIHtcclxuICAgIHByaXZhdGUgX3RpcFNwciA6IExheWEuU3ByaXRlO1xyXG4gICAgcHVibGljIGdldCB0aXBTcHIoKSA6IExheWEuU3ByaXRlXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpcFNwcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpbml0KCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fdGlwU3ByID0gbmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5fdGlwU3ByLm5hbWUgPSBcIlRpcFNwclwiO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQodGhpcy5fdGlwU3ByKTtcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKFwicHJlZmFiL1RpcEl0ZW0uanNvblwiLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZFRpcEl0ZW1Db21wbGV0ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RpcEl0ZW1QcmVmYWIgOiBMYXlhLlByZWZhYjtcclxuICAgIHByaXZhdGUgb25Mb2FkVGlwSXRlbUNvbXBsZXRlKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX3RpcEl0ZW1QcmVmYWIgPSBuZXcgTGF5YS5QcmVmYWIoKTtcclxuICAgICAgICB0aGlzLl90aXBJdGVtUHJlZmFiLmpzb24gPSBMYXlhLmxvYWRlci5nZXRSZXMoXCJwcmVmYWIvVGlwSXRlbS5qc29uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2xhYmVscyA6IExheWEuTGFiZWxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRZID0gOTYwO1xyXG4gICAgcHVibGljIHNob3dMZWZ0Qm90dG9tVGlwKHRleHQgOiBzdHJpbmcpIDogdm9pZHtcclxuICAgICAgICBsZXQgbGFiZWwgPSBuZXcgTGF5YS5MYWJlbCgpO1xyXG4gICAgICAgIGxhYmVsLmNvbG9yID0gXCIjMjA0ODAwXCI7XHJcbiAgICAgICAgbGFiZWwudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgbGFiZWwuZm9udCA9IFwiU2ltSGVpXCI7XHJcbiAgICAgICAgbGFiZWwuZm9udFNpemUgPSAzMDtcclxuICAgICAgICBsYWJlbC5hbmNob3JZID0gMTtcclxuICAgICAgICBsYWJlbC55ID0gdGhpcy5fc3RhcnRZO1xyXG4gICAgICAgIHRoaXMuX3RpcFNwci5hZGRDaGlsZChsYWJlbCk7XHJcbiAgICAgICAgdGhpcy5fbGFiZWxzLnB1c2gobGFiZWwpO1xyXG4gICAgICAgIHRoaXMuc29ydExhYmVscygpO1xyXG4gICAgICAgIExheWEudGltZXIub25jZSgxMDAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIExheWEuVHdlZW4udG8obGFiZWwse2FscGhhIDogMH0sMzAwKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIExheWEudGltZXIub25jZSgxMzAwLHRoaXMsIGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICB0aGlzLl9sYWJlbHMuc3BsaWNlKHRoaXMuX2xhYmVscy5pbmRleE9mKGxhYmVsKSwxKVxyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKGxhYmVsKTtcclxuICAgICAgICAgICAgbGFiZWwuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc29ydExhYmVscygpIDogdm9pZHtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXI7IGkgPCB0aGlzLl9sYWJlbHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLl9sYWJlbHNbaV07XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRZID0gdGhpcy5fc3RhcnRZIC0gNDAgKiBpO1xyXG4gICAgICAgICAgICBMYXlhLlR3ZWVuLnRvKGxhYmVsLHt5IDogdGFyZ2V0WX0sMTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdGlwSXRlbXMgPSBbXTtcclxuICAgIHByaXZhdGUgX3RpcEl0ZW1TdGFydFkgID0gNTUwO1xyXG4gICAgcHVibGljIHNob3dUaXAodHh0IDogc3RyaW5nKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fdGlwSXRlbVByZWZhYiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRpcEl0ZW1TcHIgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiVGlwSXRlbVwiLHRoaXMuX3RpcEl0ZW1QcmVmYWIuY3JlYXRlLHRoaXMuX3RpcEl0ZW1QcmVmYWIpO1xyXG4gICAgICAgICAgICBsZXQgdGlwSXRlbVNjcmlwdCA9IHRpcEl0ZW1TcHIuZ2V0Q29tcG9uZW50KFRpcEl0ZW0pIGFzIFRpcEl0ZW07XHJcbiAgICAgICAgICAgIHRpcEl0ZW1TY3JpcHQudGV4dCA9IHR4dDtcclxuICAgICAgICAgICAgdGhpcy5fdGlwU3ByLmFkZENoaWxkKHRpcEl0ZW1TcHIpO1xyXG4gICAgICAgICAgICB0aXBJdGVtU3ByLnggPSAoR2FtZUNvbmZpZy53aWR0aCAtIHRpcEl0ZW1TcHIud2lkdGgpIC8gMjtcclxuICAgICAgICAgICAgdGlwSXRlbVNwci55ID0gdGhpcy5fdGlwSXRlbVN0YXJ0WSAtIDYwO1xyXG4gICAgICAgICAgICB0aGlzLl90aXBJdGVtcy5wdXNoKHRpcEl0ZW1TcHIpO1xyXG4gICAgICAgICAgICB0aGlzLnNvcnRUaXBJdGVtcygpO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgTGF5YS5Ud2Vlbi50byh0aXBJdGVtU3ByLHthbHBoYSA6IDB9LDMwMClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMzAwLHRoaXMsIGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGlwSXRlbXMuc3BsaWNlKHRoaXMuX3RpcEl0ZW1zLmluZGV4T2YodGlwSXRlbVNwciksMSlcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIuY2xlYXJBbGwodGlwSXRlbVNwcik7XHJcbiAgICAgICAgICAgICAgICB0aXBJdGVtU3ByLmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc29ydFRpcEl0ZW1zKCkgOiB2b2lke1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLl90aXBJdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IHRoaXMuX3RpcEl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0WSA9IHRoaXMuX3RpcEl0ZW1TdGFydFkgLSA2MCAqICh0aGlzLl90aXBJdGVtcy5sZW5ndGggLSBpKTtcclxuICAgICAgICAgICAgTGF5YS5Ud2Vlbi50byhsYWJlbCx7eSA6IHRhcmdldFl9LDEwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCJcclxuaW1wb3J0IE1vZGVsQmFzZSBmcm9tIFwiLi9Nb2RlbEJhc2VcIjtcclxuaW1wb3J0IHsgUmVzTWdyIH0gZnJvbSBcIi4uLy4uL1Jlc01nclwiO1xyXG5pbXBvcnQgVVJJIGZyb20gXCIuLi8uLi9VUklcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwRm9udEluZm8gZXh0ZW5kcyBNb2RlbEJhc2V7XHJcbiAgICBwdWJsaWMgc3RhdGljIERhdGFTb3VyY2UgOiBvYmplY3Q7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZ3JvdXBDYWNoZSA9IHt9O1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRHcm91cChmb250IDogc3RyaW5nKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgaWYoTWFwRm9udEluZm8uX2dyb3VwQ2FjaGVbZm9udF0gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJncm91cFwiXS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBHcm91cCA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJncm91cFwiXVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBHcm91cC5pbmRleE9mKGZvbnQpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHRlbXBHcm91cCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgTWFwRm9udEluZm8uX2dyb3VwQ2FjaGVbZm9udF0gPSBhcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXBGb250SW5mby5fZ3JvdXBDYWNoZVtmb250XTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0ZXh0IDogc3RyaW5nO1xyXG4gICAgcHVibGljIHN0cnVjdEluZm8gOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIHggOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeSA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3F1YWxpdHkgOiBudW1iZXIgPSAxO1xyXG4gICAgcHVibGljIGdldCBxdWFsaXR5ICgpIDogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9xdWFsaXR5O1xyXG4gICAgfVxyXG4gICAgLy8xLDIsMyw0IOWIneWni+S4ujHvvIzmsqHlkIjmiJDkuIDmrKHljYfnuqfvvIzmnIDpq5g057qnXHJcbiAgICBwdWJsaWMgc2V0IHF1YWxpdHkodmFsdWUgOiBudW1iZXIpIFxyXG4gICAge1xyXG4gICAgICAgIGlmKHZhbHVlID4gNClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcXVhbGl0eSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgX3Bvb2wgPSBbXTtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRhdGE/IDogT2JqZWN0KSA6IE1hcEZvbnRJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBvb2xzWydNYXBGb250SW5mbyddID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBcHBDb25maWcucG9vbHNbJ01hcEZvbnRJbmZvJ10gPSB7c2lnbiA6ICdNYXBGb250SW5mbycsIHBvb2wgOiBNYXBGb250SW5mby5fcG9vbCwgY3JlYXRlQ291bnQgOiAwLCByZWNvdmVyQ291bnQgOiAwfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBGb250SW5mbyddLmNyZWF0ZUNvdW50ICsrO1xyXG4gICAgICAgIGxldCBjb3V0O1xyXG4gICAgICAgIGlmKE1hcEZvbnRJbmZvLl9wb29sLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0ID0gTWFwRm9udEluZm8uX3Bvb2wucG9wKCk7XHJcbiAgICAgICAgICAgIGNvdXQuaXNSZWNvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0ID0gbmV3IE1hcEZvbnRJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAgY291dC5zZXREYXRhQnlLZXkoZGF0YSlcclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaGVDaGVuZ0NpWnVPYmogPSB7fTtcclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5Y+v5ZCI5oiQ6K+N57uEXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgY2FuSGVDaGVuZ0dyb3VwKCkgOiBib29sZWFue1xyXG4gICAgICAgIGlmKE1hcEZvbnRJbmZvLl9oZUNoZW5nQ2ladU9ialt0aGlzLnRleHRdID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgY291dCA9IFtdO1xyXG4gICAgICAgICAgICBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZ3JvdXBcIl0uZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuaW5kZXhPZih0aGlzLnRleHQpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdXQucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE1hcEZvbnRJbmZvLl9oZUNoZW5nQ2ladU9ialt0aGlzLnRleHRdID0gY291dDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXBGb250SW5mby5faGVDaGVuZ0NpWnVPYmpbdGhpcy50ZXh0XS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY2FuSGVDaGVuZ0dyb3VwcygpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmNhbkhlQ2hlbmdHcm91cClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXBGb250SW5mby5faGVDaGVuZ0NpWnVPYmpbdGhpcy50ZXh0XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2uZm9udElkLOaJvuWHuuS9v+eUqOi/meS4qmlk55qE57uE5ZCI5YiX6KGoLOacquS8oOWFpWZvbnRJZO+8jOWImei+k+WHuuaJgOaciee7hOWQiOWIl+ihqFxyXG4gICAgICogQHBhcmFtIGlkIGZvbnQgaWRcclxuICAgICAqIEBwYXJhbSBpc0V4Y2VwdFNlbGYg5piv5ZCm5o6S6Zmk6Ieq5bexXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTdHJ1Y3RJbmZvcyhmb250SWQgOiBudW1iZXIgPSBudWxsLGlzRXhjZXB0U2VsZiA6IGJvb2xlYW4gPSB0cnVlKSA6IHN0cmluZ1tdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGNvdXQgPSBbXTtcclxuICAgICAgICBpZihmb250SWQgPT0gdGhpcy5pZCAmJiBpc0V4Y2VwdFNlbGYgPT0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb3V0LnB1c2goZm9udElkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zdHJ1Y3RJbmZvLnNwbGl0KFwiLFwiKS5mb3JFYWNoKGVsZW1lbnQgPT57XHJcbiAgICAgICAgICAgICAgICBpZihmb250SWQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50ID09IHRoaXMuaWQudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY291dC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzRXhjZXB0U2VsZiAmJiBlbGVtZW50ID09IGZvbnRJZC50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50LnNwbGl0KFwiX1wiKS5pbmRleE9mKGZvbnRJZC50b1N0cmluZygpKSAhPSAtMSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXQucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2hlQ2hlbmdIYW5aaU9iaiA9IHt9O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKblj6/lkIjmiJDlhbbku5bmsYnlrZBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjYW5IZUNoZW5nRm9udCgpIDogYm9vbGVhbntcclxuICAgICAgICBpZihNYXBGb250SW5mby5faGVDaGVuZ0hhblppT2JqW3RoaXMudGV4dF0gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb3V0ID0gW107XHJcbiAgICAgICAgICAgIE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250XCJdLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIGZvbnRJbmZvLnNldERhdGFCeVZhbHVlQXJyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0cnVjdEluZm9zID0gZm9udEluZm8uZ2V0U3RydWN0SW5mb3ModGhpcy5pZCk7XHJcbiAgICAgICAgICAgICAgICBpZihzdHJ1Y3RJbmZvcy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdXQucHVzaChmb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBNYXBGb250SW5mby5faGVDaGVuZ0hhblppT2JqW3RoaXMudGV4dF0gPSBjb3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uX2hlQ2hlbmdIYW5aaU9ialt0aGlzLnRleHRdLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjYW5IZUNoZW5nRm9udEluZm9zKCkgOiBNYXBGb250SW5mb1tde1xyXG4gICAgICAgIGlmKHRoaXMuY2FuSGVDaGVuZ0ZvbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uX2hlQ2hlbmdIYW5aaU9ialt0aGlzLnRleHRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbmmK/nibnmioDmoLzlrZDvvIznibnmioDmoLzlrZDvvJrooqvmtojpmaTmiJblkIjmiJDnmoTml7blgJnvvIzkvJrop6blj5HlsY/luZXkuIrmiYDmnInmnInov5nkuKrmsYnlrZDnmoTmoLzlrZDmtojpmaRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzU3R1bnRGb250IDogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIF9zdHVudEZvbnRFZmZlY3QgOiBMYXlhLlNrZWxldG9uO1xyXG4gICAgcHVibGljIGdldFN0dW50Rm9udEVmZmVjdCAoKSA6IExheWEuU2tlbGV0b25cclxuICAgIHsgXHJcbiAgICAgICAgaWYoIXRoaXMuaXNTdHVudEZvbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc3R1bnRGb250RWZmZWN0ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3QgPSBSZXNNZ3IuSW5zdGFuY2UoKS5jcmVhdGVTcGluZShVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3d1cGluZ2h1YW5yYW9fa2luX2xpdHRsZS5za1wiLFwiYW5pbWF0aW9uXCIsdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdC54ID0gdGhpcy5fc3R1bnRGb250RWZmZWN0LnkgPSA0NDtcclxuICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0LnNjYWxlWCA9IHRoaXMuX3N0dW50Rm9udEVmZmVjdC5zY2FsZVkgPSAxLjM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdHVudEZvbnRFZmZlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3lTdHVudEVmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9zdHVudEZvbnRFZmZlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3QuZGVzdHJveSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250RWZmZWN0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0cnVjdCgpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRfc3RydWN0XCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5pc1JlY292ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3N0dW50Rm9udEVmZmVjdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udEVmZmVjdC5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdHVudEZvbnRFZmZlY3QgPSBudWxsO1xyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wb29sc1snTWFwRm9udEluZm8nXSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBGb250SW5mbyddID0ge3NpZ24gOiAnTWFwRm9udEluZm8nLCBwb29sIDogTWFwRm9udEluZm8uX3Bvb2wsIGNyZWF0ZUNvdW50IDogMCwgcmVjb3ZlckNvdW50IDogMH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwRm9udEluZm8nXS5yZWNvdmVyQ291bnQgKys7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTWFwRm9udEluZm8uX3Bvb2wucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmlzUmVjb3ZlciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERhdGFCeVZhbHVlQXJyKGRhdGFBcnIpIDogdm9pZHtcclxuICAgICAgICBsZXQgZm9udFN0cnVjdCA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250X3N0cnVjdFwiXTtcclxuICAgICAgICBsZXQgb2JqO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBkYXRhQXJyLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoZm9udFN0cnVjdC5sZW5ndGggPiBpKVxyXG4gICAgICAgICAgICAgICAgdGhpc1tmb250U3RydWN0W2ldXSA9IGRhdGFBcnJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREYXRhQnlLZXkodmFsdWUgOiBvYmplY3QpIDogdm9pZHtcclxuICAgICAgICBsZXQgb2JqO1xyXG4gICAgICAgIGxldCBmb250U3RydWN0ID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRfc3RydWN0XCJdO1xyXG4gICAgICAgIGxldCBmb250RGF0YXMgPSBNYXBGb250SW5mby5EYXRhU291cmNlW1wiZm9udFwiXTtcclxuICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgZm9udERhdGFzLmxlbmd0aCA7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBmb250QXJyID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImZvbnRcIl1baV07XHJcbiAgICAgICAgICAgIGxldCBpc01lZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IobGV0IHRlbXBQcm9wZXJ0eSBpbiB2YWx1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodmFsdWVbdGVtcFByb3BlcnR5XSAhPSBmb250QXJyW2ZvbnRTdHJ1Y3QuaW5kZXhPZih0ZW1wUHJvcGVydHkpXSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpc01lZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpc01lZXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMDsgaiA8IGZvbnRTdHJ1Y3QubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2ZvbnRTdHJ1Y3Rbal1dID0gZm9udEFycltqXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCJcclxuaW1wb3J0IE1vZGVsQmFzZSBmcm9tIFwiLi9Nb2RlbEJhc2VcIjtcclxuaW1wb3J0IE1hcEZvbnRJbmZvIGZyb20gXCIuL01hcEZvbnRJbmZvXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcFN0YXJJbmZvIGV4dGVuZHMgTW9kZWxCYXNle1xyXG4gICAgcHVibGljIHN0YXJfbnVtIDogbnVtYmVyO1xyXG4gICAgcHVibGljIHNwZWVkX3JhdGUgOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3BsaXRfcmF0ZSA6IG51bWJlcjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIF9wb29sID0gW107XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShkYXRhPyA6IE9iamVjdCkgOiBNYXBTdGFySW5mb1xyXG4gICAge1xyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wb29sc1snTWFwU3RhckluZm8nXSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBTdGFySW5mbyddID0ge3NpZ24gOiAnTWFwU3RhckluZm8nLCBwb29sIDogTWFwU3RhckluZm8uX3Bvb2wsIGNyZWF0ZUNvdW50IDogMCwgcmVjb3ZlckNvdW50IDogMH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwU3RhckluZm8nXS5jcmVhdGVDb3VudCArKztcclxuICAgICAgICBsZXQgY291dDtcclxuICAgICAgICBpZihNYXBTdGFySW5mby5fcG9vbC5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dCA9IE1hcFN0YXJJbmZvLl9wb29sLnBvcCgpO1xyXG4gICAgICAgICAgICBjb3V0LmlzUmVjb3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dCA9IG5ldyBNYXBTdGFySW5mbygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkYXRhICE9IG51bGwpXHJcbiAgICAgICAgICAgIGNvdXQuc2V0RGF0YUJ5S2V5KGRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0cnVjdCgpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcInN0YXJfc3RydWN0XCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5pc1JlY292ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wb29sc1snTWFwU3RhckluZm8nXSA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNYXBTdGFySW5mbyddID0ge3NpZ24gOiAnTWFwU3RhckluZm8nLCBwb29sIDogTWFwU3RhckluZm8uX3Bvb2wsIGNyZWF0ZUNvdW50IDogMCwgcmVjb3ZlckNvdW50IDogMH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFwcENvbmZpZy5wb29sc1snTWFwU3RhckluZm8nXS5yZWNvdmVyQ291bnQgKys7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTWFwU3RhckluZm8uX3Bvb2wucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmlzUmVjb3ZlciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERhdGFCeUtleSh2YWx1ZSA6IG9iamVjdCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBvYmo7XHJcbiAgICAgICAgbGV0IHN0cnVjdCA9IHRoaXMuZ2V0U3RydWN0KCk7XHJcbiAgICAgICAgbGV0IGRhdGFzID0gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcInN0YXJcIl07XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IGRhdGFzLmxlbmd0aCA7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBmb250QXJyID0gZGF0YXNbaV07XHJcbiAgICAgICAgICAgIGxldCBpc01lZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IobGV0IHRlbXBQcm9wZXJ0eSBpbiB2YWx1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodmFsdWVbdGVtcFByb3BlcnR5XSAhPSBmb250QXJyW3N0cnVjdC5pbmRleE9mKHRlbXBQcm9wZXJ0eSldKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzTWVldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGlzTWVldClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2JqID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwOyBqIDwgc3RydWN0Lmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtzdHJ1Y3Rbal1dID0gZm9udEFycltqXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9iaiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWxCYXNlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgbW9kZWxJZEluY3JlYXNlIDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX19fX19pZCA6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5fX19fX2lkID0gTW9kZWxCYXNlLm1vZGVsSWRJbmNyZWFzZTtcclxuICAgICAgICBNb2RlbEJhc2UubW9kZWxJZEluY3JlYXNlICsrO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBfcG9vbCA9IFtdO1xyXG4gICAgcHVibGljIGlzUmVjb3ZlciA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9zaWduIDogc3RyaW5nO1xyXG4gICAgcHVibGljIHNldERhdGEob2JqIDogYW55KSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IHN0cnVjdCA9IHRoaXMuZ2V0U3RydWN0KCk7XHJcbiAgICAgICAgaWYob2JqIGluc3RhbmNlb2YgQXJyYXkgJiYgc3RydWN0ICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgOiBudW1iZXIgPSAwOyBpIDwgc3RydWN0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW3N0cnVjdFtpXV0gPSBvYmpbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgdGVtcFBybyBpbiBvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbdGVtcFByb10gPSBvYmpbdGVtcFByb107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0cnVjdCgpIDogc3RyaW5nW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFNpZ24oKSA6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuX3NpZ24gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NpZ24gPSB0aGlzW1wiX19wcm90b19fXCJdLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaWduO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGRhdGE/IDogT2JqZWN0KSA6IE1vZGVsQmFzZVxyXG4gICAge1xyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wb29sc1snTW9kZWxCYXNlJ10gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEFwcENvbmZpZy5wb29sc1snTW9kZWxCYXNlJ10gPSB7c2lnbiA6ICdNb2RlbEJhc2UnLCBwb29sIDogTW9kZWxCYXNlLl9wb29sLCBjcmVhdGVDb3VudCA6IDAsIHJlY292ZXJDb3VudCA6IDB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBBcHBDb25maWcucG9vbHNbJ01vZGVsQmFzZSddLmNyZWF0ZUNvdW50ICsrO1xyXG4gICAgICAgIGxldCBjb3V0O1xyXG4gICAgICAgIGlmKE1vZGVsQmFzZS5fcG9vbC5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dCA9IE1vZGVsQmFzZS5fcG9vbC5wb3AoKTtcclxuICAgICAgICAgICAgY291dC5pc1JlY292ZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvdXQgPSBuZXcgTW9kZWxCYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAgY291dC5zZXREYXRhQnlLZXkoZGF0YSlcclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSZWNvdmVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihBcHBDb25maWcucG9vbHNbJ01vZGVsQmFzZSddID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBcHBDb25maWcucG9vbHNbJ01vZGVsQmFzZSddID0ge3NpZ24gOiAnTW9kZWxCYXNlJywgcG9vbCA6IE1vZGVsQmFzZS5fcG9vbCwgY3JlYXRlQ291bnQgOiAwLCByZWNvdmVyQ291bnQgOiAwfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXBwQ29uZmlnLnBvb2xzWydNb2RlbEJhc2UnXS5yZWNvdmVyQ291bnQgKys7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTW9kZWxCYXNlLl9wb29sLnB1c2godGhpcyk7XHJcbiAgICAgICAgdGhpcy5pc1JlY292ZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREYXRhQnlLZXkodmFsdWUgOiBvYmplY3QpIDogdm9pZHtcclxuICAgIH1cclxufSIsImltcG9ydCBNb2RlbEJhc2UgZnJvbSBcIi4vTW9kZWxCYXNlXCI7XHJcbmltcG9ydCBNYXBTdGFySW5mbyBmcm9tIFwiLi9NYXBTdGFySW5mb1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVySW5mbyBleHRlbmRzIE1vZGVsQmFzZSB7XHJcbiAgICBwdWJsaWMgbmFtZSA6IHN0cmluZyA9IFwidGVzdFwiO1xyXG4gICAgcHVibGljIHVybCA6IHN0cmluZyA9IFwiaHR0cDovL2Nkbi5kdWl0YW5nLmNvbS91cGxvYWRzL2l0ZW0vMjAxNDEwLzA4LzIwMTQxMDA4MTUwMDE1X2RQOHlKLnRodW1iLjcwMF8wLmpwZWdcIjtcclxuICAgIHByaXZhdGUgX3N0YXJJbmZvIDogTWFwU3RhckluZm87XHJcbiAgICBwdWJsaWMgZ2V0U3RhckluZm8oc2NvcmUgOiBudW1iZXIpIDogTWFwU3RhckluZm97XHJcbiAgICAgICAgbGV0IHN0YXJOdW07XHJcbiAgICAgICAgaWYoc2NvcmUgPCAzMDAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3Rhck51bSA9MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzY29yZSA8IDgwMDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFyTnVtID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihzY29yZSA8IDEyMDAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3Rhck51bSA9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoc2NvcmUgPCAzMDAwMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXJOdW0gPSAzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHNjb3JlIDwgNjAwMDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFyTnVtID0gNDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0YXJOdW0gPSA1O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9zdGFySW5mbyA9PSBudWxsIHx8IHRoaXMuX3N0YXJJbmZvLnN0YXJfbnVtICE9IHN0YXJOdW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFySW5mbyA9IE1hcFN0YXJJbmZvLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9zdGFySW5mby5zdGFyX251bSAhPSBzdGFyTnVtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFySW5mby5zZXREYXRhQnlLZXkoe3N0YXJfbnVtIDogc3Rhck51bX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFySW5mbztcclxuICAgIH1cclxufSIsImltcG9ydCBQcmVmZWJCYXNlIGZyb20gXCIuL1ByZWZlYkJhc2VcIlxyXG5pbXBvcnQgeyBSZXNNZ3IgfSBmcm9tIFwiLi4vLi4vUmVzTWdyXCI7XHJcbmltcG9ydCBVUkkgZnJvbSBcIi4uLy4uL1VSSVwiO1xyXG5pbXBvcnQgTWFwRm9udEluZm8gZnJvbSBcIi4uL21vZGVsL01hcEZvbnRJbmZvXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvbnRHcmlkIGV4dGVuZHMgUHJlZmViQmFzZSB7XHJcbiAgICAvKiogQHByb3Age25hbWU6Zm9udCwgdGlwczpcIuaYvuekuuaWh+Wtl1wiLCB0eXBlOlN0cmluZywgZGVmYXVsdDpcIlwifSovXHJcbiAgICBwdWJsaWMgZm9udDogc3RyaW5nID0gXCJcIjtcclxuICAgIC8qKiBAcHJvcCB7bmFtZTpudW1UeXBlLCB0aXBzOlwi6LSo6YePIOiTnTHvvIznuqIy77yM57SrM++8jOmHkTRcIiwgdHlwZTpOdW1iZXIsIGRlZmF1bHQ6MX0qL1xyXG4gICAgcHVibGljIHF1YWxpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gICAgcHJpdmF0ZSBjb2xvckFyciA9IFtcImJsdWVcIixcInJlZFwiLFwicHVwbGVcIixcInllbGxvd1wiXTtcclxuXHJcbiAgICBwcml2YXRlIF9lZmZlY3RzIDogTGF5YS5Ta2VsZXRvbltdID0gW107XHJcblxyXG4gICAgcHVibGljIGFkZEVmZmVjdChlZmZlY3QgOiBMYXlhLlNrZWxldG9uKSA6IHZvaWR7XHJcbiAgICAgICAgaWYoZWZmZWN0ID09IG51bGwpcmV0dXJuO1xyXG4gICAgICAgIHRoaXMub3duZXIuYWRkQ2hpbGQoZWZmZWN0KTtcclxuICAgICAgICB0aGlzLl9lZmZlY3RzLnB1c2goZWZmZWN0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGNsZWFyRWZmZWN0cygpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9lZmZlY3RzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZWZmZWN0cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuICAgIFxyXG4gICAgb25VcGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGltZ19iZyA9IHRoaXMub3duZXIuZ2V0Q2hpbGRCeU5hbWUoXCJpbWdfYmdcIikgYXMgTGF5YS5JbWFnZTtcclxuICAgICAgICBpZih0aGlzLmZvbnQgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIuZ2V0Q2hpbGRCeU5hbWUoXCJ0eHRcIilbXCJ0ZXh0XCJdID0gdGhpcy5mb250O1xyXG4gICAgICAgICAgICBpbWdfYmcudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGltZ19iZy5za2luID0gXCJtYXAvaW1nX1wiK3RoaXMuZ2V0UXVhbGl0eVNpZ24oKStcIkdyaWRCZy5wbmdcIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLmdldENoaWxkQnlOYW1lKFwidHh0XCIpW1widGV4dFwiXSA9IFwiXCI7XHJcbiAgICAgICAgICAgIGltZ19iZy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRRdWFsaXR5U2lnbigpIDogc3RyaW5ne1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbG9yQXJyW3RoaXMucXVhbGl0eSAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJlc2V0KCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMucXVhbGl0eSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVjb3ZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbGF5SGVDaGVuZ0VmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBsZXQgc2sgPSBSZXNNZ3IuSW5zdGFuY2UoKS5jcmVhdGVTcGluZShVUkkuc3BpbmVVcmwgKyBcIm90aGVyX3Rhb3podWFuZ3hpdG9uZzEuc2tcIixcImFuaW1hdGlvblwiLGZhbHNlKTtcclxuICAgICAgICBzay54ID0gc2sueSA9IDQ0O1xyXG4gICAgICAgIHNrLnNjYWxlWCA9IHNrLnNjYWxlWSA9IDEuNztcclxuICAgICAgICB0aGlzLm93bmVyLmFkZENoaWxkKHNrKTtcclxuICAgICAgICBzay5vbihMYXlhLkV2ZW50LlNUT1BQRUQsIHRoaXMsIGZ1bmN0aW9uIChwYXJfc2spIHtcclxuICAgICAgICAgICAgcGFyX3NrLmRlc3Ryb3koKTtcclxuICAgICAgICB9LFtza10pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNldCgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLnF1YWxpdHkgPSAxO1xyXG4gICAgICAgIHRoaXMuY2xlYXJFZmZlY3RzKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUHJlZmViQmFzZSBmcm9tIFwiLi9QcmVmZWJCYXNlXCI7XHJcbmltcG9ydCBBcHBDb25maWcgZnJvbSBcIi4uLy4uL0FwcENvbmZpZ1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVJlc3VsdCBleHRlbmRzIFByZWZlYkJhc2Uge1xyXG4gICAgcHVibGljIHNob3dIb21lSGFuZGxlciA6IExheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyByZXN0YXJ0SGFuZGxlciA6IExheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBzY29yZSA6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgdHh0X3Njb3JlIDogTGF5YS5UZXh0O1xyXG4gICAgcHVibGljIGltZ19yYW5rQmcgOiBMYXlhLkltYWdlO1xyXG4gICAgcHVibGljIHR4dF9zaG93UmFuayA6IExheWEuVGV4dDtcclxuICAgIHB1YmxpYyBidG5faG9tZSA6IExheWEuQnV0dG9uO1xyXG4gICAgcHVibGljIGJ0bl90cnlBZ2FpbiA6IExheWEuQnV0dG9uO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgICAgICB0aGlzLnR4dF9zY29yZS50ZXh0ID0gdGhpcy5zY29yZS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuYnRuX2hvbWUuY2xpY2tIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICB0aGlzLnNob3dIb21lSGFuZGxlci5ydW4oKTtcclxuICAgICAgICB9LG51bGwsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYnRuX3RyeUFnYWluLmNsaWNrSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydEhhbmRsZXIucnVuV2l0aCgxKTtcclxuICAgICAgICAgICAgICAgIHd4W1wic2hhcmVBcHBNZXNzYWdlXCJdKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA6ICfmiJHlnKjov5nkuKrmuLjmiI/ph4zpnaLlvpfkuoYnICsgdGhpcy5zY29yZSArXCLliIZcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybCA6IFwiaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvaWFVVnV4QXJFOUw5RzI4RjZYcnhLQUlFdEpPczl4MVljbTJNWW1DMlV6NVQ5TzRSTHEwZWp2RzNpYzJLbFVCaWFWZi8wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmxJZCA6IFwiTmVsZW5IUExSWEsxLUFXRU5uMGFad1wiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydEhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LG51bGwsZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5idG5faG9tZS5vZmZBbGwoKTtcclxuICAgICAgICB0aGlzLmJ0bl90cnlBZ2Fpbi5vZmZBbGwoKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQcmVmZWJCYXNlIGZyb20gXCIuL1ByZWZlYkJhc2VcIjtcclxuaW1wb3J0IEFwcENvbmZpZyBmcm9tIFwiLi4vLi4vQXBwQ29uZmlnXCI7XHJcbmltcG9ydCBDb250cm9sbGVyTWdyIGZyb20gXCIuLi9jb250cm9sbGVyL0NvbnRyb2xsZXJNZ3JcIjtcclxuaW1wb3J0IFRpcENvbnRyb2xsZXIgZnJvbSBcIi4uL2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgU291bmRUb29sIGZyb20gXCIuLi90b29sL1NvdW5kVG9vbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVNldHRpbmcgZXh0ZW5kcyBQcmVmZWJCYXNlIHtcclxuICAgIHB1YmxpYyBzaG93SG9tZUhhbmRsZXIgOiBMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgcmVzdGFydEhhbmRsZXIgOiBMYXlhLkhhbmRsZXI7XHJcbiAgICBwdWJsaWMgb25DbG9zZUhhbmRsZXIgOiBMYXlhLkhhbmRsZXI7XHJcblxyXG4gICAgcHVibGljIHByb2dyZXNzX211c2ljIDogTGF5YS5Qcm9ncmVzc0JhcjtcclxuICAgIHB1YmxpYyBwcm9ncmVzc19lZmZlY3QgOiBMYXlhLlByb2dyZXNzQmFyO1xyXG4gICAgcHVibGljIGJ0bl9ob21lIDogTGF5YS5CdXR0b247XHJcbiAgICBwdWJsaWMgYnRuX3RyeUFnYWluIDogTGF5YS5CdXR0b247XHJcbiAgICBwdWJsaWMgYnRuX3NoYXJlIDogTGF5YS5CdXR0b247XHJcbiAgICBwdWJsaWMgYnRuX2Nsb3NlIDogTGF5YS5CdXR0b247XHJcbiAgICBwdWJsaWMgYnRuX211c2ljIDogTGF5YS5CdXR0b247XHJcbiAgICBwdWJsaWMgYnRuX2VmZmVjdCA6IExheWEuQnV0dG9uO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgICAgICB0aGlzLmJ0bl9ob21lLmNsaWNrSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgdGhpcy5zaG93SG9tZUhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmJ0bl90cnlBZ2Fpbi5jbGlja0hhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydEhhbmRsZXIucnVuV2l0aCgxKTtcclxuICAgICAgICAgICAgICAgIHd4W1wic2hhcmVBcHBNZXNzYWdlXCJdKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA6ICflj5HnjrDmnInkuKrmnInotqPnmoTmuLjmiI8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsIDogXCJodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9pYVVWdXhBckU5TDlHMjhGNlhyeEtBSUV0Sk9zOXgxWWNtMk1ZbUMyVXo1VDlPNFJMcTBlanZHM2ljMktsVUJpYVZmLzBcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybElkIDogXCJOZWxlbkhQTFJYSzEtQVdFTm4wYVp3XCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0YXJ0SGFuZGxlci5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5idG5fc2hhcmUuY2xpY2tIYW5kbGVyID0gKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgICAgICAvLyBpZihlLnR5cGUgIT0gTGF5YS5FdmVudC5NT1VTRV9VUClyZXR1cm47XHJcbiAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHd4W1wic2hhcmVBcHBNZXNzYWdlXCJdKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA6ICflj5HnjrDmnInkuKrmnInotqPnmoTmuLjmiI8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsIDogXCJodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9pYVVWdXhBckU5TDlHMjhGNlhyeEtBSUV0Sk9zOXgxWWNtMk1ZbUMyVXo1VDlPNFJMcTBlanZHM2ljMktsVUJpYVZmLzBcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVVybElkIDogXCJOZWxlbkhQTFJYSzEtQVdFTm4wYVp3XCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29udHJvbGxlck1nci5nZXRJbnN0YW5jZShUaXBDb250cm9sbGVyKS5zaG93VGlwKFwi5bC95oOF5pyf5b6FXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxudWxsLGZhbHNlKSk7XHJcbiAgICAgICAgdGhpcy5idG5fY2xvc2UuY2xpY2tIYW5kbGVyID0gKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgICAgICAvLyBpZihlLnR5cGUgIT0gTGF5YS5FdmVudC5NT1VTRV9VUClyZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VIYW5kbGVyLnJ1bigpO1xyXG4gICAgICAgIH0sbnVsbCxmYWxzZSkpO1xyXG4gICAgICAgIHRoaXMuYnRuX211c2ljLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMub25EcmFnTW91c2VEb3duKTtcclxuICAgICAgICB0aGlzLmJ0bl9lZmZlY3Qub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vbkRyYWdNb3VzZURvd24pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9kcmFnVGFyZ2V0IDogTGF5YS5CdXR0b25cclxuICAgIG9uRHJhZ01vdXNlRG93bihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2RyYWdUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgYXMgTGF5YS5CdXR0b247XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX1VQLHRoaXMsdGhpcy5vblN0YWdlTW91c2VVcDIpO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vblN0YWdlTW91c2VNb3ZlMik7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdGFnZU1vdXNlVXAyKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fZHJhZ1RhcmdldCA9IG51bGw7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YS5FdmVudC5NT1VTRV9VUCx0aGlzLHRoaXMub25TdGFnZU1vdXNlVXAyKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9mZihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLm9uU3RhZ2VNb3VzZU1vdmUyKTtcclxuICAgIH1cclxuXHJcbiAgICBvblN0YWdlTW91c2VNb3ZlMihlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBwb2ludCA9IG5ldyBMYXlhLlBvaW50KGUuc3RhZ2VYLGUuc3RhZ2VZKTtcclxuICAgICAgICBsZXQgcHJvZ3Jlc3MgOiBMYXlhLlByb2dyZXNzQmFyO1xyXG4gICAgICAgIGlmKHRoaXMuX2RyYWdUYXJnZXQgPT0gdGhpcy5idG5fZWZmZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzX2VmZmVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzID0gdGhpcy5wcm9ncmVzc19tdXNpYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9pbnQgPSB0aGlzLl9kcmFnVGFyZ2V0LnBhcmVudFtcImdsb2JhbFRvTG9jYWxcIl0ocG9pbnQpO1xyXG4gICAgICAgIGxldCB4ID0gcG9pbnQueCAtIHByb2dyZXNzLnggLSB0aGlzLl9kcmFnVGFyZ2V0LndpZHRoIC8gMjtcclxuICAgICAgICBpZih4IDwgMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih4ID4gcHJvZ3Jlc3Mud2lkdGggLSB0aGlzLl9kcmFnVGFyZ2V0LndpZHRoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeCA9IHByb2dyZXNzLndpZHRoIC0gdGhpcy5fZHJhZ1RhcmdldC53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG51bSA9IHggLyAocHJvZ3Jlc3Mud2lkdGggLSB0aGlzLl9kcmFnVGFyZ2V0LndpZHRoKTtcclxuICAgICAgICBwcm9ncmVzcy52YWx1ZSA9IG51bTtcclxuICAgICAgICBpZihwcm9ncmVzcyA9PSB0aGlzLnByb2dyZXNzX2VmZmVjdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNvdW5kVG9vbC5zZXRTb3VuZFZvbHVtZShudW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU291bmRUb29sLnNldE11c2ljVm9sdW1lKG51bSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWZyZXNoKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NfZWZmZWN0LnZhbHVlID0gU291bmRUb29sLmdldFNvdW5kVm9sdW1lKCk7XHJcbiAgICAgICAgdGhpcy5idG5fZWZmZWN0LnggPSB0aGlzLnByb2dyZXNzX2VmZmVjdC54ICsgKHRoaXMucHJvZ3Jlc3NfZWZmZWN0LndpZHRoIC0gdGhpcy5idG5fZWZmZWN0LndpZHRoKSAqIHRoaXMucHJvZ3Jlc3NfZWZmZWN0LnZhbHVlICsgdGhpcy5idG5fZWZmZWN0LndpZHRoLzI7XHJcblxyXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NfbXVzaWMudmFsdWUgPSBTb3VuZFRvb2wuZ2V0TXVzaWNWb2x1bWUoKTtcclxuICAgICAgICB0aGlzLmJ0bl9tdXNpYy54ID0gdGhpcy5wcm9ncmVzc19tdXNpYy54ICsgKHRoaXMucHJvZ3Jlc3NfbXVzaWMud2lkdGgtIHRoaXMuYnRuX211c2ljLndpZHRoKSAqIHRoaXMucHJvZ3Jlc3NfbXVzaWMudmFsdWUgKyB0aGlzLmJ0bl9tdXNpYy53aWR0aC8yO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5idG5faG9tZS5vZmZBbGwoKTtcclxuICAgICAgICB0aGlzLmJ0bl90cnlBZ2Fpbi5vZmZBbGwoKTtcclxuICAgICAgICB0aGlzLmJ0bl9zaGFyZS5vZmZBbGwoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZWZlYkJhc2UgZXh0ZW5kcyBMYXlhLlNjcmlwdCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfcHJlZmViIDogTGF5YS5QcmVmYWI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFByZWZlYih2YWx1ZSA6IExheWEuUHJlZmFiKXtcclxuICAgICAgICBQcmVmZWJCYXNlLl9wcmVmZWIgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLm93bmVyLm51bUNoaWxkcmVuOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMub3duZXIuZ2V0Q2hpbGRBdChpKTtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5uYW1lID09IFwiXCIgfHwgZWxlbWVudC5uYW1lLmluZGV4T2YoXCJfXCIpID09IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdGVtcFByb3BlcnR5TGlzdCA9IGVsZW1lbnQubmFtZS5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgIHN3aXRjaCh0ZW1wUHJvcGVydHlMaXN0WzBdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInR4dFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImltZ1wiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImJ0blwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInByb2dyZXNzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tlbGVtZW50Lm5hbWVdID0gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcmVmZWIoKSA6IExheWEuUHJlZmFiXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByZWZlYjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNpZ24oKSA6IHN0cmluZ3tcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9fcHJvdG9fX1wiXS5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoKSA6IExheWEuU2NyaXB0e1xyXG4gICAgICAgIHJldHVybiBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFByZWZlYkJhc2UuZ2V0U2lnbigpLFByZWZlYkJhc2UuX3ByZWZlYi5jcmVhdGUsUHJlZmViQmFzZS5fcHJlZmViKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihQcmVmZWJCYXNlLmdldFNpZ24oKSx0aGlzKTtcclxuICAgIH1cclxufVxyXG4gICAgIiwiaW1wb3J0IFByZWZlYkJhc2UgZnJvbSBcIi4vUHJlZmViQmFzZVwiO1xyXG5pbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIjtcclxuaW1wb3J0IENvbnRyb2xsZXJNZ3IgZnJvbSBcIi4uL2NvbnRyb2xsZXIvQ29udHJvbGxlck1nclwiO1xyXG5pbXBvcnQgVGlwQ29udHJvbGxlciBmcm9tIFwiLi4vY29udHJvbGxlci9UaXBDb250cm9sbGVyXCI7XHJcbmltcG9ydCBXWFRvb2wgZnJvbSBcIi4uL3Rvb2wvV1hUb29sXCI7XHJcbmltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuLi8uLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBQbGF5ZXJDb250cm9sbGVyIGZyb20gXCIuLi9jb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXJ0R2FtZSBleHRlbmRzIFByZWZlYkJhc2Uge1xyXG4gICAgcHVibGljIGhhbmRsZXI6IExheWEuSGFuZGxlcjtcclxuICAgIHB1YmxpYyBvblNob3dSYW5rIDogTGF5YS5IYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBidG5fc3RhcnRHYW1lIDogTGF5YS5CdXR0b247XHJcbiAgICBwcml2YXRlIGJ0bl9zaG93UmFuayA6IExheWEuQnV0dG9uO1xyXG4gICAgcHJpdmF0ZSBidG5fc2hhcmUgOiBMYXlhLkJ1dHRvbjtcclxuXHJcbiAgICBwcml2YXRlIF9yYW5rVmlldyA6IExheWEuV1hPcGVuRGF0YVZpZXdlcjtcclxuICAgIHByaXZhdGUgX3d4U3RhcnRCdXR0b25cclxuICAgIC8vIOabtOWkmuWPguaVsOivtOaYjuivt+iuv+mXrjogaHR0cHM6Ly9sZGMyLmxheWFib3guY29tL2RvYy8/bmF2PXpoLWFzLTItNC0wXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XHJcbiAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZVggPSBMYXlhLk1pbmlBZHB0ZXIud2luZG93LnNjcmVlbi5hdmFpbFdpZHRoIC8gNjQwO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVZID0gTGF5YS5NaW5pQWRwdGVyLndpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQqIChHYW1lQ29uZmlnLmhlaWdodCAvIExheWEuc3RhZ2UuaGVpZ2h0KSAvIDExMzY7XHJcbiAgICAgICAgICAgIC8vIGxldCBzY2FsZVggPSBMYXlhLnN0YWdlLndpZHRoIC8gNjQwO1xyXG4gICAgICAgICAgICAvLyBsZXQgc2NhbGVZID0gTGF5YS5zdGFnZS5oZWlnaHQgLyAxMTM2O1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gd3hbXCJjcmVhdGVVc2VySW5mb0J1dHRvblwiXSh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2U6ICdidG5fc3RhcnRHYW1lLnBuZycsXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgbGVmdDogdGhpcy5idG5fc3RhcnRHYW1lLnggKiBzY2FsZVgsXHJcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMuYnRuX3N0YXJ0R2FtZS55ICogc2NhbGVZLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuYnRuX3N0YXJ0R2FtZS53aWR0aCAqIHNjYWxlWCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5idG5fc3RhcnRHYW1lLmhlaWdodCAqIHNjYWxlWSxcclxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgYnV0dG9uLm9uVGFwKChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoUGxheWVyQ29udHJvbGxlcikubXlQbGF5ZXJJbmZvLm5hbWUgPSByZXMudXNlckluZm8ubmlja05hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLmJ0bl9zdGFydEdhbWUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9zdGFydEdhbWUgPSBidXR0b247XHJcbiAgICAgICAgICAgIFdYVG9vbC5hZGRCdG4odGhpcy5idG5fc3RhcnRHYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX3N0YXJ0R2FtZS56b29tT24oTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICBpZihlLnR5cGUgPT0gTGF5YS5FdmVudC5NT1VTRV9VUClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXIucnVuKCk7XHJcbiAgICAgICAgICAgIH0sbnVsbCxmYWxzZSkpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idG5fc2hvd1Jhbmsuem9vbU9uKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbihlKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIGlmKGUudHlwZSAhPSBMYXlhLkV2ZW50Lk1PVVNFX1VQKXJldHVybjtcclxuICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNob3dSYW5rLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoVGlwQ29udHJvbGxlcikuc2hvd1RpcChcIuWwveaDheacn+W+hVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgICAgICB0aGlzLmJ0bl9zaGFyZS56b29tT24oTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLGZ1bmN0aW9uKGUgOiBMYXlhLkV2ZW50KSA6IHZvaWR7XHJcbiAgICAgICAgICAgIGlmKGUudHlwZSAhPSBMYXlhLkV2ZW50Lk1PVVNFX1VQKXJldHVybjtcclxuICAgICAgICAgICAgaWYoQXBwQ29uZmlnLnBsYXRmb3JtID09IFwid3hcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd3hbXCJzaGFyZUFwcE1lc3NhZ2VcIl0oe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlIDogJ+WPkeeOsOacieS4quaciei2o+eahOa4uOaIjycsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmwgOiBcImh0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL2lhVVZ1eEFyRTlMOUcyOEY2WHJ4S0FJRXRKT3M5eDFZY20yTVltQzJVejVUOU80UkxxMGVqdkczaWMyS2xVQmlhVmYvMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVXJsSWQgOiBcIk5lbGVuSFBMUlhLMS1BV0VObjBhWndcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFRpcENvbnRyb2xsZXIpLnNob3dUaXAoXCLlsL3mg4XmnJ/lvoVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LG51bGwsZmFsc2UpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcInd4XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXWFRvb2wucmVtb3ZlQnRuKHRoaXMuYnRuX3N0YXJ0R2FtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX3N0YXJ0R2FtZS5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5idG5fc3RhcnRHYW1lLm9mZkFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgUHJlZmViQmFzZSBmcm9tIFwiLi9QcmVmZWJCYXNlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaXBJdGVtIGV4dGVuZHMgUHJlZmViQmFzZSB7XHJcbiAgICAvKiogQHByb3Age25hbWU6dGV4dCwgdGlwczpcIuWtl+espuS4suexu+Wei+ekuuS+i1wiLCB0eXBlOlN0cmluZywgZGVmYXVsdDpcImRcIn0qL1xyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZyA9IFwiZFwiO1xyXG5cclxuICAgIHByb3RlY3RlZCB0eHRfdGV4dCA6IExheWEuVGV4dDtcclxuICAgIHByb3RlY3RlZCBpbWdfYmcgOiBMYXlhLkltYWdlO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uQXdha2UoKSA6IHZvaWR7XHJcbiAgICAgICAgc3VwZXIub25Bd2FrZSgpO1xyXG4gICAgICAgIHRoaXMudHh0X3RleHQudGV4dCA9IHRoaXMudGV4dDtcclxuICAgICAgICB0aGlzLmltZ19iZy53aWR0aCA9IHRoaXMudHh0X3RleHQuZGlzcGxheVdpZHRoICsgMzY7XHJcbiAgICAgICAgdGhpcy5vd25lcltcIndpZHRoXCJdID0gdGhpcy5pbWdfYmcud2lkdGg7IFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgU2NlbmVCYXNlIGZyb20gXCIuL1NjZW5lQmFzZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZ1NjZW5lICBleHRlbmRzIFNjZW5lQmFzZSB7XHJcbiAgICBwcml2YXRlIHR4dF9wcm9ncmVzcyA6IExheWEuVGV4dDtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIHN1cGVyLm9uQXdha2UoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw6L+b5bqm5p2h55m+5YiG5q+UXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUg55m+5YiG5q+UIDAtMTAwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVQZXJjZW50KHZhbHVlIDogbnVtYmVyKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy50eHRfcHJvZ3Jlc3MudGV4dCA9IFwi5q2j5Zyo5Yqg6L296LWE5rqQIFwiICsgdmFsdWUgKyBcIiVcIjtcclxuICAgIH1cclxufSIsImltcG9ydCBNYXBGb250SW5mbyBmcm9tIFwiLi4vbW9kZWwvTWFwRm9udEluZm9cIjtcclxuaW1wb3J0IFN0YXJ0R2FtZSBmcm9tIFwiLi4vcHJlZmViL1N0YXJ0R2FtZVwiO1xyXG5pbXBvcnQgU2NlbmVCYXNlIGZyb20gXCIuL1NjZW5lQmFzZVwiO1xyXG5pbXBvcnQgRm9udEdyaWQgZnJvbSBcIi4uL3ByZWZlYi9Gb250R3JpZFwiO1xyXG5pbXBvcnQgUGxheWVySW5mbyBmcm9tIFwiLi4vbW9kZWwvUGxheWVySW5mb1wiO1xyXG5pbXBvcnQgUGxheWVyQ29udHJvbGxlciBmcm9tIFwiLi4vY29udHJvbGxlci9QbGF5ZXJDb250cm9sbGVyXCI7XHJcbmltcG9ydCBHYW1lUmVzdWx0IGZyb20gXCIuLi9wcmVmZWIvR2FtZVJlc3VsdFwiO1xyXG5pbXBvcnQgQXBwQ29uZmlnIGZyb20gXCIuLi8uLi9BcHBDb25maWdcIjtcclxuaW1wb3J0IHsgUmVzTWdyIH0gZnJvbSBcIi4uLy4uL1Jlc01nclwiO1xyXG5pbXBvcnQgVVJJIGZyb20gXCIuLi8uLi9VUklcIjtcclxuaW1wb3J0IFRpcENvbnRyb2xsZXIgZnJvbSBcIi4uL2NvbnRyb2xsZXIvVGlwQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgQ29udHJvbGxlck1nciBmcm9tIFwiLi4vY29udHJvbGxlci9Db250cm9sbGVyTWdyXCI7XHJcbmltcG9ydCBOYXRpdmVCcmlkZ2U0Mzk5IGZyb20gXCIuLi90b29sL05hdGl2ZUJyaWRnZTQzOTlcIjtcclxuaW1wb3J0IFNvdW5kVG9vbCBmcm9tIFwiLi4vdG9vbC9Tb3VuZFRvb2xcIjtcclxuaW1wb3J0IEdhbWVTZXR0aW5nIGZyb20gXCIuLi9wcmVmZWIvR2FtZVNldHRpbmdcIjtcclxuXHJcbmVudW0gR2FtZVN0YXRle1xyXG4gICAgRW5kID0gMCxcclxuICAgIFBhdXNlID0gMSxcclxuICAgIFBsYXlpbmcgPSAyLFxyXG4gICAgaW5pdCA9IDMsXHJcbiAgICBFZmZlY3RQYXVzZSA9IDQgLy/ph4rmlL7nibnmlYjlr7zoh7TnmoTmmoLlgZxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbkdhbWVTY2VuZSBleHRlbmRzIFNjZW5lQmFzZSB7XHJcbiAgICAvKiogQHByb3Age25hbWU6cHJlZmFiX3N0YXJ0R2FtZSx0aXBzOlwi5byA5aeL5ri45oiPcHJlZmFiXCIsdHlwZTpQcmVmYWJ9Ki9cclxuICAgIHByZWZhYl9zdGFydEdhbWU6IExheWEuUHJlZmFiO1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOnByZWZhYl9nYW1lUmVzdWx0LHRpcHM6XCLmuLjmiI/nu5PmnpxwcmVmYWJcIix0eXBlOlByZWZhYn0qL1xyXG4gICAgcHJlZmFiX2dhbWVSZXN1bHQ6IExheWEuUHJlZmFiO1xyXG4gICAgLyoqIEBwcm9wIHtuYW1lOnByZWZhYl9nYW1lU2V0dGluZyx0aXBzOlwi5ri45oiP6K6+572uXCIsdHlwZTpQcmVmYWJ9Ki9cclxuICAgIHByZWZhYl9nYW1lU2V0dGluZzogTGF5YS5QcmVmYWI7XHJcbiAgICAvKiogQHByb3Age25hbWU6cHJlZmFiX2ZvbnRHcmlkLHRpcHM6XCLmoLzlrZBwcmVmYWJcIix0eXBlOlByZWZhYn0qL1xyXG4gICAgcHJlZmFiX2ZvbnRHcmlkOiBMYXlhLlByZWZhYjtcclxuICAgIHByaXZhdGUgX2ZvbnRzID0gW107XHJcbiAgICBwcml2YXRlIGxpc3RfZ3JpZHMgOiBMYXlhLkxpc3Q7XHJcbiAgICBwcml2YXRlIGxpc3Rfc3RhciA6IExheWEuTGlzdDtcclxuICAgIHByaXZhdGUgdHh0X25leHRGb250IDogTGF5YS5UZXh0O1xyXG4gICAgcHJpdmF0ZSB0eHRfcGxheWVyTmFtZSA6IExheWEuVGV4dDtcclxuICAgIHByaXZhdGUgdHh0X3Njb3JlIDogTGF5YS5UZXh0O1xyXG4gICAgcHJpdmF0ZSB0eHRfcG9wdWxhckdyb3VwIDogTGF5YS5UZXh0O1xyXG4gICAgcHJpdmF0ZSBpbWdfcG9wdWxhckdyb3VwQmcgOiBMYXlhLkltYWdlO1xyXG4gICAgcHJpdmF0ZSBtY19kaXNwZWxUZXh0IDogTGF5YS5TcHJpdGVcclxuICAgIHByaXZhdGUgdHh0X2Rpc3BlbFRleHQgOiBMYXlhLlRleHQ7XHJcbiAgICBwcml2YXRlIHR4dF9jdXJyZW50UGluWWluIDogTGF5YS5UZXh0O1xyXG4gICAgcHJpdmF0ZSBidG5fcGF1c2VPclN0YXJ0IDogTGF5YS5CdXR0b247XHJcbiAgICBwcml2YXRlIGJ0bl9zZXR0aW5nIDogTGF5YS5CdXR0b247XHJcbiAgICBwcml2YXRlIGxpc3RfbnVRaSA6IExheWEuTGlzdDtcclxuICAgIHByaXZhdGUgX2dhbWVTdGF0ZSA6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2Ryb3BpbmdGb250SW5mbyA6IE1hcEZvbnRJbmZvO1xyXG4gICAgcHJpdmF0ZSBfbmV4dERyb3BpbmdGb250SW5mbyA6IE1hcEZvbnRJbmZvO1xyXG4gICAgcHJpdmF0ZSBfc3lzRHJvcGluZ0ZvbnRJbmZvcyA6IE1hcEZvbnRJbmZvW10gPSBbXTsgLy/mtojpmaTkuqfnlJ/nmoTmlrDlrZfvvIzoh6rliqjkuIvokL1cclxuICAgIHByaXZhdGUgX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sgOiBNYXBGb250SW5mb1tdID0gW107IC8v5raI6Zmk5Lqn55Sf55qE5paw5a2X77yM5Zyo6Ieq5Yqo5LiL6JC95a6M5q+V5ZCO77yM5a2Y5YKo77yM55So5LqO5omA5pyJ5a2X5LiL6JC95a6M5q+V57uf5LiA5omn6KGM5raI6Zmk5pON5L2cXHJcbiAgICBwcml2YXRlIF9zdGFydFBvaW50ID0gbmV3IExheWEuUG9pbnQoMiwwKTtcclxuICAgIHByaXZhdGUgX3RpY2tUaW1lIDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWF4VGlja1RpbWUgPSAyNjtcclxuICAgIHByaXZhdGUgX3N5c1RpY2tUaW1lID0gMDtcclxuICAgIHByaXZhdGUgX21heFN5c1RpY2tUaW1lID0gODtcclxuICAgIHByaXZhdGUgX3BvcHVsYXJHcm91cCA6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3dvcmRzIDogTWFwRm9udEluZm9bXSA9IFtdOyAvL+W3pui+ueWtl+espuWIl+ihqO+8jOasoui/juWtl+espuWIl+ihqFxyXG4gICAgcHJpdmF0ZSBfc3BsaXRGb250V29yZHMgOiBNYXBGb250SW5mb1tdID0gW107Ly/liIblrZflrZfnrKbliJfooahcclxuICAgIHByaXZhdGUgX3NwbGl0R3JvdXBXb3JkcyA6IE1hcEZvbnRJbmZvW10gPSBbXTsvL+WIhuivjeWtl+espuWIl+ihqFxyXG4gICAgcHJpdmF0ZSBfbWluV29yZHNMZW5ndGggPSA1O1xyXG4gICAgcHJpdmF0ZSBfaXNNb3VzZURvd24gOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9pc1F1aWNrRHJvcCA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX215UGxheWVySW5mbyA6IFBsYXllckluZm87XHJcbiAgICBwcml2YXRlIF9zY29yZSA6IG51bWJlciA9IDA7IC8v5b2T5YmN5bGA5YiG5pWwXHJcbiAgICBwcml2YXRlIF9udVFpIDogbnVtYmVyID0gMDsgLy/mgJLmsJTvvIznlKjmnaXop6blj5HmioDog71cclxuICAgIHByaXZhdGUgX2RlYnVnTW9kZSA9IGZhbHNlOyAvL+iwg+ivlVxyXG4gICAgcHJpdmF0ZSBfZGVidWdGb250cyA9IFtcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLFxyXG4gICAgICAgIG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxcclxuICAgICAgICBudWxsLG51bGwsbnVsbCxudWxsLG51bGwsXHJcbiAgICAgICAgXCLmsLVcIixudWxsLG51bGwsXCLmsLVcIixudWxsLFxyXG4gICAgXVxyXG4gICAgcHJpdmF0ZSBfZGVidWdEcm9wRm9udHMgPSBbXCLljYFcIl07XHJcbiAgICBwcml2YXRlIF9ndWlkZURyb3BGb250cyA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH0gXHJcblxyXG4gICAgb25Bd2FrZSgpIDogdm9pZHtcclxuICAgICAgICBzdXBlci5vbkF3YWtlKCk7XHJcbiAgICAgICAgc3dpdGNoKEFwcENvbmZpZy5wbGF0Zm9ybSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ3eFwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9wbGF5ZXJOYW1lLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdF9zdGFyLnkgPSA4NDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X3Njb3JlLnkgPSAxNDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIUFwcENvbmZpZy5oYWRHdWlkYW5jZSgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ3VpZGVEcm9wRm9udHMgPSBbXCLmnKhcIixcIuacqFwiLFwi5aSVXCIsXCLmg7NcIixcIuWPiFwiLFwi5qygXCIsXCLkuZBcIixcIuacqFwiLFwi55uuXCIsXCLlv4NcIixcIuWMllwiLFwi5Y2BXCJdO1xyXG4gICAgICAgICAgICBBcHBDb25maWcuc2V0R3VpZGFuY2UodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGlzdF9ncmlkcy5yZW5kZXJIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25HcmlkUmVuZGVyLG51bGwsZmFsc2UpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubGlzdF9zdGFyLnJlbmRlckhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vblN0YXJSZW5kZXIsbnVsbCxmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdF9udVFpLnJlbmRlckhhbmRsZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbk51UWlSZW5kZXIsbnVsbCxmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX215UGxheWVySW5mbyA9IENvbnRyb2xsZXJNZ3IuZ2V0SW5zdGFuY2UoUGxheWVyQ29udHJvbGxlcikubXlQbGF5ZXJJbmZvO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYnRuX3BhdXNlT3JTdGFydFtcInpvb21PblwiXShMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vblBhdXNlT3JTdGFydE1vdXNlRXZlbnQsW10sZmFsc2UpKTtcclxuICAgICAgICB0aGlzLmJ0bl9zZXR0aW5nW1wiem9vbU9uXCJdKExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uU2V0dGluZ01vdXNlRXZlbnQsW10sZmFsc2UpKTtcclxuICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLmluaXQpO1xyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbGV0IHNrID0gUmVzTWdyLkluc3RhbmNlKCkuY3JlYXRlU3BpbmUoVVJJLnNwaW5lVXJsICsgXCJ6Zl93YW5xaWFuc2hpamllLnNrXCIsXCJoaXRcIix0cnVlLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAvLyAgICAgLy8gdGhpcy5faGVDaGVuZ0VmZmVjdC5kZXN0cm95KCk7XHJcbiAgICAgICAgLy8gICAgIC8vIHRoaXMuX2hlQ2hlbmdFZmZlY3QgPSBudWxsO1xyXG4gICAgICAgIC8vIH0pKTtcclxuICAgICAgICAvLyBzay54ID0gc2sueSA9IDQ0O1xyXG4gICAgICAgIC8vIHRoaXMub3duZXIuYWRkQ2hpbGQoc2spO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TZXR0aW5nTW91c2VFdmVudChlIDogTGF5YS5FdmVudCkgOiB2b2lke1xyXG4gICAgICAgIGlmKGUudHlwZSA9PSBMYXlhLkV2ZW50Lk1PVVNFX1VQKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5QYXVzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0dhbWVTZXR0aW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblBhdXNlT3JTdGFydE1vdXNlRXZlbnQoZSA6IExheWEuRXZlbnQpIDogdm9pZHtcclxuICAgICAgICBpZihlLnR5cGUgPT0gTGF5YS5FdmVudC5NT1VTRV9VUClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuUGF1c2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuUGxheWluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/miZPljbDlvZPliY3miYDmnInmoLzlrZDkv6Hmga9cclxuICAgICAgICAgICAgICAgIGxldCBzdHIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gMDsgaiA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZO2orKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW2pdID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBcIm51bGwsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gXCInXCIgKyB0aGlzLl9mb250c1tpXVtqXS50ZXh0ICsgXCInLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlR2FtZVN0YXR1ZShHYW1lU3RhdGUuUGF1c2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd1N0YXJ0R2FtZSgpIDogdm9pZHtcclxuICAgICAgICBsZXQgc3RhcnRHYW1lU3ByID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcIlN0YXJ0R2FtZVwiLHRoaXMucHJlZmFiX3N0YXJ0R2FtZS5jcmVhdGUsdGhpcy5wcmVmYWJfc3RhcnRHYW1lKTtcclxuICAgICAgICBsZXQgc3RhcnRHYW1lU2NyaXB0ID0gc3RhcnRHYW1lU3ByLmdldENvbXBvbmVudChTdGFydEdhbWUpIGFzIFN0YXJ0R2FtZVxyXG4gICAgICAgIHN0YXJ0R2FtZVNjcmlwdC5oYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuY2hhbmdlR2FtZVN0YXR1ZSxbR2FtZVN0YXRlLlBsYXlpbmddLGZhbHNlKTtcclxuICAgICAgICBzdGFydEdhbWVTY3JpcHQub25TaG93UmFuayA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLnNob3dSYW5rLG51bGwsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYWRkUG9wVXAoXCJTdGFydEdhbWVcIixzdGFydEdhbWVTcHIsZmFsc2UsZmFsc2UsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd0dhbWVSZXN1bHQoKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGdhbWVSZXN1bHRTcHIgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiR2FtZVJlc3VsdFwiLHRoaXMucHJlZmFiX2dhbWVSZXN1bHQuY3JlYXRlLHRoaXMucHJlZmFiX2dhbWVSZXN1bHQpIGFzIExheWEuU3ByaXRlO1xyXG4gICAgICAgIGxldCBnYW1lUmVzdWx0U2NyaXB0ID0gZ2FtZVJlc3VsdFNwci5nZXRDb21wb25lbnQoR2FtZVJlc3VsdCkgYXMgR2FtZVJlc3VsdDtcclxuICAgICAgICBsZXQgc3RvcmFnZU9iaiA9IHtcclxuICAgICAgICAgICAgXCJ3eGdhbWVcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcInNjb3JlXCI6dGhpcy5fc2NvcmUsXHJcbiAgICAgICAgICAgICAgICAgIFwidXBkYXRlX3RpbWVcIjogRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInNjb3JlXCI6dGhpcy5fc2NvcmVcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGF0YVZpZXdlci5wb3N0TXNnKHtcclxuICAgICAgICAgICAgY21kIDogXCJ3eC5zZXRVc2VyQ2xvdWRTdG9yYWdlXCIsXHJcbiAgICAgICAgICAgIGRhdGEgOiBzdG9yYWdlT2JqXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZ2FtZVJlc3VsdFNjcmlwdC5zY29yZSA9IHRoaXMuX3Njb3JlO1xyXG4gICAgICAgIGdhbWVSZXN1bHRTY3JpcHQuc2hvd0hvbWVIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuY2hhbmdlR2FtZVN0YXR1ZSxbR2FtZVN0YXRlLmluaXRdLGZhbHNlKTtcclxuICAgICAgICBnYW1lUmVzdWx0U2NyaXB0LnJlc3RhcnRIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMucmVzdGFydCxudWxsLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFkZFBvcFVwKFwiR2FtZVJlc3VsdFwiLGdhbWVSZXN1bHRTcHIsZmFsc2UsZmFsc2UsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd0dhbWVTZXR0aW5nKCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBnYW1lU2V0dGluZ1NwciA9IExheWEuUG9vbC5nZXRJdGVtQnlDcmVhdGVGdW4oXCJHYW1lU2V0dGluZ1wiLHRoaXMucHJlZmFiX2dhbWVTZXR0aW5nLmNyZWF0ZSx0aGlzLnByZWZhYl9nYW1lU2V0dGluZykgYXMgTGF5YS5TcHJpdGU7XHJcbiAgICAgICAgbGV0IGdhbWVTZXR0aW5nU2NyaXB0ID0gZ2FtZVNldHRpbmdTcHIuZ2V0Q29tcG9uZW50KEdhbWVTZXR0aW5nKSBhcyBHYW1lU2V0dGluZztcclxuICAgICAgICBnYW1lU2V0dGluZ1NjcmlwdC5vbkNsb3NlSGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLmNoYW5nZUdhbWVTdGF0dWUsW0dhbWVTdGF0ZS5QbGF5aW5nXSxmYWxzZSk7XHJcbiAgICAgICAgZ2FtZVNldHRpbmdTY3JpcHQuc2hvd0hvbWVIYW5kbGVyID0gTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMuY2hhbmdlR2FtZVN0YXR1ZSxbR2FtZVN0YXRlLmluaXRdLGZhbHNlKTtcclxuICAgICAgICBnYW1lU2V0dGluZ1NjcmlwdC5yZXN0YXJ0SGFuZGxlciA9IExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLnJlc3RhcnQsbnVsbCxmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5hZGRQb3BVcChcImdhbWVTZXR0aW5nXCIsZ2FtZVNldHRpbmdTcHIsdHJ1ZSx0cnVlLGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc3RhcnQoKSA6IHZvaWR7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJTdG9yYWdlVmVyc2lvblwiLG51bGwpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiQ2FjaGVEYXRhXCIsbnVsbCk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gR2FtZVN0YXRlLkVuZDtcclxuICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLlBsYXlpbmcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGdhbWVTdGF0ZSDlj5jmm7TnirbmgIFcclxuICAgICAqIEBwYXJhbSBuZXh0U3RhdGUg5LiL5LiA5Liq54q25oCBXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2hhbmdlR2FtZVN0YXR1ZShnYW1lU3RhdGUgOiBudW1iZXIsIG5leHRTdGF0ZSA6IG51bWJlciA9IC0xKSA6IHZvaWR7XHJcbiAgICAgICAgc3dpdGNoKGdhbWVTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkVuZDpcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiQ2FjaGVEYXRhXCIsbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dHYW1lUmVzdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuUGxheWluZzpcclxuICAgICAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcImFuZHJvaWQ0Mzk5XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgTmF0aXZlQnJpZGdlNDM5OS5zaG93QmFubmVyQWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9wYXVzZU9yU3RhcnQuc2tpbiA9IFwibWFwL2J0bl9wYXVzZS5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVBvcFVwKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlICE9IEdhbWVTdGF0ZS5QYXVzZSAmJiB0aGlzLl9nYW1lU3RhdGUgIT0gR2FtZVN0YXRlLkVmZmVjdFBhdXNlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib29sO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbCA9IHRoaXMucmVzdG9yZUFsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJDYWNoZURhdGFcIixudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZighYm9vbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njb3JlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fbnVRaSA9IHRoaXMuX2RlYnVnTW9kZSA/IDEyIDogMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbnVRaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwIDsgIGogPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSA7IGorKylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZGVidWdNb2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR4dCA9IHRoaXMuX2RlYnVnRm9udHNbaSArIGogKiA1XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodHh0ID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW2ldW2pdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogdHh0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8ueCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8ueSA9IGo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1tpXVtqXSA9IHRlbXBGb250SW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbaV1bal0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl93b3JkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb3B1bGFyR3JvdXAgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlQ2lTcGxpdFRpbWVzID0gMDsgLy/lkIjmiJDlvZPliY3lt6bovrnor43nu4TlpLHotKXmrKHmlbBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZUNpenVSYXRlID0gMTA7IC8v5Ye6546w5bem6L656YKj5Liq6K+N57uE55qE5qaC546HXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuWmlSYXRlID0gMTAgOyAvLyDlh7rnjrDog73ot5/kupTliJfmnIDlpJbovrnmsYnlrZflkIjmiJDmsYnlrZfnmoTmpoLnjodcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaVp1UmF0ZSA9IDEwOyAvLyDlh7rnjrDog73ot5/kupTliJfmnIDlpJbovrnmsYnlrZflkIjmiJDor43nu4TnmoTmpoLnjodcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuUGF1c2U6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9wYXVzZU9yU3RhcnQuc2tpbiA9IFwibWFwL2J0bl9zdGFydC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLkVmZmVjdFBhdXNlOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLmluaXQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTdGFydEdhbWUoKTtcclxuICAgICAgICAgICAgICAgIGlmKEFwcENvbmZpZy5wbGF0Zm9ybSA9PSBcImFuZHJvaWQ0Mzk5XCIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgTmF0aXZlQnJpZGdlNDM5OS5zaG93QmFubmVyQWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2dhbWVTdGF0ZSA9IGdhbWVTdGF0ZTtcclxuICAgICAgICBpZihuZXh0U3RhdGUgIT0gLTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUobmV4dFN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbk51UWlSZW5kZXIoY2VsbCA6IExheWEuQm94LCBpbmRleCA6IG51bWJlcikgOiB2b2lke1xyXG4gICAgICAgIGxldCBkYXRhID0gY2VsbC5kYXRhU291cmNlO1xyXG4gICAgICAgIGNlbGwuZ2V0Q2hpbGRCeU5hbWUoXCJpbWdfc3RhclwiKVtcInZpc2libGVcIl0gPSBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25HcmlkUmVuZGVyKGNlbGwgOiBMYXlhLkJveCxpbmRleCA6IG51bWJlcikgOiB2b2lke1xyXG4gICAgICAgIGxldCBkYXRhID0gIGNlbGwuZGF0YVNvdXJjZSBhcyBNYXBGb250SW5mbztcclxuICAgICAgICBsZXQgZm9udEdyaWRTY3JpcCA9IGNlbGwuZ2V0Q29tcG9uZW50KEZvbnRHcmlkKSBhcyBGb250R3JpZDtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb250R3JpZFNjcmlwLmZvbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBmb250R3JpZFNjcmlwLmNsZWFyRWZmZWN0cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9udEdyaWRTY3JpcC5mb250ID0gZGF0YS50ZXh0O1xyXG4gICAgICAgICAgICBmb250R3JpZFNjcmlwLmFkZEVmZmVjdChkYXRhLmdldFN0dW50Rm9udEVmZmVjdCgpKTtcclxuICAgICAgICAgICAgZm9udEdyaWRTY3JpcC5xdWFsaXR5ID0gZGF0YS5xdWFsaXR5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU3RhclJlbmRlcihjZWxsIDogTGF5YS5JbWFnZSwgaW5kZXggOiBudW1iZXIpIDogdm9pZHtcclxuICAgICAgICBsZXQgaXNTaGluZSA9IGNlbGwuZGF0YVNvdXJjZTsgLy8g5piv5ZCm54K55LquXHJcbiAgICAgICAgaWYoaXNTaGluZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNlbGwuc2tpbiA9IFwibWFwL2ltZ19zdGFyLnBuZ1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2VsbC5za2luID0gXCJtYXAvaW1nX3N0YXJCZy5wbmdcIjsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21vdXNlRG93blBvaW50IDogTGF5YS5Qb2ludDtcclxuICAgIG9uTW91c2VEb3duKCkgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuUGxheWluZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdXNlRG93blBvaW50ID0gbmV3IExheWEuUG9pbnQoTGF5YS5zdGFnZS5tb3VzZVgsTGF5YS5zdGFnZS5tb3VzZVkpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1F1aWNrRHJvcCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5QbGF5aW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fbW91c2VEb3duUG9pbnQgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBhYnNYID0gTWF0aC5hYnMoTGF5YS5zdGFnZS5tb3VzZVggLSB0aGlzLl9tb3VzZURvd25Qb2ludC54KTtcclxuICAgICAgICAgICAgbGV0IGFic1kgPSBMYXlhLnN0YWdlLm1vdXNlWSAtIHRoaXMuX21vdXNlRG93blBvaW50Lnk7XHJcbiAgICAgICAgICAgIGlmKGFic1ggPiAxMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoYWJzWSA+IGFic1ggKiAyLjUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/nq5bnnYDnp7vliqhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1F1aWNrRHJvcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgU291bmRUb29sLnBsYXlYaWFIdWFFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRHJvcGluZ0ZvbnQoTGF5YS5zdGFnZS5tb3VzZVggPCB0aGlzLl9tb3VzZURvd25Qb2ludC54KVxyXG4gICAgICAgICAgICAgICAgICAgIFNvdW5kVG9vbC5wbGF5WWlEb25nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihhYnNZID4gMjUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzUXVpY2tEcm9wID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFNvdW5kVG9vbC5wbGF5WGlhSHVhRWZmZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbW91c2VEb3duUG9pbnQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuUGxheWluZylcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5QYXVzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5QbGF5aW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/liKTmlq3lvZPliY3lrZfnrKbmmK/lkKbkuI3otrNcclxuICAgICAgICAgICAgbGV0IGlzRWRpdExpc3QgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9wdWxhckdyb3VwKCk7XHJcbiAgICAgICAgICAgIC8v5raI6Zmk5Lqn55Sf55qE5ryC5rWu5a2X56e75Yqo5Y+K5raI6ZmkXHJcbiAgICAgICAgICAgIGlmKHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MubGVuZ3RoID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc3lzVGlja1RpbWUgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c1RpY2tUaW1lIC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNUaWNrVGltZSA9IHRoaXMuX21heFN5c1RpY2tUaW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzeXNEZWxBcnIgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmxlbmd0aCA9PSB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuaW52b2tlU3R1bnRGb250KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsQ2ladSh0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2suZm9yRWFjaChlbGVtZW50PT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55KSAhPSBlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1N5c0Ryb3BGb250cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjayA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0VkaXRMaXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5mb3JFYWNoKGVsZW1lbnQ9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2suaW5kZXhPZihlbGVtZW50KSAhPSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tlbGVtZW50LnhdW2VsZW1lbnQueSArIDFdID09IG51bGwgJiYgZWxlbWVudC55ICsgMSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57un57ut5LiL6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKGVsZW1lbnQueCwgZWxlbWVudC55ICsgMSxlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ml6Dms5XkuIvokL3vvIzmiafooYzmtojpmaTliqjkvZxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFZGl0TGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v5pa55Z2X54q25oCB5qOA5rWLXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl90aWNrVGltZSA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5faXNRdWlja0Ryb3AgJiYgdGhpcy5fdGlja1RpbWUgPiAxKXRoaXMuX3RpY2tUaW1lID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90aWNrVGltZSAtLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90aWNrVGltZSA9ICgxMDAgLSB0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnNwZWVkX3JhdGUpICogdGhpcy5fbWF4VGlja1RpbWUgLyAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy/liKTmlq3mmK/lkKbmnInmjonokL3kuK3nmoTlrZfvvIzmsqHmnInnmoTor53vvIznlJ/miJDlrZdcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzUXVpY2tEcm9wID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW3RoaXMuX3N0YXJ0UG9pbnQueF1bdGhpcy5fc3RhcnRQb2ludC55XSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+e7k+adn1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5FbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbU5leHRGb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe2lkIDogdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250ID0gdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5q2j5Zyo5o6J6JC955qE5rGJ5a2Q77yaXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkZVRvR3JpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREaXNwZWxUZXh0KHRoaXMuX2Ryb3BpbmdGb250SW5mby50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9tTmV4dEZvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTmV4dERyb3BpbmdGb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8ueCA9IHRoaXMuX3N0YXJ0UG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mby55ID0gdGhpcy5fc3RhcnRQb2ludC55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnhdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55XSA9IHRoaXMuX2Ryb3BpbmdGb250SW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRWRpdExpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZUFsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9pc1F1aWNrRHJvcCl0aGlzLl90aWNrVGltZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueF1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKyAxXSA9PSBudWxsICYmIHRoaXMuX2Ryb3BpbmdGb250SW5mby55ICsgMSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57un57ut5LiL6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKHRoaXMuX2Ryb3BpbmdGb250SW5mby54LCB0aGlzLl9kcm9waW5nRm9udEluZm8ueSArIDEsdGhpcy5fZHJvcGluZ0ZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ml6Dms5XkuIvokL3vvIzmiafooYzmtojpmaTliqjkvZxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZURvd25Qb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95R3VpZGVJbWdzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlzRGlzcGVsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291dCA9IHRoaXMuZGlzcGVsQ2ladShbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY291dCA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNwZWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3V0ID0gdGhpcy5kaXNwZWwodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLngsdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvdXQgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzcGVsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaXNEaXNwZWwgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLnNldERpc3BlbFRleHQodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcm9waW5nRm9udEluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFZGl0TGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoaXNFZGl0TGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5omA5pyJ6Z2e56m66aG25a2X56ymXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0QWxsRm9udHMoKSA6IE1hcEZvbnRJbmZvW117XHJcbiAgICAgICAgbGV0IGNvdXQgPSBbXVxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9mb250cy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IHRoaXMuX2ZvbnRzWzBdLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtqXSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdXQucHVzaCh0aGlzLl9mb250c1tpXVtqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FjaGVQcm9wZXJ0aWVzID0gW1wiaGVDaVNwbGl0VGltZXNcIixcImhlQ2l6dVJhdGVcIixcImNpWnVSYXRlXCIsXCJfc2NvcmVcIixcIl9udVFpXCIsXCJfcG9wdWxhckdyb3VwXCIsXCJfZ3VpZGVSYXRlXCIsXCJidVNob3VSYXRlXCJdO1xyXG4gICAgcHJpdmF0ZSBjYWNoZUFsbCgpIDogdm9pZHtcclxuICAgICAgICBsZXQgb2JqIDogYW55ID0ge307XHJcbiAgICAgICAgdGhpcy5fY2FjaGVQcm9wZXJ0aWVzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIG9ialtlbGVtZW50XSA9IHRoaXNbZWxlbWVudF07XHJcbiAgICAgICAgfSlcclxuICAgICAgICBvYmouX3dvcmRUZXh0cyA9IFtdOyBcclxuICAgICAgICB0aGlzLl93b3Jkcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBvYmouX3dvcmRUZXh0cy5wdXNoKHt0ZXh0IDogZWxlbWVudC50ZXh0LCBpc1N0dW50Rm9udCA6IGVsZW1lbnQuaXNTdHVudEZvbnR9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmouX3NwbGl0Rm9udFdvcmRUZXh0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIG9iai5fc3BsaXRGb250V29yZFRleHRzLnB1c2goe3RleHQgOiBlbGVtZW50LnRleHQsIGlzU3R1bnRGb250IDogZWxlbWVudC5pc1N0dW50Rm9udH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iai5fc3BsaXRHcm91cFdvcmRUZXh0cyA9W107XHJcbiAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIG9iai5fc3BsaXRHcm91cFdvcmRUZXh0cy5wdXNoKHt0ZXh0IDogZWxlbWVudC50ZXh0LCBpc1N0dW50Rm9udCA6IGVsZW1lbnQuaXNTdHVudEZvbnR9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgb2JqLl9kcm9waW5nRm9udEluZm9UZXh0ID0ge3RleHQgOiB0aGlzLl9kcm9waW5nRm9udEluZm8udGV4dCwgaXNTdHVudEZvbnQgOiB0aGlzLl9kcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnR9O1xyXG4gICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICBvYmouX25leHREcm9waW5nRm9udEluZm9UZXh0ID0ge3RleHQgOiB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLnRleHQsIGlzU3R1bnRGb250IDogdGhpcy5fbmV4dERyb3BpbmdGb250SW5mby5pc1N0dW50Rm9udH07XHJcbiAgICAgICAgb2JqLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrUG9zZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIG9iai5fc3lzRGlzcGVsRm9udEluZm9TdGFja1Bvc2VzLnB1c2gobmV3IExheWEuUG9pbnQoZWxlbWVudC54LCBlbGVtZW50LnkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmouX3N5c0Ryb3BpbmdGb250SW5mb3NQb3NlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgb2JqLl9zeXNEcm9waW5nRm9udEluZm9zUG9zZXMucHVzaChuZXcgTGF5YS5Qb2ludChlbGVtZW50LngsIGVsZW1lbnQueSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9iai5fZm9udFRleHRzID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMuX2ZvbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgb2JqLl9mb250VGV4dHNbaV0gPSBbXVxyXG4gICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwIDsgIGogPCB0aGlzLl9mb250c1tpXS5sZW5ndGggOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2ZvbnRzW2ldW2pdID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9mb250VGV4dHNbaV1bal0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouX2ZvbnRUZXh0c1tpXVtqXSA9IHt0ZXh0IDogdGhpcy5fZm9udHNbaV1bal0udGV4dCwgaXNTdHVudEZvbnQgOiB0aGlzLl9mb250c1tpXVtqXS5pc1N0dW50Rm9udH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJTdG9yYWdlVmVyc2lvblwiLEFwcENvbmZpZy52ZXJzaW9uKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIkNhY2hlRGF0YVwiLEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzdG9yZUFsbCgpIDogYm9vbGVhbntcclxuICAgICAgICBpZih0aGlzLl9kZWJ1Z01vZGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzdG9yYWdlVmVyc2lvbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiU3RvcmFnZVZlcnNpb25cIik7XHJcbiAgICAgICAgaWYoc3RvcmFnZVZlcnNpb24gPT0gQXBwQ29uZmlnLnZlcnNpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZGF0YVN0ciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiQ2FjaGVEYXRhXCIpO1xyXG4gICAgICAgICAgICBpZihkYXRhU3RyID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3RvcmVPYmogPSBKU09OLnBhcnNlKGRhdGFTdHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA6IE1hcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udHMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZvbnRzW2ldID0gW11cclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwIDsgIGogPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSA7IGorKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3RvcmVPYmouX2ZvbnRUZXh0c1tpXSA9PSBudWxsIHx8IHJlc3RvcmVPYmouX2ZvbnRUZXh0c1tpXVtqXSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb250c1tpXVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5fZm9udHNbaV1bal0gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiByZXN0b3JlT2JqLl9mb250VGV4dHNbaV1bal0udGV4dH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLmlzU3R1bnRGb250ID0gcmVzdG9yZU9iai5fZm9udFRleHRzW2ldW2pdLmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLnggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLnkgPSBqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVQcm9wZXJ0aWVzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tlbGVtZW50XSA9IHJlc3RvcmVPYmpbZWxlbWVudF07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fd29yZHMgPSBbXVxyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU9iai5fd29yZFRleHRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogZWxlbWVudC50ZXh0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvLnRleHQgPT0gbnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLmlzU3R1bnRGb250ID0gZWxlbWVudC5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93b3Jkcy5wdXNoKHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzID0gW107XHJcbiAgICAgICAgICAgICAgICByZXN0b3JlT2JqLl9zcGxpdEZvbnRXb3JkVGV4dHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiBlbGVtZW50LnRleHR9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8udGV4dCA9PSBudWxsKXJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8uaXNTdHVudEZvbnQgPSBlbGVtZW50LmlzU3R1bnRGb250O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzLnB1c2godGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzID0gW107XHJcbiAgICAgICAgICAgICAgICByZXN0b3JlT2JqLl9zcGxpdEdyb3VwV29yZFRleHRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogZWxlbWVudC50ZXh0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvLnRleHQgPT0gbnVsbClyZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvLmlzU3R1bnRGb250ID0gZWxlbWVudC5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMucHVzaCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZihyZXN0b3JlT2JqLl9kcm9waW5nRm9udEluZm9UZXh0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogcmVzdG9yZU9iai5fZHJvcGluZ0ZvbnRJbmZvVGV4dC50ZXh0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLmlzU3R1bnRGb250ID0gcmVzdG9yZU9iai5fZHJvcGluZ0ZvbnRJbmZvVGV4dC5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERpc3BlbFRleHQodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mby54ID0gdGhpcy5fc3RhcnRQb2ludC54O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Ryb3BpbmdGb250SW5mby55ID0gdGhpcy5fc3RhcnRQb2ludC55O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbU5leHRGb250KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvID0gdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHJlc3RvcmVPYmouX25leHREcm9waW5nRm9udEluZm9UZXh0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHJlc3RvcmVPYmouX25leHREcm9waW5nRm9udEluZm9UZXh0LnRleHR9KTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPT0gbnVsbCB8fCB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLnRleHQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbU5leHRGb250KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnQgPSByZXN0b3JlT2JqLl9uZXh0RHJvcGluZ0ZvbnRJbmZvVGV4dC5pc1N0dW50Rm9udDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgICAgIHJlc3RvcmVPYmouX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2tQb3Nlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEaXNwZWxGb250SW5mb1N0YWNrLnB1c2godGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHJlc3RvcmVPYmouX3N5c0Ryb3BpbmdGb250SW5mb3NQb3Nlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLnB1c2godGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpY2tUaW1lID0gKDEwMCAtIHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3BlZWRfcmF0ZSkgKiB0aGlzLl9tYXhUaWNrVGltZSAvIDEwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIkNhY2hlRGF0YVwiLG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1vdmVEcm9waW5nRm9udChsZWZ0IDogYm9vbGVhbikgOiB2b2lke1xyXG4gICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWluVGlja1RpbWUgPSAwLjMgKiAoMTAwIC0gdGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zcGVlZF9yYXRlKSAqIHRoaXMuX21heFRpY2tUaW1lIC8gMTAwXHJcbiAgICAgICAgaWYobGVmdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2Ryb3BpbmdGb250SW5mby54ID4gMCAmJiB0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueCAtIDFdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55XSAgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKHRoaXMuX2Ryb3BpbmdGb250SW5mby54IC0gMSwgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGlja1RpbWUgPSB0aGlzLl90aWNrVGltZSA+IG1pblRpY2tUaW1lID8gdGhpcy5fdGlja1RpbWUgOiBtaW5UaWNrVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCAtIDEgJiYgdGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggKyAxXVt0aGlzLl9kcm9waW5nRm9udEluZm8ueV0gID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyh0aGlzLl9kcm9waW5nRm9udEluZm8ueCArIDEsIHRoaXMuX2Ryb3BpbmdGb250SW5mby55KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RpY2tUaW1lID0gdGhpcy5fdGlja1RpbWUgPiBtaW5UaWNrVGltZSA/IHRoaXMuX3RpY2tUaW1lIDogbWluVGlja1RpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbGV0IHRhcmdldE1jID0gdGhpcy5saXN0X2dyaWRzLmdldENlbGwodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKiB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCArIHRoaXMuX2Ryb3BpbmdGb250SW5mby54KTtcclxuICAgICAgICAvLyBsZXQgaXRlbVdpZHRoID0gdGFyZ2V0TWMud2lkdGg7XHJcbiAgICAgICAgLy8gbGV0IHBvaW50ID0gbmV3IExheWEuUG9pbnQodGFyZ2V0TWMueCArIHRhcmdldE1jLndpZHRoIC8gMiwgdGFyZ2V0TWMueSArIHRhcmdldE1jLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIC8vIHBvaW50ID0gKHRhcmdldE1jLnBhcmVudCBhcyBMYXlhLlNwcml0ZSkubG9jYWxUb0dsb2JhbChwb2ludCk7XHJcbiAgICAgICAgLy8gLy/liKTmlq3kuIvnp7vliLDlupVcclxuICAgICAgICAvLyBpZihNYXRoLmFicyhwb2ludC54IC0gTGF5YS5zdGFnZS5tb3VzZVgpIDwgaXRlbVdpZHRoIC8gMilcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIGlmKExheWEuc3RhZ2UubW91c2VZIC0gcG9pbnQueSA+IGl0ZW1XaWR0aCAvIDIpXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIC8v56e75Yqo5Yiw5bqVXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLl9pc1F1aWNrRHJvcCA9IHRydWU7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyB3aGlsZSh0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueF1bdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKyAxXSA9PSBudWxsICYmIHRoaXMuX2Ryb3BpbmdGb250SW5mby55ICsgMSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZKVxyXG4gICAgICAgIC8vICAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICAgICAgLy8gICAgIHRoaXMuY2hhbmdlRHJvcEZvbnRUbyh0aGlzLl9kcm9waW5nRm9udEluZm8ueCwgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkgKyAxKVxyXG4gICAgICAgIC8vICAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2UgXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICBpZihMYXlhLnN0YWdlLm1vdXNlWCA8IHBvaW50LngpXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIC8v5ZCR5bem56e75YqoXHJcbiAgICAgICAgLy8gICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8ueCA+IDAgJiYgdGhpcy5fZm9udHNbdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggLSAxXVt0aGlzLl9kcm9waW5nRm9udEluZm8ueV0gID09IG51bGwpXHJcbiAgICAgICAgLy8gICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5jaGFuZ2VEcm9wRm9udFRvKHRoaXMuX2Ryb3BpbmdGb250SW5mby54IC0gMSwgdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnkpO1xyXG4gICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIGVsc2UgXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgIC8v5ZCR5Y+z5LiA5a6aXHJcbiAgICAgICAgLy8gICAgICAgICBpZih0aGlzLl9kcm9waW5nRm9udEluZm8ueCA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYIC0gMSAmJiB0aGlzLl9mb250c1t0aGlzLl9kcm9waW5nRm9udEluZm8ueCArIDFdW3RoaXMuX2Ryb3BpbmdGb250SW5mby55XSAgPT0gbnVsbClcclxuICAgICAgICAvLyAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmNoYW5nZURyb3BGb250VG8odGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnggKyAxLCB0aGlzLl9kcm9waW5nRm9udEluZm8ueSk7XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaWYoaXNSZWZyZXNoTGlzdClcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/mo4Dmn6XmtojpmaTkuqfnlJ/nmoTmvILmta7lrZfliqDlhaXliJfooahcclxuICAgIHByaXZhdGUgY2hlY2tTeXNEcm9wRm9udHMoKSA6IHZvaWR7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgaXNBZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yKGxldCBqIDogbnVtYmVyID0gdGhpcy5saXN0X2dyaWRzLnJlcGVhdFkgLSAxIDsgIGogPj0wICA7IGotLSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bal0gIT0gbnVsbCAmJiAoaXNBZGQgfHwgKGorMSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZICYmIHRoaXMuX2ZvbnRzW2ldW2orMV0gPT0gbnVsbCkpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmluZGV4T2YodGhpcy5fZm9udHNbaV1bal0pID09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLnB1c2godGhpcy5fZm9udHNbaV1bal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v56e75Yqo5q2j5Zyo5pON5L2c55qE5a2XXHJcbiAgICBwcml2YXRlIGNoYW5nZURyb3BGb250VG8oeCA6IG51bWJlciAsIHkgOiBudW1iZXIsZm9udEluZm8gOiBNYXBGb250SW5mbyA9IG51bGwpIDogdm9pZHtcclxuICAgICAgICBpZih5IDwgMCB8fCB4IDwgMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoeCA+PSB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WCB8fCB5ID49IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihmb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9udEluZm8gPSB0aGlzLl9kcm9waW5nRm9udEluZm87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnRzW2ZvbnRJbmZvLnhdW2ZvbnRJbmZvLnldID0gbnVsbDtcclxuICAgICAgICBmb250SW5mby54ID0geDtcclxuICAgICAgICBmb250SW5mby55ID0geTtcclxuICAgICAgICB0aGlzLl9mb250c1tmb250SW5mby54XVtmb250SW5mby55XSA9IGZvbnRJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5pu05paw5paH5a2X5YiX6KGoXHJcbiAgICBwcml2YXRlIHJlbmRlckdyaWRMaXN0KCkgOiB2b2lke1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGogOiBudW1iZXIgPSAwOyBqIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFk7IGorKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDAgOyAgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYIDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh0aGlzLl9mb250c1tpXVtqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0X2dyaWRzLmRhdGFTb3VyY2UgPSBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc3R1bnRGb250c0NoZWNrQXJyMSA6IGFueVtdID0gW107IC8v5ZCI5oiQ5raI6Zmk56Gu6K6k6Zif5YiXXHJcbiAgICBwcml2YXRlIF9zdHVudEZvbnRzQ2hlY2tBcnIyIDogYW55W10gPSBbXTsgLy/nu4Tor43mtojpmaTnoa7orqTpmJ/liJdcclxuICAgIC8qKlxyXG4gICAgICog5raI6Zmk5rGJ5a2QXHJcbiAgICAgKiBAcGFyYW0geCB45Z2Q5qCH5oiW6ICFbWFwZm9udGluZm9cclxuICAgICAqIEBwYXJhbSB5IHnlnZDmoIdcclxuICAgICAqIEBwYXJhbSBzdHVudENoZWNrIOaYr+WQpuaJp+ihjOaKgOiDvSDpu5jorqR0cnVlXHJcbiAgICAgKiBAcGFyYW0gaXNIZUNoZW5nSGFuWmkgIOaYr+WQpuaYr+WQiOaIkOaxieWtkOaXtuWAmeeahOa2iOmZpCDpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZGlzcGVsRm9udCh4IDogbnVtYmVyIHwgTWFwRm9udEluZm8sIHkgOiBudW1iZXIgPSAwKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGRpc3BlbEZvbnRJbmZvIDogTWFwRm9udEluZm87XHJcbiAgICAgICAgbGV0IGluZFggOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGluZFkgOiBudW1iZXI7XHJcbiAgICAgICAgaWYoeCBpbnN0YW5jZW9mIE1hcEZvbnRJbmZvKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGVsRm9udEluZm8gPSB4O1xyXG4gICAgICAgICAgICB0aGlzLl9mb250c1t4LnhdW3gueV0gPSBudWxsO1xyXG4gICAgICAgICAgICBpbmRYID0geC54O1xyXG4gICAgICAgICAgICBpbmRZID0geC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGVsRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKHgseSk7XHJcbiAgICAgICAgICAgIGlmKGRpc3BlbEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250c1t4XVt5XSA9IG51bGw7XHJcbiAgICAgICAgICAgIGluZFggPSB4O1xyXG4gICAgICAgICAgICBpbmRZID0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZGlzcGVsRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzeXNJbmQgPSB0aGlzLl9zeXNEcm9waW5nRm9udEluZm9zLmluZGV4T2YoZGlzcGVsRm9udEluZm8pIFxyXG4gICAgICAgICAgICBpZihzeXNJbmQgIT0gLTEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N5c0Ryb3BpbmdGb250SW5mb3Muc3BsaWNlKHN5c0luZCAsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN5c0luZCA9IHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2suaW5kZXhPZihkaXNwZWxGb250SW5mbykgXHJcbiAgICAgICAgICAgIGlmKHN5c0luZCAhPSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3lzRGlzcGVsRm9udEluZm9TdGFjay5zcGxpY2Uoc3lzSW5kICwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGlzcGVsRm9udEluZm8uZGVzdHJveVN0dW50RWZmZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5oqA6IO95rGJ5a2Q5pWI5p6cXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW52b2tlU3R1bnRGb250KCkgOiBib29sZWFue1xyXG4gICAgICAgIGxldCBwb2ludHMxID0gW107XHJcbiAgICAgICAgbGV0IHBvaW50czIgPSBbXTtcclxuICAgICAgICBsZXQgc2NvcmUgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCB0ZW1wRm9udEluZm8gOiBNYXBGb250SW5mbztcclxuICAgICAgICBsZXQgZWZmZWN0T2JqID0ge307XHJcbiAgICAgICAgbGV0IHB1c2hBcnJGdW4gPSBmdW5jdGlvbih4IDogbnVtYmVyLCB5IDogbnVtYmVyLCBhcnIgOiBMYXlhLlBvaW50W10pIDogdm9pZHtcclxuICAgICAgICAgICAgaWYoZWZmZWN0T2JqW3ggKyBcIl9cIiArIHldID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKG5ldyBMYXlhLlBvaW50KHgseSkpO1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0T2JqW3ggKyBcIl9cIiArIHldID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIxLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIC8v5raI6Zmk5oqA6IO95qC85a2Q5Zub5ZGoXHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQuZm9udEluZm8gIT0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LmZvbnRJbmZvLngsZWxlbWVudC5mb250SW5mby55KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/mioDog73msYnlrZflt7Lnu4/ooqvmtojpmaTkuI3op6blj5HmioDog71cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwdXNoQXJyRnVuKGVsZW1lbnQuZm9udEluZm8ueCAtIDEsZWxlbWVudC5mb250SW5mby55LHBvaW50czEpO1xyXG4gICAgICAgICAgICBwdXNoQXJyRnVuKGVsZW1lbnQuZm9udEluZm8ueCArIDEsZWxlbWVudC5mb250SW5mby55LHBvaW50czEpO1xyXG4gICAgICAgICAgICBwdXNoQXJyRnVuKGVsZW1lbnQuZm9udEluZm8ueCxlbGVtZW50LmZvbnRJbmZvLnkgLSAxLHBvaW50czEpO1xyXG4gICAgICAgICAgICBwdXNoQXJyRnVuKGVsZW1lbnQuZm9udEluZm8ueCxlbGVtZW50LmZvbnRJbmZvLnkgKyAxLHBvaW50czEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy/mtojpmaTljIXlkKvlvZPliY3lrZfnmoTmiYDmnInmsYnlrZDmoLzlrZBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLl9mb250cy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHRoaXMuX2ZvbnRzW2ldLmxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250SW5mbyA9IHRoaXMuX2ZvbnRzW2ldW2pdIGFzIE1hcEZvbnRJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvLmdldFN0cnVjdEluZm9zKGVsZW1lbnQuaWQsZmFsc2UpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlICs9IDEwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEFyckZ1bih0ZW1wRm9udEluZm8ueCx0ZW1wRm9udEluZm8ueSxwb2ludHMyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgLy/mtojpmaTljIXlkKvlvZPliY3lrZfnmoTmiYDmnInmsYnlrZDmoLzlrZBcclxuICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMuX2ZvbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgdGhpcy5fZm9udHNbaV0ubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5fZm9udHNbaV1bal0gYXMgTWFwRm9udEluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8uZ2V0U3RydWN0SW5mb3MoZWxlbWVudC5pZCxmYWxzZSkubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmUgKz0xMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hBcnJGdW4odGVtcEZvbnRJbmZvLngsdGVtcEZvbnRJbmZvLnkscG9pbnRzMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgdGltZVRvVXBkYXRlIDogbnVtYmVyO1xyXG4gICAgICAgIGlmKHBvaW50czEubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICB0aW1lVG9VcGRhdGUgPSA3MDA7XHJcbiAgICAgICAgICAgIHBvaW50czEuZm9yRWFjaChlbGVtZW50MiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQyLngsZWxlbWVudDIueSk7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29yZSArPSAxMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50Mi54LGVsZW1lbnQyLnkpO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNTAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMxLmZvckVhY2goZWxlbWVudDMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50My54LGVsZW1lbnQzLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5mb250ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQuY2xlYXJFZmZlY3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0Lm9uVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNzAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXIodGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zdGFyX251bSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODUwLHRoaXMsZnVuY3Rpb24oKSAgOnZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocG9pbnRzMi5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5RWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIHRpbWVUb1VwZGF0ZSA9IDEwMDA7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgzMDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHsgICBcclxuICAgICAgICAgICAgICAgIHBvaW50czIuZm9yRWFjaChlbGVtZW50MiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50Mi54LGVsZW1lbnQyLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250SW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50Mi54LGVsZW1lbnQyLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg4MDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHBvaW50czIuZm9yRWFjaChlbGVtZW50MyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQzLngsZWxlbWVudDMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LmZvbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5jbGVhckVmZmVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQub25VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDExNTAsdGhpcyxmdW5jdGlvbigpICA6dm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2NvcmUgKz0gc2NvcmU7XHJcbiAgICAgICAgaWYodGltZVRvVXBkYXRlID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSh0aW1lVG9VcGRhdGUsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyR3JpZExpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Rhcih0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnN0YXJfbnVtKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIxID0gW107XHJcbiAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMiA9IFtdO1xyXG4gICAgICAgIHJldHVybiBwb2ludHMxLmxlbmd0aCA+IDAgfHwgcG9pbnRzMi5sZW5ndGggPiAwXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmtojpmaTor43nu4RcclxuICAgICAqIEBwYXJhbSBjaGFuZ2VGb250SW5mb3Mg5pyJ5Y+Y5pu055qE5rGJ5a2Q5YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZGlzcGVsQ2ladShjaGFuZ2VGb250SW5mb3MgOiBNYXBGb250SW5mb1tdKSA6IGJvb2xlYW57XHJcbiAgICAgICAgbGV0IGNoZWNrRm9udFR4dHMgPSBbXTsvL+W9k+WJjeaJgOacieaxieWtkOWIl+ihqFxyXG4gICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDA7IGogPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WTsgaisrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMCA7ICBpIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGksaik7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdHh0ID0gdGVtcEZvbnRJbmZvLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hlY2tGb250VHh0cy5pbmRleE9mKHR4dCkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0ZvbnRUeHRzLnB1c2godHh0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNoZWNrQXJyID0gW107Ly/mn6Xmib7miYDmnInlsY/luZXkuIrmiYDmnInlrZfnmoTor43lhbjvvIzmib7lh7rlj6/og73nmoTnu4TlkIjliJfooahcclxuICAgICAgICBjaGVja0ZvbnRUeHRzLmZvckVhY2goZWxlbWVudDE9PntcclxuICAgICAgICAgICAgbGV0IHRlbXBBcnIgPSBNYXBGb250SW5mby5nZXRHcm91cChlbGVtZW50MSk7XHJcbiAgICAgICAgICAgIHRlbXBBcnIuZm9yRWFjaChlbGVtZW50MiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihjaGVja0Fyci5pbmRleE9mKGVsZW1lbnQyKSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hhcnMgPSBlbGVtZW50Mi5zcGxpdChcIlwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBpc0ZpeCA6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNoZWNrRm9udFR4dHMuaW5kZXhPZihjaGFyc1tpXSkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0ZpeCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihpc0ZpeClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50MiA9PSB0aGlzLl9wb3B1bGFyR3JvdXApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0Fyci51bnNoaWZ0KGVsZW1lbnQyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrQXJyLnB1c2goZWxlbWVudDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v6YGN5Y6G5Y+Y5pu05YiX6KGo77yM5a+75om+5Y+v5raI6Zmk55qE6K+N57uE5bm25omn6KGM5raI6ZmkXHJcbiAgICAgICAgbGV0IGlzRGlzcGVsIDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGNoYW5nZUZvbnRJbmZvcy5mb3JFYWNoKGVsZW1lbnQgPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LGVsZW1lbnQueSkgIT0gZWxlbWVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBjb3V0ID0gdGhpcy5kaXNwZWxDaVp1SXRlbShlbGVtZW50LngsZWxlbWVudC55LGNoZWNrQXJyKTtcclxuICAgICAgICAgICAgaWYoY291dCA9PSB0cnVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpc0Rpc3BlbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBpc0Rpc3BlbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jaGVja0NoYXJzIDogc3RyaW5nW107XHJcbiAgICBwcml2YXRlIGRpc3BlbENpWnVJdGVtKHggOiBudW1iZXIsIHkgOiBudW1iZXIsY2hlY2tBcnIgOiBzdHJpbmdbXSkgOiBib29sZWFue1xyXG4gICAgICAgIGxldCByb290ID0gdGhpcy5nZXRGb250SW5mbyh4LHkpO1xyXG4gICAgICAgIGlmKHJvb3QgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IGNoZWNrQXJyLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGdyb3VwID0gY2hlY2tBcnJbaV07XHJcbiAgICAgICAgICAgIGlmKGdyb3VwLmluZGV4T2Yocm9vdC50ZXh0KSA9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tDaGFycyA9IGdyb3VwLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgICAgICBsZXQgYVN0YXJJbmZvID0gdGhpcy5kaXNwZWxDaVp1SXRlbVN1cmUoeCx5LG51bGwpO1xyXG4gICAgICAgICAgICBpZihhU3RhckluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/mtojpmaTor43nu4RcclxuICAgICAgICAgICAgICAgIFNvdW5kVG9vbC5wbGF5WGlhb0NodUVmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5RWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgICAgICBpZihncm91cCA9PSB0aGlzLl9wb3B1bGFyR3JvdXApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcG9wdWxhckdyb3VwID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5raI6Zmk6K+N57uE77yaPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIilcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi6K+N57uE77yaXCIgKyBncm91cClcclxuICAgICAgICAgICAgICAgIGxldCBzY29yZSA9IDQwO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvaW50cyA9IGFTdGFySW5mby5nZXRTdXJlTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNpWnVPYmogPSB7fTtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNpWnVPYmpbZWxlbWVudC54ICsgXCJfXCIgKyBlbGVtZW50LnldID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnQgPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBvaW50IDogKFwiK3RlbXBGb250LngrXCIsXCIrdGVtcEZvbnQueStcIixcIit0ZW1wRm9udC50ZXh0K1wiKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQuaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIucHVzaCh7Zm9udEluZm8gOiB0ZW1wRm9udCxpZCA6IHRlbXBGb250LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZSArKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udCA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54IC0gMSxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udC5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMi5wdXNoKHtmb250SW5mbyA6IHRlbXBGb250LGlkIDogdGVtcEZvbnQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lICsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udCA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54ICsgMSxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udC5pc1N0dW50Rm9udClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMi5wdXNoKHtmb250SW5mbyA6IHRlbXBGb250LGlkIDogdGVtcEZvbnQuaWR9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBGb250ID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250LmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHVudEZvbnRzQ2hlY2tBcnIyLnB1c2goe2ZvbnRJbmZvIDogdGVtcEZvbnQsaWQgOiB0ZW1wRm9udC5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnQgPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCxlbGVtZW50LnkgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwZWxGb250KHRlbXBGb250KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnQuaXNTdHVudEZvbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjIucHVzaCh7Zm9udEluZm8gOiB0ZW1wRm9udCxpZCA6IHRlbXBGb250LmlkfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2NvcmUgKz0gKHRpbWUgKiAxMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY29yZSArPSBzY29yZTtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIub25jZSg1MDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5mb250ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQuY2xlYXJFZmZlY3RzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0Lm9uVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDIwMCx0aGlzLGZ1bmN0aW9uKCkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRTY3JpcHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wWCA9IGVsZW1lbnQueCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wWSA9IGVsZW1lbnQueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2ladU9ialt0ZW1wWCArIFwiX1wiICsgdGVtcFldICE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KHRlbXBYLHRlbXBZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wWCA9IGVsZW1lbnQueCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBZID0gZWxlbWVudC55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjaVp1T2JqW3RlbXBYICsgXCJfXCIgKyB0ZW1wWV0gIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQgPSB0aGlzLmdldEZvbnRTY3JpcHQodGVtcFgsdGVtcFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcEZvbnRTY3JpcHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdC5wbGF5SGVDaGVuZ0VmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBYID0gZWxlbWVudC54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wWSA9IGVsZW1lbnQueSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNpWnVPYmpbdGVtcFggKyBcIl9cIiArIHRlbXBZXSAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdCh0ZW1wWCx0ZW1wWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udFNjcmlwdCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0LnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFggPSBlbGVtZW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBZID0gZWxlbWVudC55ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2ladU9ialt0ZW1wWCArIFwiX1wiICsgdGVtcFldICE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KHRlbXBYLHRlbXBZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250U2NyaXB0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcEZvbnRTY3JpcHQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNzAwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREaXNwZWxUZXh0KGdyb3VwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckdyaWRMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3Rhcih0aGlzLl9teVBsYXllckluZm8uZ2V0U3RhckluZm8odGhpcy5fc2NvcmUpLnN0YXJfbnVtKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDg1MCx0aGlzLGZ1bmN0aW9uKCkgIDp2b2lke1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kRWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkaXNwZWxDaVp1SXRlbVN1cmUoeCA6IG51bWJlciwgeSA6IG51bWJlcixwYXJlbnRBU3RhckluZm8gOiBTZWFyY2hJbmZvKSA6IFNlYXJjaEluZm97XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGN1cnJlbnRGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oeCx5KTtcclxuICAgICAgICBpZihjdXJyZW50Rm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2hhcnMgPSBwYXJlbnRBU3RhckluZm8gPT0gbnVsbCA/IHRoaXMuX2NoZWNrQ2hhcnMuY29uY2F0KCkgOnBhcmVudEFTdGFySW5mby5jaGFycy5jb25jYXQoKTtcclxuICAgICAgICBpZihjaGFycy5pbmRleE9mKGN1cnJlbnRGb250SW5mby50ZXh0KSA9PSAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYVN0YXJJbmZvID0gbmV3IFNlYXJjaEluZm8oKTtcclxuICAgICAgICBhU3RhckluZm8uY3VycmVudFBvaW50LnggPSB4O1xyXG4gICAgICAgIGFTdGFySW5mby5jdXJyZW50UG9pbnQueSA9IHk7XHJcbiAgICAgICAgYVN0YXJJbmZvLnNldE9wZW5MaXN0KHBhcmVudEFTdGFySW5mbyA9PSBudWxsID8gW10gOiBwYXJlbnRBU3RhckluZm8uZ2V0T3Blbkxpc3QoKS5jb25jYXQoKSlcclxuICAgICAgICBhU3RhckluZm8uc2V0U3VyZUxpc3QocGFyZW50QVN0YXJJbmZvID09IG51bGwgPyBbXSA6IHBhcmVudEFTdGFySW5mby5nZXRTdXJlTGlzdCgpLmNvbmNhdCgpKTtcclxuICAgICAgICBhU3RhckluZm8ub3Blbih4LHksZmFsc2UpO1xyXG4gICAgICAgIGFTdGFySW5mby5zdXJlKHgseSk7XHJcbiAgICAgICAgYVN0YXJJbmZvLmNoYXJzID0gY2hhcnM7XHJcbiAgICAgICAgYVN0YXJJbmZvLmNoYXJzLnNwbGljZShhU3RhckluZm8uY2hhcnMuaW5kZXhPZihjdXJyZW50Rm9udEluZm8udGV4dCksMSk7XHJcbiAgICAgICAgaWYoYVN0YXJJbmZvLmNoYXJzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFTdGFySW5mbztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCAtIDEseSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCAtIDEseSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4IC0gMSx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCArIDEseSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCArIDEseSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4ICsgMSx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCx5IC0gMSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCx5IC0gMSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4LHkgLSAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWFTdGFySW5mby5pc09wZW4oeCx5ICsgMSkgJiYgIWFTdGFySW5mby5pc1N1cmUoeCx5ICsgMSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhU3RhckluZm8ub3Blbih4LHkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG9wZW5MaXN0ID0gYVN0YXJJbmZvLmdldE9wZW5MaXN0KCk7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBvcGVuTGlzdFtpXTtcclxuICAgICAgICAgICAgbGV0IGNvdXQgPSB0aGlzLmRpc3BlbENpWnVJdGVtU3VyZShlbGVtZW50LngsIGVsZW1lbnQueSwgYVN0YXJJbmZvKTtcclxuICAgICAgICAgICAgaWYoY291dCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY291dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa2iOWtl1xyXG4gICAgICogQHBhcmFtIHggXHJcbiAgICAgKiBAcGFyYW0geSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwZWwoeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBib29sZWFue1xyXG4gICAgICAgIGxldCB0YXJnZXRGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oeCx5KTtcclxuICAgICAgICBpZih0YXJnZXRGb250SW5mbyA9PSBudWxsKXJldHVybiBmYWxzZTtcclxuICAgICAgICBsZXQgY2FuSGVDaGVuZ0ZvbnRJbmZvcyA9IHRhcmdldEZvbnRJbmZvLmNhbkhlQ2hlbmdGb250SW5mb3M7XHJcbiAgICAgICAgaWYoY2FuSGVDaGVuZ0ZvbnRJbmZvcy5sZW5ndGggPT0gMClyZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgbGV0IHBvcHVsYXJHcm91cCA9IHRoaXMuX3BvcHVsYXJHcm91cDtcclxuICAgICAgICBpZihwb3B1bGFyR3JvdXAgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbkhlQ2hlbmdGb250SW5mb3Muc29ydChmdW5jdGlvbihhIDogTWFwRm9udEluZm8sIGIgOiBNYXBGb250SW5mbykgOiBudW1iZXJ7XHJcbiAgICAgICAgICAgICAgICBpZihwb3B1bGFyR3JvdXAuaW5kZXhPZihhLnRleHQpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYocG9wdWxhckdyb3VwLmluZGV4T2YoYi50ZXh0KSAhPSAtMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+mBjeWOhuWPmOabtOWIl+ihqO+8jOWvu+aJvuWPr+a2iOmZpOeahOivjee7hOW5tuaJp+ihjOa2iOmZpFxyXG4gICAgICAgIGxldCBoYXNIZUNoZW5nID0gZmFsc2U7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0wIDsgaTwgY2FuSGVDaGVuZ0ZvbnRJbmZvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGhhc0hlQ2hlbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gPSBjYW5IZUNoZW5nRm9udEluZm9zW2ldO1xyXG4gICAgICAgICAgICBsZXQgc3RydWN0SW5mb0xpc3QgPSB0ZW1wRm9udEluZm8uc3RydWN0SW5mby5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlciA9IDA7IGogPCBzdHJ1Y3RJbmZvTGlzdC5sZW5ndGg7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0cnVjdExpc3QgPSBzdHJ1Y3RJbmZvTGlzdFtqXS5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgICAgICBpZihzdHJ1Y3RMaXN0Lmxlbmd0aCA+IDEgJiYgc3RydWN0TGlzdC5pbmRleE9mKHRhcmdldEZvbnRJbmZvLmlkLnRvU3RyaW5nKCkpICE9IC0xKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3V0ID0gdGhpcy5kaXNwZWxJdGVtKHRhcmdldEZvbnRJbmZvLngsdGFyZ2V0Rm9udEluZm8ueSxzdHJ1Y3RMaXN0LHRlbXBGb250SW5mby5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY291dClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0hlQ2hlbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhhc0hlQ2hlbmdcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jaGVja0lkcyA6IHN0cmluZ1tdID0gW107XHJcbiAgICBwcml2YXRlIGRpc3BlbEl0ZW0oeCA6IG51bWJlcix5IDogbnVtYmVyLGNoZWNrQXJyIDogc3RyaW5nW10sZm9udElkIDogbnVtYmVyKSA6IGJvb2xlYW57XHJcbiAgICAgICAgbGV0IHJvb3QgPSB0aGlzLmdldEZvbnRJbmZvKHgseSk7XHJcbiAgICAgICAgaWYocm9vdCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jaGVja0lkcyA9IGNoZWNrQXJyO1xyXG4gICAgICAgIGxldCBzZWFyY2hJbmZvID0gdGhpcy5kaXNwZWxJdGVtU3VyZSh4LHksbnVsbCk7XHJcbiAgICAgICAgaWYoc2VhcmNoSW5mbyAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/mtojpmaTlubblkIjmiJDmsYnlrZBcclxuICAgICAgICAgICAgU291bmRUb29sLnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUVmZmVjdEluYygpO1xyXG4gICAgICAgICAgICBsZXQgbWF4UXVhbGl0eSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBwb2ludHMgPSBzZWFyY2hJbmZvLmdldFN1cmVMaXN0KCk7XHJcbiAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBGb250R3JpZCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wRm9udEluZm8gPSB0aGlzLmdldEZvbnRJbmZvKGVsZW1lbnQueCwgZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgIGlmKG1heFF1YWxpdHkgPCB0ZW1wRm9udEluZm8ucXVhbGl0eSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXhRdWFsaXR5ID0gdGVtcEZvbnRJbmZvLnF1YWxpdHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEdyaWQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wRm9udEdyaWQucGxheUhlQ2hlbmdFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIua2iOmZpOagvOWtkDogKFwiK2VsZW1lbnQueCtcIixcIitlbGVtZW50LnkrXCIpXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbGV0IGNvdXRGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7aWQgOiBmb250SWR9KTtcclxuICAgICAgICAgICAgdGhpcy5zZXREaXNwZWxUZXh0KGNvdXRGb250SW5mby50ZXh0KTtcclxuICAgICAgICAgICAgY291dEZvbnRJbmZvLnggPSB4O1xyXG4gICAgICAgICAgICBjb3V0Rm9udEluZm8ueSA9IHk7XHJcbiAgICAgICAgICAgIGNvdXRGb250SW5mby5xdWFsaXR5ID0gbWF4UXVhbGl0eSArIDE7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRDZWxsID0gdGhpcy5nZXRGb250Q2VsbCh4LHkpO1xyXG4gICAgICAgICAgICBsZXQgdGFyZ2V0UG9pbnQgPSBuZXcgTGF5YS5Qb2ludCh0YXJnZXRDZWxsLngsIHRhcmdldENlbGwueSk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg1MDAsdGhpcyxmdW5jdGlvbihwYXJfcG9pbnRzKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICBwYXJfcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oZWxlbWVudC54LCBlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyA9PSBudWxsKXJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50LnggIT0geCB8fCBlbGVtZW50LnkgIT0geSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlU3RhcnRDZWxsID0gdGhpcy5nZXRGb250Q2VsbChlbGVtZW50LngsIGVsZW1lbnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlU3RhcnRGb250R3JpZFNjcmlwdCA9IHRoaXMuZ2V0Rm9udFNjcmlwdChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZVN0YXJ0Rm9udEdyaWRTY3JpcHQuZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVTdGFydEZvbnRHcmlkU2NyaXB0LmNsZWFyRWZmZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZUNlbGwgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q3JlYXRlRnVuKFwiRm9udEdyaWRcIiwgdGhpcy5wcmVmYWJfZm9udEdyaWQuY3JlYXRlLCB0aGlzLnByZWZhYl9mb250R3JpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVDZWxsW1wieFwiXSA9IG1vdmVTdGFydENlbGxbXCJ4XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlQ2VsbFtcInlcIl0gPSBtb3ZlU3RhcnRDZWxsW1wieVwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vdmVGb250R3JpZFNjcmlwdCA9IChtb3ZlQ2VsbC5nZXRDb21wb25lbnQoRm9udEdyaWQpIGFzIEZvbnRHcmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUZvbnRHcmlkU2NyaXB0LmZvbnQgPSB0ZW1wRm9udEluZm8udGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUZvbnRHcmlkU2NyaXB0LmFkZEVmZmVjdCh0ZW1wRm9udEluZm8uZ2V0U3R1bnRGb250RWZmZWN0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRm9udEdyaWRTY3JpcHQub25VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0X2dyaWRzLmFkZENoaWxkKG1vdmVDZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTGF5YS5Ud2Vlbi50byhtb3ZlQ2VsbCx7eCA6IHRhcmdldFBvaW50LngsIHkgOiB0YXJnZXRQb2ludC55fSwxMDAsbnVsbCxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsZnVuY3Rpb24odGFyZ2V0TWMpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE1jLmRlc3Ryb3kodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sW21vdmVDZWxsXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BlbEZvbnQodGVtcEZvbnRJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0ZW1wRm9udEluZm8gJiYgdGVtcEZvbnRJbmZvLmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R1bnRGb250c0NoZWNrQXJyMS5wdXNoKHtmb250SW5mbyA6IGNvdXRGb250SW5mbyxpZCA6IHRlbXBGb250SW5mby5pZH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sW3BvaW50c10pO1xyXG4gICAgICAgICAgICBsZXQgc2NvcmUgPSAxMDtcclxuICAgICAgICAgICAgbGV0IHRpbWUgPSBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBzY29yZSArPSAxMCAqIHRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njb3JlICs9IHNjb3JlO1xyXG4gICAgICAgICAgICBDb250cm9sbGVyTWdyLmdldEluc3RhbmNlKFRpcENvbnRyb2xsZXIpLnNob3dMZWZ0Qm90dG9tVGlwKFwiK1wiICsgc2NvcmUpO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoNTUwLHRoaXMsZnVuY3Rpb24oKSA6IHZvaWR7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250c1t4XVt5XSA9IGNvdXRGb250SW5mbztcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRGb250U2NyaXB0ID0gdGhpcy5nZXRGb250U2NyaXB0KHgseSk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRGb250U2NyaXB0LmZvbnQgPSBjb3V0Rm9udEluZm8udGV4dDtcclxuICAgICAgICAgICAgICAgIHRhcmdldEZvbnRTY3JpcHQuYWRkRWZmZWN0KGNvdXRGb250SW5mby5nZXRTdHVudEZvbnRFZmZlY3QoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXIodGhpcy5fbXlQbGF5ZXJJbmZvLmdldFN0YXJJbmZvKHRoaXMuX3Njb3JlKS5zdGFyX251bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9udVFpICsrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVOdVFpKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSg3MDAsdGhpcyxmdW5jdGlvbigpIDogdm9pZHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5ZCI5oiQ5rGJ5a2Q77yaPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIik7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKFwiK2NvdXRGb250SW5mby54K1wiLFwiK2NvdXRGb250SW5mby55K1wiLFwiK2NvdXRGb250SW5mby50ZXh0K1wiKVwiKTtcclxuICAgICAgICAgICAgdGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5wdXNoKGNvdXRGb250SW5mbyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIilcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRpc3BlbEl0ZW1TdXJlKHggOiBudW1iZXIsIHkgOiBudW1iZXIscGFyZW50QVN0YXJJbmZvIDogU2VhcmNoSW5mbykgOiBTZWFyY2hJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRGb250SW5mbyA9IHRoaXMuZ2V0Rm9udEluZm8oeCx5KTtcclxuICAgICAgICBpZihjdXJyZW50Rm9udEluZm8gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2hhcnMgPSBwYXJlbnRBU3RhckluZm8gPT0gbnVsbCA/IHRoaXMuX2NoZWNrSWRzLmNvbmNhdCgpIDpwYXJlbnRBU3RhckluZm8uY2hhcnMuY29uY2F0KCk7XHJcbiAgICAgICAgaWYoY2hhcnMuaW5kZXhPZihjdXJyZW50Rm9udEluZm8uaWQudG9TdHJpbmcoKSkgPT0gLTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGFTdGFySW5mbyA9IG5ldyBTZWFyY2hJbmZvKCk7XHJcbiAgICAgICAgYVN0YXJJbmZvLmN1cnJlbnRQb2ludC54ID0geDtcclxuICAgICAgICBhU3RhckluZm8uY3VycmVudFBvaW50LnkgPSB5O1xyXG4gICAgICAgIGFTdGFySW5mby5zZXRPcGVuTGlzdChwYXJlbnRBU3RhckluZm8gPT0gbnVsbCA/IFtdIDogcGFyZW50QVN0YXJJbmZvLmdldE9wZW5MaXN0KCkuY29uY2F0KCkpXHJcbiAgICAgICAgYVN0YXJJbmZvLnNldFN1cmVMaXN0KHBhcmVudEFTdGFySW5mbyA9PSBudWxsID8gW10gOiBwYXJlbnRBU3RhckluZm8uZ2V0U3VyZUxpc3QoKS5jb25jYXQoKSk7XHJcbiAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCx5LGZhbHNlKTtcclxuICAgICAgICBhU3RhckluZm8uc3VyZSh4LHkpO1xyXG4gICAgICAgIGFTdGFySW5mby5jaGFycyA9IGNoYXJzO1xyXG4gICAgICAgIGFTdGFySW5mby5jaGFycy5zcGxpY2UoYVN0YXJJbmZvLmNoYXJzLmluZGV4T2YoY3VycmVudEZvbnRJbmZvLmlkLnRvU3RyaW5nKCkpLDEpO1xyXG4gICAgICAgIGlmKGFTdGFySW5mby5jaGFycy5sZW5ndGggPT0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBhU3RhckluZm87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHggLSAxLHkpICYmICFhU3RhckluZm8uaXNTdXJlKHggLSAxLHkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCAtIDEseSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHggKyAxLHkpICYmICFhU3RhckluZm8uaXNTdXJlKHggKyAxLHkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCArIDEseSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHgseSAtIDEpICYmICFhU3RhckluZm8uaXNTdXJlKHgseSAtIDEpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCx5IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFhU3RhckluZm8uaXNPcGVuKHgseSArIDEpICYmICFhU3RhckluZm8uaXNTdXJlKHgseSArIDEpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYVN0YXJJbmZvLm9wZW4oeCx5ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBvcGVuTGlzdCA9IGFTdGFySW5mby5nZXRPcGVuTGlzdCgpO1xyXG4gICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gb3Blbkxpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCBjb3V0ID0gdGhpcy5kaXNwZWxJdGVtU3VyZShlbGVtZW50LngsIGVsZW1lbnQueSwgYVN0YXJJbmZvKTtcclxuICAgICAgICAgICAgaWYoY291dCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY291dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ndWlkZUltZ3MgPSB7fTtcclxuICAgIHByaXZhdGUgX2d1aWRlUmF0ZSA6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGRlc3Ryb3lHdWlkZUltZ3MoKSA6IHZvaWR7XHJcbiAgICAgICAgZm9yKGxldCB0ZW1wUHJvcGVydHkgaW4gdGhpcy5fZ3VpZGVJbWdzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRlbXBJbWcgPSB0aGlzLl9ndWlkZUltZ3NbdGVtcFByb3BlcnR5XTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhckFsbCh0ZW1wSW1nKTtcclxuICAgICAgICAgICAgTGF5YS5Ud2Vlbi5jbGVhckFsbCh0ZW1wSW1nKTtcclxuICAgICAgICAgICAgdGVtcEltZy5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ndWlkZUltZ3MgPSB7fTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5b6q546v5omA5pyJ6aG25qC877yM5pi+56S66Lef5b2T5YmN6aOY6JC955qE5rGJ5a2Q5pyJ5YWz6IGU55qE5qC85a2Q77yM5Y2z5Y+v57uE5oiQ6K+N6K+t5oiW6ICF5ZKM5ZCI5oiQ5rGJ5a2Q55qE5qC85a2QXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ3VpZGVUb0dyaWQoKSA6IHZvaWR7XHJcbiAgICAgICAgZm9yKGxldCB0ZW1wUHJvcGVydHkgaW4gdGhpcy5fZ3VpZGVJbWdzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRlbXBJbWcgPSB0aGlzLl9ndWlkZUltZ3NbdGVtcFByb3BlcnR5XTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhckFsbCh0ZW1wSW1nKTtcclxuICAgICAgICAgICAgTGF5YS5Ud2Vlbi5jbGVhckFsbCh0ZW1wSW1nKTtcclxuICAgICAgICAgICAgdGVtcEltZy5kZXN0cm95KHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ndWlkZUltZ3MgPSB7fTtcclxuICAgICAgICBsZXQgcmF0ZSA9IE1hdGgucmFuZG9tKCkgKiAxMDA7XHJcbiAgICAgICAgaWYocmF0ZSA+IHRoaXMuX2d1aWRlUmF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2d1aWRlUmF0ZSA9IE1hdGgubWluKCB0aGlzLl9ndWlkZVJhdGUgKyAxLDUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkcm9waW5nRm9udENhbkhlQ2hlbmdGb250SW5mb3MgPSB0aGlzLl9kcm9waW5nRm9udEluZm8uY2FuSGVDaGVuZ0ZvbnRJbmZvcztcclxuICAgICAgICBsZXQgZHJvcGluZ0ZvbnRDYW5IZUNoZW5nR3JvdXBzID0gdGhpcy5fZHJvcGluZ0ZvbnRJbmZvLmNhbkhlQ2hlbmdHcm91cHM7XHJcbiAgICAgICAgbGV0IHRvcEZvbnRJbmZvcyA9IHRoaXMuZ2V0VG9wRm9udEluZm9zKCk7XHJcbiAgICAgICAgbGV0IHBvaW50cyA9IFtdO1xyXG4gICAgICAgIHRvcEZvbnRJbmZvcy5mb3JFYWNoKHRlbXBGb250SW5mbyA9PiB7XHJcbiAgICAgICAgICAgIGRyb3BpbmdGb250Q2FuSGVDaGVuZ0dyb3Vwcy5mb3JFYWNoKHRlbXBHcm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0ZW1wR3JvdXAubGVuZ3RoICE9IDIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwQXJyID0gdGVtcEdyb3VwLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBBcnIuc3BsaWNlKGdyb3VwQXJyLmluZGV4T2YodGhpcy5fZHJvcGluZ0ZvbnRJbmZvLnRleHQpLDEpO1xyXG4gICAgICAgICAgICAgICAgaWYoZ3JvdXBBcnIuaW5kZXhPZih0ZW1wRm9udEluZm8udGV4dCkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lj6/lkIjmiJDor43nu4RcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgTGF5YS5Qb2ludCh0ZW1wRm9udEluZm8ueCx0ZW1wRm9udEluZm8ueSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRyb3BpbmdGb250Q2FuSGVDaGVuZ0ZvbnRJbmZvcy5mb3JFYWNoKHRlbXBNZXJnZUZvbnRJbmZvID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJ1Y3RJbmZvcyA9IHRlbXBNZXJnZUZvbnRJbmZvLmdldFN0cnVjdEluZm9zKHRlbXBGb250SW5mby5pZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc3RydWN0SW5mb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBTdHJ1Y2tJbmZvID0gc3RydWN0SW5mb3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBTdHJ1Y2tBcnIgPSB0ZW1wU3RydWNrSW5mby5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcFN0cnVja0Fyci5sZW5ndGggIT0gMilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0ZW1wU3RydWNrQXJyLnNwbGljZSh0ZW1wU3RydWNrQXJyLmluZGV4T2YodGVtcEZvbnRJbmZvLmlkLnRvU3RyaW5nKCkpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBTdHJ1Y2tBcnIuaW5kZXhPZih0aGlzLl9kcm9waW5nRm9udEluZm8uaWQudG9TdHJpbmcoKSkgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+WQiOaIkOaxieWtkFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgTGF5YS5Qb2ludCh0ZW1wRm9udEluZm8ueCx0ZW1wRm9udEluZm8ueSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmKHBvaW50cy5sZW5ndGggPiAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZ3VpZGVSYXRlID0gMDtcclxuICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9ndWlkZUltZ3NbZWxlbWVudC54ICsgXCItXCIgKyBlbGVtZW50LnldICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBHcmlkID0gdGhpcy5nZXRGb250Q2VsbChlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wSW1nID0gbmV3IExheWEuSW1hZ2UoXCJtYXAvdHpfamlhbnRvdS5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICB0ZW1wSW1nLnNjYWxlWCA9IHRlbXBJbWcuc2NhbGVZID0gMC43O1xyXG4gICAgICAgICAgICAgICAgdGVtcEltZy5yb3RhdGlvbiA9IDkwO1xyXG4gICAgICAgICAgICAgICAgdGVtcEltZy54ID0gNzU7XHJcbiAgICAgICAgICAgICAgICB0ZW1wSW1nLnkgPSAtNzU7XHJcbiAgICAgICAgICAgICAgICB0ZW1wR3JpZC5hZGRDaGlsZCh0ZW1wSW1nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlSW1nc1tlbGVtZW50LnggKyBcIi1cIiArIGVsZW1lbnQueV0gPSB0ZW1wSW1nO1xyXG4gICAgICAgICAgICAgICAgTGF5YS50aW1lci5sb29wKDEwMDAsdGVtcEltZyxmdW5jdGlvbihwYXJfaW1nIDogTGF5YS5JbWFnZSkgOiB2b2lke1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXRZID0gcGFyX2ltZy55ID09IC03NT8gLTg1IDogLTc1O1xyXG4gICAgICAgICAgICAgICAgICAgIExheWEuVHdlZW4udG8ocGFyX2ltZyx7eSA6IHRhcmdldFl9LDc1MCk7XHJcbiAgICAgICAgICAgICAgICB9LFt0ZW1wSW1nXSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGb250SW5mbyh4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IE1hcEZvbnRJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5fZm9udHNbeF0gPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9udHNbeF1beV07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGb250Q2VsbCh4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IExheWEuQm94XHJcbiAgICB7XHJcbiAgICAgICAgaWYoeSA8IDAgfHwgeSA+PSB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WSB8fCB4IDwgMCB8fCB4ID49IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRYKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmxpc3RfZ3JpZHMuZ2V0Q2VsbCh5ICogdGhpcy5saXN0X2dyaWRzLnJlcGVhdFggKyB4KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Rm9udFNjcmlwdCh4IDogbnVtYmVyLCB5IDogbnVtYmVyKSA6IEZvbnRHcmlkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGZvbnRDZWxsID0gdGhpcy5nZXRGb250Q2VsbCh4LCB5KTtcclxuICAgICAgICBpZihmb250Q2VsbCA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gZm9udENlbGwuZ2V0Q29tcG9uZW50KEZvbnRHcmlkKSBhcyBGb250R3JpZDtcclxuICAgIH1cclxuXHJcbiAgICAvL+S/oeaBr+abtOaWsFxyXG4gICAgcHVibGljIHJlZnJlc2goKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5zZXRTdGFyKHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3Rhcl9udW0pO1xyXG4gICAgICAgIHRoaXMudHh0X3BsYXllck5hbWUudGV4dCA9IHRoaXMuX215UGxheWVySW5mby5uYW1lO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTmV4dERyb3BpbmdGb250KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUG9wdWxhckdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVOdVFpKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgdXBkYXRlU2NvcmUoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy50eHRfc2NvcmUudGV4dCA9IHRoaXMuX3Njb3JlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3B1bGFyR3JvdXAoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fcG9wdWxhckdyb3VwID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYmFuayA9IE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJiYW5rXCJdO1xyXG4gICAgICAgICAgICB0aGlzLl9wb3B1bGFyR3JvdXAgPSBiYW5rW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJhbmsubGVuZ3RoKV07XHJcbiAgICAgICAgICAgIHRoaXMuaGVDaVNwbGl0VGltZXMgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9wb3B1bGFyR3JvdXAgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudHh0X3BvcHVsYXJHcm91cC50ZXh0ID0gdGhpcy5fcG9wdWxhckdyb3VwO1xyXG4gICAgICAgICAgICB0aGlzLmltZ19wb3B1bGFyR3JvdXBCZy5oZWlnaHQgPSB0aGlzLnR4dF9wb3B1bGFyR3JvdXAuZGlzcGxheUhlaWdodCArIDE2O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU5leHREcm9waW5nRm9udCgpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnR4dF9uZXh0Rm9udC50ZXh0ID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudHh0X25leHRGb250LnRleHQgPSB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLnRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RGlzcGVsVGV4dCh0ZXh0IDogc3RyaW5nKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Ud2Vlbi5jbGVhckFsbCh0aGlzLm1jX2Rpc3BlbFRleHQpO1xyXG4gICAgICAgIHRoaXMubWNfZGlzcGVsVGV4dC5zY2FsZVggPSB0aGlzLm1jX2Rpc3BlbFRleHQuc2NhbGVZID0gMC40O1xyXG4gICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgc3dpdGNoKHRleHQubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50eHRfZGlzcGVsVGV4dC5mb250U2l6ZSA9IDEyMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHh0X2Rpc3BlbFRleHQuc2l6ZSgxMjAsMTIwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LmZvbnRTaXplID0gNjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LnNpemUoMTIwLDYwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LmZvbnRTaXplID0gNDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LnNpemUoMTIwLDQwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LmZvbnRTaXplID0gMzA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR4dF9kaXNwZWxUZXh0LnNpemUoMTIwLDMwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBMYXlhLlR3ZWVuLnRvKHRoaXMubWNfZGlzcGVsVGV4dCx7c2NhbGVYIDogMSxzY2FsZVkgOiAxfSwzMDApXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRTdGFyKHN0YXIgOiBudW1iZXIpIDogdm9pZHtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIHdoaWxlKHN0YXIgPiAwIHx8IGxpc3QubGVuZ3RoIDwgNSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihzdGFyID4gMClcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0cnVlKVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKGZhbHNlKVxyXG4gICAgICAgICAgICBzdGFyIC0tO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpc3Rfc3Rhci5kYXRhU291cmNlID0gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZU51UWkoKSA6IHZvaWR7XHJcbiAgICAgICAgaWYodGhpcy5fbnVRaSA+PSAxMylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vXGLop6blj5HmgJLmsJTvvIzpmo/mnLrmtojpmaTkuIDooYzkuIDliJdcclxuICAgICAgICAgICAgbGV0IGZvbnRzQXJyID0gdGhpcy5nZXRBbGxGb250cygpO1xyXG4gICAgICAgICAgICBpZihmb250c0Fyci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NvcmUgPSAxMDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgbnVRaUZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KGZvbnRzQXJyKSBhcyBNYXBGb250SW5mbztcclxuICAgICAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA6IG51bWJlciA9IDA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSArKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtudVFpRm9udEluZm8ueV0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlICs9IDEwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChuZXcgTGF5YS5Qb2ludChpLCBudVFpRm9udEluZm8ueSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgaSA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZOyBpICsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGkgIT0gbnVRaUZvbnRJbmZvLngpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChuZXcgTGF5YS5Qb2ludChudVFpRm9udEluZm8ueCwgaSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tudVFpRm9udEluZm8ueF1baV0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmUgKz0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY29yZSArPSBzY29yZTtcclxuICAgICAgICAgICAgICAgIFNvdW5kVG9vbC5wbGF5VGVKaUVmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5TnVRaUVmZmVjdChhcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbnVRaSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxpc3QgPSBbXTtcclxuICAgICAgICBsZXQgaSA9IHRoaXMuX251UWlcclxuICAgICAgICB3aGlsZShpID4gMCB8fCBsaXN0Lmxlbmd0aCA8IDEzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKGkgPiAwKVxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRydWUpXHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goZmFsc2UpXHJcbiAgICAgICAgICAgIGkgLS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpc3QgPSBsaXN0LnJldmVyc2UoKTtcclxuICAgICAgICB0aGlzLmxpc3RfbnVRaS5kYXRhU291cmNlID0gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBsYXlOdVFpRWZmZWN0KHBvaW50cyA6IExheWEuUG9pbnRbXSkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMucGxheUVmZmVjdEluYygpO1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGVtcEZvbnRHcmlkID0gdGhpcy5nZXRGb250U2NyaXB0KGVsZW1lbnQueCxlbGVtZW50LnkpO1xyXG4gICAgICAgICAgICBpZih0ZW1wRm9udEdyaWQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGVtcEZvbnRHcmlkLnBsYXlIZUNoZW5nRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaAkuawlOa2iOmZpDogKFwiK2VsZW1lbnQueCtcIixcIitlbGVtZW50LnkrXCIpXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDUwMCx0aGlzLGZ1bmN0aW9uICgpIDogdm9pZHtcclxuICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcEZvbnRJbmZvID0gdGhpcy5nZXRGb250SW5mbyhlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICAgICAgICAgIGlmKHRlbXBGb250SW5mbyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGVsRm9udCh0ZW1wRm9udEluZm8pO1xyXG4gICAgICAgICAgICAgICAgaWYodGVtcEZvbnRJbmZvLmlzU3R1bnRGb250KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0dW50Rm9udHNDaGVja0FycjEucHVzaCh7Zm9udEluZm8gOiB0ZW1wRm9udEluZm8saWQgOiB0ZW1wRm9udEluZm8uaWR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGlzdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIExheWEudGltZXIub25jZSg2NTAsdGhpcyxmdW5jdGlvbiAoKSA6IHZvaWR7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRWZmZWN0SW5jKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGFyKHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3Rhcl9udW0pO1xyXG4gICAgICAgICAgICB0aGlzLl9udVFpICsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8v55Sf5oiQ5a2XXHJcbiAgICBwcml2YXRlIGhlQ2lTcGxpdFRpbWVzIDogbnVtYmVyID0gMTsgLy/lkIjmiJDlvZPliY3lt6bovrnor43nu4TlpLHotKXmrKHmlbBcclxuICAgIHByaXZhdGUgaGVDaXp1UmF0ZSA6IG51bWJlciA9IDQwOyAvL+WHuueOsOW3pui+uemCo+S4quivjee7hOeahOamgueOh1xyXG4gICAgcHJpdmF0ZSBoYW5aaVJhdGUgOiBudW1iZXIgPSA2MCA7IC8vIOWHuueOsOiDvei3n+S6lOWIl+acgOWklui+ueaxieWtl+WQiOaIkOaxieWtl+eahOamgueOh1xyXG4gICAgcHJpdmF0ZSBjaVp1UmF0ZSA6IG51bWJlciA9IDYwOyAvLyDlh7rnjrDog73ot5/kupTliJfmnIDlpJbovrnmsYnlrZflkIjmiJDor43nu4TnmoTmpoLnjodcclxuICAgIHByaXZhdGUgYnVTaG91UmF0ZSA6IG51bWJlciA9IDA7IC8v5Ye6546w54m55q6K6YOo6aaW55qE5qaC546HXHJcbiAgICByYW5kb21OZXh0Rm9udCgpOnZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX2RlYnVnTW9kZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0eHQgPSB0aGlzLl9kZWJ1Z0Ryb3BGb250cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogdHh0fSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8udGV4dCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoTWF0aC5yYW5kb20oKSAqIDEwMCA+IHRoaXMuYnVTaG91UmF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVTaG91UmF0ZSA9IE1hdGgubWluKHRoaXMuYnVTaG91UmF0ZSArIDEsNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmJ1U2hvdVJhdGUgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdHh0ID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJzdHVudF9mb250XCJdKSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoe3RleHQgOiB0eHR9KTtcclxuICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mby50ZXh0ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8uaXNTdHVudEZvbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX2d1aWRlRHJvcEZvbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdHh0ID0gdGhpcy5fZ3VpZGVEcm9wRm9udHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IE1hcEZvbnRJbmZvLmNyZWF0ZSh7dGV4dCA6IHR4dH0pO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvLnRleHQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3NwbGl0Rm9udFdvcmRzLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KHRoaXMuX3NwbGl0Rm9udFdvcmRzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMuc3BsaWNlKHRoaXMuX3NwbGl0Rm9udFdvcmRzLmluZGV4T2YodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyksIDEpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9zcGxpdEdyb3VwV29yZHMubGVuZ3RoID4gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQodGhpcy5fc3BsaXRHcm91cFdvcmRzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzLnNwbGljZSh0aGlzLl9zcGxpdEdyb3VwV29yZHMuaW5kZXhPZih0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvKSwgMSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v5qC55o2u5b2T5YmN5qC85a2Q5pWw5Lul5Y+K5b2T5YmN5pif57qnIOiOt+W+l+S4gOS4quWbsOmavuezu+aVsCDmr5TlpoLmmK81MFxyXG4gICAgICAgIGxldCBrdW5OYW4gOiBudW1iZXIgPSB0aGlzLmdldE5hbkR1WGlTaHUoKSAqIHRoaXMuX215UGxheWVySW5mby5nZXRTdGFySW5mbyh0aGlzLl9zY29yZSkuc3BsaXRfcmF0ZTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gTWF0aC5taW4oMTAwLE1hdGguZmxvb3IodGhpcy5oZUNpenVSYXRlKmt1bk5hbi8xMDAwMCkpO1xyXG4gICAgICAgIGlmICh0aGlzLmdldFJhbmRvbVJlc3VsdChyZXN1bHQpKSB7IC8v6ZqP5py65Yiw5Ye65bem6L656K+N57uE55u45YWz6IGU5rGJ5a2XXHJcbiAgICAgICAgICAgIHRoaXMuaGFuWmlSYXRlICs9IDEwOyAvLyDmjqXkuIvmnaXlh7rnjrDml6DlhbPogZTmsYnlrZfmpoLnjofliqAxMFxyXG4gICAgICAgICAgICB0aGlzLmNpWnVSYXRlICs9IDEwIC8vIOaOpeS4i+adpeWHuueOsOaXoOWFs+iBlOaxieWtl+W5tuS4jjXliJfog73lkIjmiJDor43nmoTmpoLnjofliqAxMFxyXG4gICAgICAgICAgICB0aGlzLmhlQ2l6dVJhdGUgPSAxMDtcclxuICAgICAgICAgICAgaWYodGhpcy5fd29yZHMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVDaVNwbGl0VGltZXMgKys7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93b3JkcyA9IHRoaXMuc3BsaXRHcm91cFRvRm9udEluZm9zKHRoaXMuX3BvcHVsYXJHcm91cCxudWxsLCB0aGlzLmhlQ2lTcGxpdFRpbWVzID4gMiA/IFwic3BlY2lhbFwiOiBcImNvbW1lblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KHRoaXMuX3dvcmRzKTtcclxuICAgICAgICAgICAgdGhpcy5fd29yZHMuc3BsaWNlKHRoaXMuX3dvcmRzLmluZGV4T2YodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyksMSk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBcclxuICAgICAgICB0aGlzLmhlQ2l6dVJhdGUgKz0gMTU7XHJcbiAgICAgICAgbGV0IHRvcEZvbnRJbmZvcyA9IHRoaXMuZ2V0VG9wRm9udEluZm9zKCk7XHJcbiAgICAgICAgaWYodG9wRm9udEluZm9zLmxlbmd0aCA+IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdG9wRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQodG9wRm9udEluZm9zKSBhcyBNYXBGb250SW5mbztcclxuICAgICAgICAgICAgaWYodG9wRm9udEluZm8uY2FuSGVDaGVuZ0ZvbnQgJiYgdGhpcy5nZXRSYW5kb21SZXN1bHQgKHRoaXMuaGFuWmlSYXRlKmt1bk5hbi8xMDAwMCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL+maj+acuuWIsOimgei/m+ihjOWPr+axieWtl+aLhuWIhlxyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5aaVJhdGUgPSAyMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2ladVJhdGUgKz0gMTBcclxuICAgICAgICAgICAgICAgIGxldCBmb250SW5mb3MgPSB0b3BGb250SW5mby5jYW5IZUNoZW5nRm9udEluZm9zO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwbGl0Rm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQoZm9udEluZm9zKSBhcyBNYXBGb250SW5mbztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwbGl0Rm9udFdvcmRzID0gdGhpcy5zcGxpdEZvbnRUb0ZvbnRJbmZvcyhzcGxpdEZvbnRJbmZvLHRvcEZvbnRJbmZvLmlkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25leHREcm9waW5nRm9udEluZm8gPSB0aGlzLmdldFJhbmRvbUVsZW1lbnQodGhpcy5fc3BsaXRGb250V29yZHMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRGb250V29yZHMuc3BsaWNlKHRoaXMuX3NwbGl0Rm9udFdvcmRzLmluZGV4T2YodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyksIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0b3BGb250SW5mby5jYW5IZUNoZW5nR3JvdXAgJiYgdGhpcy5nZXRSYW5kb21SZXN1bHQgKHRoaXMuY2ladVJhdGUqa3VuTmFuLzEwMDAwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/pmo/mnLrliLDopoHov5vooYzmi4bliIbor43nu4RcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuWmlSYXRlICs9IDE1O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaVp1UmF0ZSA9IDEwXHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBzID0gdG9wRm9udEluZm8uY2FuSGVDaGVuZ0dyb3VwcztcclxuICAgICAgICAgICAgICAgIGxldCBzcGxpdEdyb3VwID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KGdyb3VwcykgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BsaXRHcm91cFdvcmRzID0gdGhpcy5zcGxpdEdyb3VwVG9Gb250SW5mb3Moc3BsaXRHcm91cCx0b3BGb250SW5mby50ZXh0LFwic3BcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0RHJvcGluZ0ZvbnRJbmZvID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KHRoaXMuX3NwbGl0R3JvdXBXb3Jkcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGxpdEdyb3VwV29yZHMuc3BsaWNlKHRoaXMuX3NwbGl0R3JvdXBXb3Jkcy5pbmRleE9mKHRoaXMuX25leHREcm9waW5nRm9udEluZm8pLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX25leHREcm9waW5nRm9udEluZm8gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaVp1UmF0ZSArPTEwO1xyXG4gICAgICAgIHRoaXMuaGFuWmlSYXRlICs9IDE1O1xyXG4gICAgICAgIC8v6ZqP5py65LuO5rGJ5a2X5bqT5oq95LiA5Liq5rGJ5a2XXHJcbiAgICAgICAgbGV0IGZvbnREYXRhQXJyID0gdGhpcy5nZXRSYW5kb21FbGVtZW50KE1hcEZvbnRJbmZvLkRhdGFTb3VyY2VbXCJmb250XCJdKTtcclxuICAgICAgICBsZXQgbWFwRm9udEluZm8gPSBNYXBGb250SW5mby5jcmVhdGUoKTtcclxuICAgICAgICBtYXBGb250SW5mby5zZXREYXRhQnlWYWx1ZUFycihmb250RGF0YUFycik7XHJcbiAgICAgICAgdGhpcy5fbmV4dERyb3BpbmdGb250SW5mbyA9IG1hcEZvbnRJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0VG9wRm9udEluZm9zKCkgOiBNYXBGb250SW5mb1tdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGNvdXQgPSBbXTtcclxuICAgICAgICBsZXQgZm9udCA9IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBpIDogbnVtYmVyID0gMDsgIGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA6IG51bWJlcj0gMCA7IGogIDwgdGhpcy5saXN0X2dyaWRzLnJlcGVhdFk7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZm9udHNbaV1bal0gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb250ID0gdGhpcy5fZm9udHNbaV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoZm9udCAhPW51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvdXQucHVzaChmb250KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBzdHIg6ZyA6KaB5ouG5YiG55qE5a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gc3BsaXRUeXBlIOaLhuWIhuaWueW8jyBjb21tZW7pmo/mnLrmi4bliIYgc3BjaWFs5LiN5ouG5YiGXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3BsaXRHcm91cFRvRm9udEluZm9zKHN0ciA6IHN0cmluZyxyZW1vdmVGb250VGV4dCA6IHN0cmluZyA9IG51bGwsc3BsaXRUeXBlIDogc3RyaW5nID0gXCJjb21tZW5cIik6TWFwRm9udEluZm9bXXtcclxuICAgICAgICBsZXQgY291dCA9IFtdXHJcbiAgICAgICAgc3RyLnNwbGl0KCcnKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBpZihlbGVtZW50ID09IHJlbW92ZUZvbnRUZXh0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogZWxlbWVudH0pO1xyXG4gICAgICAgICAgICBpZihmb250SW5mby5pZCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhY2sgZm9udDpcIiArIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHNwbGl0VHlwZSA9PSBcImNvbW1lblwiKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb3V0ID0gY291dC5jb25jYXQodGhpcy5zcGxpdEZvbnRUb0ZvbnRJbmZvcyhmb250SW5mbyxudWxsLHNwbGl0VHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvdXQucHVzaChmb250SW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBjb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3BsaXRGb250VG9Gb250SW5mb3MoZm9udFR4dCA6IHN0cmluZyB8IE1hcEZvbnRJbmZvLHJlbW92ZUZvbnRJZCA6IG51bWJlciA9IG51bGwsIHNwbGl0VHlwZSA6IHN0cmluZyA9IFwiY29tbWVuXCIpIDogTWFwRm9udEluZm9bXVxyXG4gICAge1xyXG4gICAgICAgIGxldCBmb250SW5mbyA6IE1hcEZvbnRJbmZvO1xyXG4gICAgICAgIGlmKGZvbnRUeHQgaW5zdGFuY2VvZiBNYXBGb250SW5mbylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvbnRJbmZvID0gZm9udFR4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHt0ZXh0IDogZm9udFR4dH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzcGxpdFR5cGUgIT0gXCJjb21tZW5cIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBbZm9udEluZm9dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY291dCA9IFtdO1xyXG4gICAgICAgIGxldCBzdHJ1Y3RJbmZvcyA9IGZvbnRJbmZvLnN0cnVjdEluZm8uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgIGxldCBzdHJ1Y3RJbmZvID0gc3RydWN0SW5mb3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3RydWN0SW5mb3MubGVuZ3RoKV07XHJcbiAgICAgICAgaWYoc3RydWN0SW5mbyA9PSBmb250SW5mby5pZC50b1N0cmluZygpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY291dC5wdXNoKGZvbnRJbmZvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0cnVjdEluZm8uc3BsaXQoXCJfXCIpLmZvckVhY2goZWxlbWVudDIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudDIgPT0gXCJcIiB8fCAocmVtb3ZlRm9udElkICE9IG51bGwgJiYgZWxlbWVudDIgPT0gcmVtb3ZlRm9udElkLnRvU3RyaW5nKCkpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBzcGxpdEZvbnRJbmZvID0gTWFwRm9udEluZm8uY3JlYXRlKHtpZCA6IGVsZW1lbnQyfSk7XHJcbiAgICAgICAgICAgICAgICBpZihzcGxpdEZvbnRJbmZvLmlkID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYWNrIGZvbnQgaWQ6XCIrIGVsZW1lbnQyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3V0LnB1c2goc3BsaXRGb250SW5mbyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291dDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0UmFuZG9tUmVzdWx0KHZhbDpudW1iZXIpOmJvb2xlYW57XHJcbiAgICAgICAgaWYgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDApPCB2YWwpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6Zq+5bqm57O75pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0TmFuRHVYaVNodSgpIDogbnVtYmVye1xyXG4gICAgICAgIGxldCBmb250R3JpZE51bSA6IG51bWJlciA9MDtcclxuICAgICAgICBmb3IobGV0IGkgPTA7IGkgPCB0aGlzLmxpc3RfZ3JpZHMucmVwZWF0WDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZOyBqICsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9mb250c1tpXVtqXSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRHcmlkTnVtICs9IHRoaXMubGlzdF9ncmlkcy5yZXBlYXRZIC0gajtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWFwRm9udEluZm8uRGF0YVNvdXJjZVtcImRlZ3JlZV9kaWZmaWN1bHR5XCJdW2ZvbnRHcmlkTnVtXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFJhbmRvbUVsZW1lbnQoYXJyKSA6IGFueXtcclxuICAgICAgICBpZihhcnIubGVuZ3RoID09IDApcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGxheWVyRWZmZWN0SW5kIDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcGxheUVmZmVjdEluYygpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9wbGF5ZXJFZmZlY3RJbmQgKys7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdHVlKEdhbWVTdGF0ZS5FZmZlY3RQYXVzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmRFZmZlY3RJbmMoKSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fcGxheWVyRWZmZWN0SW5kIC0tO1xyXG4gICAgICAgIGlmKHRoaXMuX3BsYXllckVmZmVjdEluZCA8MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXllckVmZmVjdEluZCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuX3BsYXllckVmZmVjdEluZCA9PSAwICYmIHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuRWZmZWN0UGF1c2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUdhbWVTdGF0dWUoR2FtZVN0YXRlLlBsYXlpbmcpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrU3lzRHJvcEZvbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N5c0Rpc3BlbEZvbnRJbmZvU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgaWYodGhpcy5fc3lzRHJvcGluZ0ZvbnRJbmZvcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnZva2VTdHVudEZvbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgU2VhcmNoSW5mbyB7XHJcbiAgICBwdWJsaWMgY3VycmVudFBvaW50ICA9IG5ldyBMYXlhLlBvaW50KCk7XHJcbiAgICBwdWJsaWMgY2hhcnMgOiBzdHJpbmdbXTtcclxuICAgIHByaXZhdGUgX29wZW5MaXN0IDogTGF5YS5Qb2ludFtdID0gW107XHJcbiAgICBwcml2YXRlIF9vcGVuT2JqID0ge307XHJcbiAgICBwcml2YXRlIF9zdXJlTGlzdCA6IExheWEuUG9pbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc3VyZU9iaiA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyBzZXRPcGVuTGlzdChwb2ludHMgOiBMYXlhLlBvaW50W10pIDogdm9pZHtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChlbGVtZW50PT57XHJcbiAgICAgICAgICAgIHRoaXMub3BlbihlbGVtZW50LngsZWxlbWVudC55KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldE9wZW5MaXN0KCkgOiBMYXlhLlBvaW50W11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3Blbkxpc3Q7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0U3VyZUxpc3QocG9pbnRzIDogTGF5YS5Qb2ludFtdKSA6IHZvaWR7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZWxlbWVudD0+e1xyXG4gICAgICAgICAgICB0aGlzLnN1cmUoZWxlbWVudC54LGVsZW1lbnQueSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRTdXJlTGlzdCgpIDogTGF5YS5Qb2ludFtde1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXJlTGlzdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvcGVuKHggOiBudW1iZXIgLHkgOiBudW1iZXIsIGlzT3BlbiA6IGJvb2xlYW4gPSB0cnVlKSA6IHZvaWR7XHJcbiAgICAgICAgbGV0IGtleSA9IHgudG9TdHJpbmcoKSArIFwiX1wiICsgeS50b1N0cmluZygpO1xyXG4gICAgICAgIGlmKGlzT3BlbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IG5ldyBMYXlhLlBvaW50KHgseSk7XHJcbiAgICAgICAgICAgIHRoaXMuX29wZW5MaXN0LnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9vcGVuT2JqW2tleV0gPSBwb2ludDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX29wZW5PYmpba2V5XSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vcGVuTGlzdC5zcGxpY2UodGhpcy5fb3Blbkxpc3QuaW5kZXhPZih0aGlzLl9vcGVuT2JqW2tleV0pLDEpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX29wZW5PYmpba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNPcGVuKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIGxldCBrZXkgPSB4LnRvU3RyaW5nKCkgKyBcIl9cIiArIHkudG9TdHJpbmcoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3Blbk9ialtrZXldICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1cmUoeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiB2b2lke1xyXG4gICAgICAgIGxldCBrZXkgPSB4LnRvU3RyaW5nKCkgKyBcIl9cIiArIHkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgcG9pbnQgPSBuZXcgTGF5YS5Qb2ludCh4LHkpO1xyXG4gICAgICAgIHRoaXMuX3N1cmVMaXN0LnB1c2gocG9pbnQpO1xyXG4gICAgICAgIHRoaXMuX3N1cmVPYmpba2V5XSA9IHBvaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc1N1cmUoeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBib29sZWFue1xyXG4gICAgICAgIGxldCBrZXkgPSB4LnRvU3RyaW5nKCkgKyBcIl9cIiArIHkudG9TdHJpbmcoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3VyZU9ialtrZXldICE9IG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi4vLi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgV1hUb29sIGZyb20gXCIuLi90b29sL1dYVG9vbFwiO1xyXG5pbXBvcnQgU2NlbmVNZ3IgZnJvbSBcIi4vU2NlbmVNZ3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lQmFzZSBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHByb3RlY3RlZCBfcG9wVXBTcHIgOiBMYXlhLlNwcml0ZTtcclxuICAgIHByaXZhdGUgX2FscGhhU3ByIDogTGF5YS5TcHJpdGU7XHJcbiAgICBwcml2YXRlIF9wb3BVcFNpZ24gOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9wb3BVcENvbnRlbnQgOiBMYXlhLlNwcml0ZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RpYWxvZ1NwciA6IExheWEuU3ByaXRlO1xyXG4gICAgcHJpdmF0ZSBfYWxwaGFEaWFsb2dTcHIgOiBMYXlhLlNwcml0ZTtcclxuICAgIHByaXZhdGUgX2RpYWxvZ0NvbnRlbnQgOiBMYXlhLlNwcml0ZTtcclxuXHJcbiAgICBvbkF3YWtlKCkgOiB2b2lke1xyXG4gICAgICAgIFNjZW5lTWdyLmN1clNjZW5lU2NyaXB0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNyZWF0ZVd4T3BlbkRhdGFWaWV3ZXIoKTtcclxuICAgICAgICBsZXQgYXJyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5vd25lcik7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGFyci5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBpZihlbGVtZW50LmluZGV4T2YoXCJfXCIpID09IC0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHRlbXBQcm9wZXJ0eVN0ciA9IGVsZW1lbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IHRlbXBQcm9wZXJ0eUxpc3QgPSB0ZW1wUHJvcGVydHlTdHIuc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICBzd2l0Y2godGVtcFByb3BlcnR5TGlzdFswXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImxpc3RcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0eHRcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJpbWdcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJidG5cIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGZbdGVtcFByb3BlcnR5U3RyXSA9IHNlbGYub3duZXJbdGVtcFByb3BlcnR5U3RyXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGFkZFBvcFVwKHNpZ24gOiBzdHJpbmcsIGNvbnRlbnQgOiBMYXlhLlNwcml0ZSB8IExheWEuQm94LCBpc0NlbnRlciA6IGJvb2xlYW4gPSB0cnVlLCBpc1Nob3dBbHBoYVNwciA6IGJvb2xlYW4gPSB0cnVlLCBpc0VuYWJsZUFscGhhQ2xvc2UgOiBib29sZWFuID0gZmFsc2UpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3BvcFVwU2lnbiA9IHNpZ247XHJcbiAgICAgICAgdGhpcy5fcG9wVXBDb250ZW50ID0gY29udGVudDtcclxuICAgICAgICBpZih0aGlzLl9wb3BVcFNwciA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9wVXBTcHIgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9wb3BVcFNwcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9wb3BVcFNwci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaXNDZW50ZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihjb250ZW50IGluc3RhbmNlb2YgTGF5YS5TcHJpdGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQueCA9IChHYW1lQ29uZmlnLndpZHRoIC0gY29udGVudC53aWR0aCkgLyAyO1xyXG4gICAgICAgICAgICAgICAgY29udGVudC55ID0gKEdhbWVDb25maWcuaGVpZ2h0IC0gY29udGVudC5oZWlnaHQpIC8gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LmNlbnRlclggPSAwO1xyXG4gICAgICAgICAgICAgICAgY29udGVudC5jZW50ZXJZID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc1Nob3dBbHBoYVNwcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2FscGhhU3ByID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByID0gbmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYVNwci53aWR0aCA9IEdhbWVDb25maWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYVNwci5oZWlnaHQgPSBHYW1lQ29uZmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByLmdyYXBoaWNzLmRyYXdSZWN0KDAsMCxHYW1lQ29uZmlnLndpZHRoLEdhbWVDb25maWcuaGVpZ2h0LFwiIzAwMDAwMFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByLmFscGhhID0gMC40O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wVXBTcHIuYWRkQ2hpbGQodGhpcy5fYWxwaGFTcHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihpc0VuYWJsZUFscGhhQ2xvc2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhU3ByLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcywgdGhpcy5oaWRlUG9wVXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5fYWxwaGFTcHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9hbHBoYVNwci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BvcFVwU3ByLmFkZENoaWxkKHRoaXMuX3BvcFVwQ29udGVudCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVQb3BVcCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuX3BvcFVwU3ByKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9wVXBTcHIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLl9wb3BVcENvbnRlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9wb3BVcENvbnRlbnQgPT0gdGhpcy5fZGF0YVZpZXdlcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9wVXBDb250ZW50LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3BVcENvbnRlbnQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BvcFVwU2lnbiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFkZERpYWxvZyhjb250ZW50IDogTGF5YS5TcHJpdGUsIGlzQ2VudGVyIDogYm9vbGVhbiA9IHRydWUsIGlzU2hvd0FscGhhU3ByIDogYm9vbGVhbiA9IHRydWUsIGlzRW5hYmxlQWxwaGFDbG9zZSA6IGJvb2xlYW4gPSBmYWxzZSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fZGlhbG9nQ29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgaWYodGhpcy5fZGlhbG9nU3ByID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kaWFsb2dTcHIgPSBuZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLl9kaWFsb2dTcHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlhbG9nU3ByLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc0NlbnRlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQueCA9IChHYW1lQ29uZmlnLndpZHRoIC0gY29udGVudC53aWR0aCkgLyAyO1xyXG4gICAgICAgICAgICBjb250ZW50LnkgPSAoR2FtZUNvbmZpZy5oZWlnaHQgLSBjb250ZW50LmhlaWdodCkgLyAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpc1Nob3dBbHBoYVNwcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2FscGhhRGlhbG9nU3ByID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByID0gbmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci53aWR0aCA9IEdhbWVDb25maWcud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci5oZWlnaHQgPSBHYW1lQ29uZmlnLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLmdyYXBoaWNzLmRyYXdSZWN0KDAsMCxHYW1lQ29uZmlnLndpZHRoLEdhbWVDb25maWcuaGVpZ2h0LFwiIzAwMDAwMFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLmFscGhhID0gMC40O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxwaGFEaWFsb2dTcHIubW91c2VFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLm1vdXNlVGhyb3VnaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlhbG9nU3ByLmFkZENoaWxkKHRoaXMuX2FscGhhRGlhbG9nU3ByKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoaXNFbmFibGVBbHBoYUNsb3NlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbHBoYURpYWxvZ1Nwci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsIHRoaXMuaGlkZURpYWxvZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLl9hbHBoYURpYWxvZ1Nwcil7XHJcbiAgICAgICAgICAgIHRoaXMuX2FscGhhRGlhbG9nU3ByLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGlhbG9nU3ByLmFkZENoaWxkKHRoaXMuX2RpYWxvZ0NvbnRlbnQpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlRGlhbG9nKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5fZGlhbG9nU3ByKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlhbG9nU3ByLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fZGlhbG9nQ29udGVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2RpYWxvZ0NvbnRlbnQgPT0gdGhpcy5fZGF0YVZpZXdlcilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlhbG9nQ29udGVudC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBXWFRvb2wuc2hvd0FsbEJ0bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RpYWxvZ0NvbnRlbnQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGF0YVZpZXdlciA6IExheWEuV1hPcGVuRGF0YVZpZXdlcjtcclxuICAgIHByaXZhdGUgY3JlYXRlV3hPcGVuRGF0YVZpZXdlcigpIDogdm9pZHtcclxuICAgICAgICBpZih0aGlzLl9kYXRhVmlld2VyID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlld2VyID0gbmV3IExheWEuV1hPcGVuRGF0YVZpZXdlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlld2VyLndpZHRoID0gNjEwO1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhVmlld2VyLmhlaWdodCA9IDc1NztcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVZpZXdlci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNob3dSYW5rKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2RhdGFWaWV3ZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZGF0YVZpZXdlci5wb3N0TXNnKHtjbWQgOiBcInJlZnJlc2hSYW5rTGlzdFwifSk7XHJcbiAgICAgICAgdGhpcy5hZGREaWFsb2codGhpcy5fZGF0YVZpZXdlcix0cnVlLHRydWUsdHJ1ZSk7XHJcbiAgICAgICAgV1hUb29sLmhpZGVBbGxCdG4oKTtcclxuICAgIH1cclxufSIsImltcG9ydCBTY2VuZUJhc2UgZnJvbSBcIi4vU2NlbmVCYXNlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZU1nciBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3VyU2NlbmVTY3JpcHQgOiBTY2VuZUJhc2U7XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVCcmlkZ2U0Mzk5IGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHVibGljIHN0YXRpYyBzaG93QmFubmVyQWQoYm8gOiBib29sZWFuKSA6IHZvaWR7XHJcbiAgICAgICAgdmFyIG9zID0gTGF5YS5Ccm93c2VyLndpbmRvdy5jb25jaENvbmZpZy5nZXRPUygpO1xyXG4gICAgICAgIHZhciBicmlkZ2U7XHJcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgIGlmIChvcyA9PSBcIkNvbmNoLWlvc1wiKSB7XHJcbiAgICAgICAgICAgIGJyaWRnZSA9IExheWEuQnJvd3Nlci53aW5kb3cuUGxhdGZvcm1DbGFzcy5jcmVhdGVDbGFzcyhcIkpTQnJpZGdlXCIpOy8v5Yib5bu66ISa5q2l5Luj55CGXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9zID09IFwiQ29uY2gtYW5kcm9pZFwiKSB7XHJcbiAgICAgICAgICAgIC8v6ZyA6KaB5a6M5pW055qE57G76Lev5b6E77yM5rOo5oSP5LiOaU9T55qE5LiN5ZCMXHJcbiAgICAgICAgICAgIGJyaWRnZSA9IExheWEuQnJvd3Nlci53aW5kb3cuUGxhdGZvcm1DbGFzcy5jcmVhdGVDbGFzcyhcImRlbW8uSlNCcmlkZ2VcIik7Ly/liJvlu7rohJrmraXku6PnkIZcclxuICAgICAgICB9IFxyXG4gICAgICAgIGlmIChvcyA9PSBcIkNvbmNoLWlvc1wiKSB7XHJcbiAgICAgICAgICAgIC8vaU9T5rOo5oSP5Ye95pWw562+5ZCN77yM5rOo5oSP5LiOQW5kcm9pZOeahOS4jeWQjFxyXG4gICAgICAgICAgICBicmlkZ2UuY2FsbChcInNldEJhbm5lckFkVmlzaWJsZTpcIixibylcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob3MgPT0gXCJDb25jaC1hbmRyb2lkXCIpIHtcclxuICAgICAgICAgICAgYnJpZGdlLmNhbGwoXCJzZXRCYW5uZXJBZFZpc2libGVcIixibyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsImltcG9ydCBVUkkgZnJvbSBcIi4uLy4uL1VSSVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291bmRUb29se1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5QmdNdXNpYygpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5TXVzaWMoVVJJLnNvdW5kVXJsICsgXCJiZ19tdXNpYy53YXZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5WGlhb0NodUVmZmVjdCgpIDogdm9pZHtcclxuICAgICAgICBMYXlhLlNvdW5kTWFuYWdlci5wbGF5U291bmQoVVJJLnNvdW5kVXJsICsgXCJ4aWFvY2h1LndhdlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXlIZUNoZW5nRWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChVUkkuc291bmRVcmwgKyBcImhlY2hlbmcud2F2XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheVRlSmlFZmZlY3QoKSA6IHZvaWR7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIucGxheVNvdW5kKFVSSS5zb3VuZFVybCArIFwidGVqaS53YXZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5WGlhSHVhRWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChVUkkuc291bmRVcmwgKyBcInhpYWh1YS53YXZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5WWlEb25nRWZmZWN0KCkgOiB2b2lke1xyXG4gICAgICAgIExheWEuU291bmRNYW5hZ2VyLnBsYXlTb3VuZChVUkkuc291bmRVcmwgKyBcInlpZG9uZy53YXZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3NvdW5kVm9sdW1lIDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTb3VuZFZvbHVtZSgpIDogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiBTb3VuZFRvb2wuX3NvdW5kVm9sdW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRTb3VuZFZvbHVtZSh2YWx1ZSA6IG51bWJlciA9IDAuMikgOiB2b2lke1xyXG4gICAgICAgIGlmKE51bWJlcltcImlzTmFOXCJdKHZhbHVlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gMC4yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTb3VuZFRvb2wuX3NvdW5kVm9sdW1lID0gdmFsdWU7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0U291bmRWb2x1bWUodmFsdWUpO1xyXG4gICAgICAgIExheWEuTG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzb3VuZFZvbHVtZVwiLCh2YWx1ZSAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX211c2ljVm9sdW1lIDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNdXNpY1ZvbHVtZSgpIDogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiBTb3VuZFRvb2wuX211c2ljVm9sdW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRNdXNpY1ZvbHVtZSh2YWx1ZSA6IG51bWJlciA9IDAuMikgOiB2b2lke1xyXG4gICAgICAgIGlmKE51bWJlcltcImlzTmFOXCJdKHZhbHVlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gMC4yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTb3VuZFRvb2wuX211c2ljVm9sdW1lID0gdmFsdWU7XHJcbiAgICAgICAgTGF5YS5Tb3VuZE1hbmFnZXIuc2V0TXVzaWNWb2x1bWUodmFsdWUpO1xyXG4gICAgICAgIExheWEuTG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtdXNpY1ZvbHVtZVwiLCh2YWx1ZSAqIDEwMCkudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgU291bmRUb29sLnNldFNvdW5kVm9sdW1lKHBhcnNlSW50KExheWEuTG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzb3VuZFZvbHVtZVwiKSkvMTAwKTtcclxuICAgICAgICBTb3VuZFRvb2wuc2V0TXVzaWNWb2x1bWUocGFyc2VJbnQoTGF5YS5Mb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm11c2ljVm9sdW1lXCIpKS8xMDApO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV1hUb29sIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2J0bnMgOiBhbnlbXSA9IFtdO1xyXG4gICAgcHVibGljIHN0YXRpYyBhZGRCdG4oYnRuIDogYW55KSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fYnRucy5wdXNoKGJ0bik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmVCdG4oYnRuIDogYW55KSA6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5fYnRucy5zbGljZSh0aGlzLl9idG5zLmluZGV4T2YoYnRuKSwxKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGhpZGVBbGxCdG4gKCkgOiB2b2lke1xyXG4gICAgICAgIHRoaXMuX2J0bnMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzaG93QWxsQnRuICgpIDogdm9pZHtcclxuICAgICAgICB0aGlzLl9idG5zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xuaW1wb3J0IERpYWxvZz1MYXlhLkRpYWxvZztcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xudmFyIFJFRzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XG5leHBvcnQgbW9kdWxlIHVpLnRlc3Qge1xyXG4gICAgZXhwb3J0IGNsYXNzIFRlc3RTY2VuZVVJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIHNjb3JlTGJsOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIHRpcExibGw6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcInRlc3QvVGVzdFNjZW5lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFJFRyhcInVpLnRlc3QuVGVzdFNjZW5lVUlcIixUZXN0U2NlbmVVSSk7XHJcbn1cciJdfQ==
