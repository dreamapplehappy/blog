function HairDryer() {
    // 定义内部状态 0:关机状态 1:开机状态
    this.isOn = 0;
    // 定义模式 0:热风 1:冷热风交替 2:冷风
    this.mode = 0;
}

// 定义吹风机的行为
// 切换吹风机的打开关闭状态
HairDryer.prototype.turnOnOrOff = function() {
    let { isOn, mode } = this;
    if (isOn === 0) {
        // 打开吹风机
        isOn = 1;
        console.log('吹风机的状态变为：[打开状态]，模式是：[热风模式]');
    } else {
        // 关闭吹风机
        isOn = 0;
        // 重置吹风机的模式
        mode = 0;
        console.log('吹风机的状态变为：[关闭状态]');
    }
    this.isOn = isOn;
    this.mode = mode;
};
// 切换吹风机的模式
HairDryer.prototype.switchMode = function() {
    const { isOn } = this;
    let { mode } = this;
    // 切换模式的前提是：吹风机是开启状态
    if (isOn === 1) {
        // 需要知道当前模式
        if (mode === 0) {
            // 如果当前是热风模式，切换之后就是冷热风交替模式
            mode = 1;
            console.log('吹风机的模式改变为：[冷热风交替模式]');
        } else if (mode === 1) {
            // 如果当前是冷热风交替模式，切换之后就是冷风模式
            mode = 2;
            console.log('吹风机的模式改变为：[冷风模式]');
        } else {
            // 如果当前是冷风模式，切换之后就是热风模式
            mode = 0;
            console.log('吹风机的模式改变为：[热风模式]');
        }
    } else {
        console.log('吹风机在关闭的状态下无法改变模式');
    }
    this.mode = mode;
};

const hairDryer = new HairDryer();
// 打开吹风机，切换吹风机模式
hairDryer.turnOnOrOff();
hairDryer.switchMode();
hairDryer.switchMode();
hairDryer.switchMode();
// 关闭吹风机，尝试切换模式
hairDryer.turnOnOrOff();
hairDryer.switchMode();
// 打开关闭吹风机
hairDryer.turnOnOrOff();
hairDryer.turnOnOrOff();
