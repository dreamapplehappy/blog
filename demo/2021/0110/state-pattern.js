// 状态模式
// 吹风机
class HairDryer {
    // 吹风机的状态
    state;
    // 关机状态
    offState;
    // 开机热风状态
    hotAirState;
    // 开机冷热风交替状态
    alternateHotAndColdAirState;
    // 开机冷风状态
    coldAirState;

    // 构造函数
    constructor(state) {
        this.offState = new OffState(this);
        this.hotAirState = new HotAirState(this);
        this.alternateHotAndColdAirState = new AlternateHotAndColdAirState(
            this
        );
        this.coldAirState = new ColdAirState(this);
        if (state) {
            this.state = state;
        } else {
            // 默认是关机状态
            this.state = this.offState;
        }
    }

    // 设置吹风机的状态
    setState(state) {
        this.state = state;
    }

    // 开关机按钮
    turnOnOrOff() {
        this.state.turnOnOrOff();
    }
    // 切换模式按钮
    switchMode() {
        this.state.switchMode();
    }

    // 获取吹风机的关机状态
    getOffState() {
        return this.offState;
    }
    // 获取吹风机的开机热风状态
    getHotAirState() {
        return this.hotAirState;
    }
    // 获取吹风机的开机冷热风交替状态
    getAlternateHotAndColdAirState() {
        return this.alternateHotAndColdAirState;
    }
    // 获取吹风机的开机冷风状态
    getColdAirState() {
        return this.coldAirState;
    }
}

// 抽象的状态
class State {
    // 开关机按钮
    turnOnOrOff() {
        console.log('---按下吹风机 [开关机] 按钮---');
    }
    // 切换模式按钮
    switchMode() {
        console.log('---按下吹风机 [模式切换] 按钮---');
    }
}

// 吹风机的关机状态
class OffState extends State {
    // 吹风机对象的引用
    hairDryer;
    constructor(hairDryer) {
        super();
        this.hairDryer = hairDryer;
    }
    // 开关机按钮
    turnOnOrOff() {
        super.turnOnOrOff();
        this.hairDryer.setState(this.hairDryer.getHotAirState());
        console.log('状态切换: 关闭状态 => 开机热风状态');
    }
    // 切换模式按钮
    switchMode() {
        console.log('===吹风机在关闭的状态下无法切换模式===');
    }
}

// 吹风机的开机热风状态
class HotAirState extends State {
    // 吹风机对象的引用
    hairDryer;
    constructor(hairDryer) {
        super();
        this.hairDryer = hairDryer;
    }
    // 开关机按钮
    turnOnOrOff() {
        super.turnOnOrOff();
        this.hairDryer.setState(this.hairDryer.getOffState());
        console.log('状态切换: 开机热风状态 => 关闭状态');
    }
    // 切换模式按钮
    switchMode() {
        super.switchMode();
        this.hairDryer.setState(
            this.hairDryer.getAlternateHotAndColdAirState()
        );
        console.log('状态切换: 开机热风状态 => 开机冷热风交替状态');
    }
}

// 吹风机的开机冷热风交替状态
class AlternateHotAndColdAirState extends State {
    // 吹风机对象的引用
    hairDryer;
    constructor(hairDryer) {
        super();
        this.hairDryer = hairDryer;
    }
    // 开关机按钮
    turnOnOrOff() {
        super.turnOnOrOff();
        this.hairDryer.setState(this.hairDryer.getOffState());
        console.log('状态切换: 开机冷热风交替状态 => 关闭状态');
    }
    // 切换模式按钮
    switchMode() {
        super.switchMode();
        this.hairDryer.setState(this.hairDryer.getColdAirState());
        console.log('状态切换: 开机冷热风交替状态 => 开机冷风状态');
    }
}

// 吹风机的开机冷风状态
class ColdAirState extends State {
    // 吹风机对象的引用
    hairDryer;
    constructor(hairDryer) {
        super();
        this.hairDryer = hairDryer;
    }
    // 开关机按钮
    turnOnOrOff() {
        super.turnOnOrOff();
        this.hairDryer.setState(this.hairDryer.getOffState());
        console.log('状态切换: 开机冷风状态 => 关闭状态');
    }
    // 切换模式按钮
    switchMode() {
        super.switchMode();
        this.hairDryer.setState(this.hairDryer.getHotAirState());
        console.log('状态切换: 开机冷风状态 => 开机热风状态');
    }
}

const hairDryer = new HairDryer();
// 打开吹风机
hairDryer.turnOnOrOff();
// 切换模式
hairDryer.switchMode();
// 切换模式
hairDryer.switchMode();
// 切换模式
hairDryer.switchMode();
// 关闭吹风机
hairDryer.turnOnOrOff();
// 吹风机在关闭的状态下无法切换模式
hairDryer.switchMode();
