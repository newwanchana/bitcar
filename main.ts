/*****************************************************************************
* | Description :	BitCar extension for micro:bit
* | Developer   :   CH Makered
* | More Info   :	http://chmakered.com/
******************************************************************************/

enum trick {
    //% block="arise"
    getUp,
    //% block=" +left"
    L_forward = AnalogPin.P14,
    //% block=" -right"
    R_backward = AnalogPin.P15,
    //% block=" +right"
    R_forward = AnalogPin.P16,
}

enum IRLineSensor {
    //% block="left sensor"
    left,
    //% block=" right sensor"
    right
}

/**
 * Provides access to BitCar blocks for micro: bit functionality.
 */
//% color=190 icon="\uf126" block= "BitCar"
//% groups="['Analog', 'Digital', 'I2C', 'Grove Modules']"
namespace BitCar {

    let L_backward = AnalogPin.P13;
    let L_forward = AnalogPin.P14;
    let R_forward = AnalogPin.P15; 
    let R_backward = AnalogPin.P16;

    /**
    * Set the motors' speed of BitCar
    */
    //% blockId=move
    //% block="BitCar left motor $left \\%, right motor$right \\%"
    //% left.shadow="speedPicker"
    //% right.shadow="speedPicker"
    export function move(left: number, right: number) {
        if (left >= 0) {
            pins.analogWritePin(L_backward, 0);
            pins.analogWritePin(L_forward, Math.map(left, 0, 100, 0, 1023));
        } else if (left < 0) {
            pins.analogWritePin(L_backward, Math.map(Math.abs(left), 0, 100, 0, 1023));
            pins.analogWritePin(L_forward, 0);
        }
        if (right >= 0) {
            pins.analogWritePin(R_backward, 0);
            pins.analogWritePin(R_forward, Math.map(right, 0, 100, 0, 1023));
        } else if (right < 0) {
            pins.analogWritePin(R_backward, Math.map(Math.abs(right), 0, 100, 0, 1023));
            pins.analogWritePin(R_forward, 0);
        }
    }

    /**
    * BitCar stop
    */
    //% blockId=stop
    //% block="BitCar stop"
    export function stop() {
        pins.analogWritePin(L_backward, 0);
        pins.analogWritePin(L_forward, 0);
        pins.analogWritePin(R_backward, 0);
        pins.analogWritePin(R_forward, 0);
    }

    /**
    * When BitCar is still, make it stand up from the ground and then stop, try to tweak the motor speed and the charge time if it failed to do so
    */
    //% blockId=standup_still
    //% block="BitCar: stand up with speed $speed \\% charge$charge|(ms)"
    //% speed.defl=100
    //% speed.min=0 speed.max=100
    //% charge.defl=250
    export function standup_still(speed: number, charge: number) {
        move(-speed, -speed);
        basic.pause(200);
        move(speed, speed);
        basic.pause(charge);
        stop();
    }


    /**
    * Check the state of the IR line sensor, the LED indicator is ON if the line is detected by the corresponding sensor
    */
    //% blockId=linesensor
    //% block="BitCar: line under $sensor|"
    export function linesensor(sensor: IRLineSensor): boolean {
        let result: boolean = false;

        if (sensor == IRLineSensor.left) {
            if (pins.analogReadPin(AnalogPin.P1) < 500) {
                result = true;
            }
        } else if (sensor == IRLineSensor.right) {
            if (pins.analogReadPin(AnalogPin.P2) < 500) {
                result = true;
            }
        }
        return result;
    }

    /**
    * Line following at a specified speed.
    */
    //% blockId=linefollow
    //% block="BitCar: follow line at speed $speed \\%"
    //% speed.defl=50
    //% speed.min=0 speed.max=100
    export function linefollow(speed: number) {
        if (linesensor(IRLineSensor.left) && linesensor(IRLineSensor.right)) {
            move(speed, speed);
        } else {
            if (!(linesensor(IRLineSensor.left)) && linesensor(IRLineSensor.right)) {
                move(speed, 0);
                if (!(linesensor(IRLineSensor.left)) && !(linesensor(IRLineSensor.right))) {
                    move(speed, 0);
                }
            } else {
                if (!(linesensor(IRLineSensor.right)) && linesensor(IRLineSensor.left)) {
                    move(0, speed);
                    if (!(BitCar.linesensor(IRLineSensor.left)) && !(BitCar.linesensor(IRLineSensor.right))) {
                        move(0, speed);
                    }
                }
            }
        }
    }
}