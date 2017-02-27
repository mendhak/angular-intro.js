/// <reference types="intro.js" />
declare namespace ngIntroJs {
    interface INgIntroService {
        intro: IntroJs.IntroJs;
        addListener(name: string, callback: Function): void;
        removeListener(name: string): void;
        setOptions: IntroJs.Options;
        start(stepId?: number): IntroJs.IntroJs;
        exit(): IntroJs.IntroJs;
        clear(callback: Function): IntroJs.IntroJs;
        addHints(): IntroJs.IntroJs;
        showHint(hintIdx: number): IntroJs.IntroJs;
        showHints(): IntroJs.IntroJs;
        hideHint(hintIdx: number): IntroJs.IntroJs;
        hideHints(): IntroJs.IntroJs;
        previous(): IntroJs.IntroJs;
        next(): IntroJs.IntroJs;
        refresh(): IntroJs.IntroJs;
        onComplete(callback: Function): void;
        onExit(callback: Function): void;
        onBeforeChange(callback: Function): void;
        onAfterChange(callback: Function): void;
        onChange(callback: Function): void;
        onHintClick(callback: Function): void;
        onHintClose(callback: Function): void;
        onHintsAdded(callback: Function): void;
    }
    interface INgIntroDirectiveScope extends ng.IScope {
        ngIntroMethod(step?: number): void;
        ngIntroExitMethod(cb?: Function): void;
        ngIntroNextMethod(): void;
        ngIntroPreviousMethod(): void;
        ngIntroRefreshMethod(): void;
        ngIntroOptions(): void;
        ngIntroOncomplete(): void;
        ngIntroOnexit(): void;
        ngIntroOnchange(): void;
        ngIntroOnbeforechange(): void;
        ngIntroOnafterchange(): void;
        ngIntroAutostart(): void;
        ngIntroAutorefresh(): void;
        ngIntroHintsMethod(): void;
        ngIntroOnhintsadded(): void;
        ngIntroOnhintclick(): void;
        ngIntroOnhintclose(): void;
        ngIntroShowHint(id: number): void;
        ngIntroShowHints(): void;
        ngIntroHideHint(id: number): void;
        ngIntroHideHints(): void;
    }
    interface NotifyItem {
        [name: string]: Function;
    }
}
