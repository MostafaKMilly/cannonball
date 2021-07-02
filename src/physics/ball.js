import vector from './vector'
import * as THREE from 'three'
import { Matrix3, Matrix4, Vector3 } from 'three'
import { pipe } from 'gsap/gsap-core'

class Ball {

    constructor(position, speed, angleXY, angleXZ, raduis, type, mass, drag_coeff,
        angular_velocity, resistanse_coeff, friction_coeff) {
        let a = vector.create(3, -3, 1)
        let b = vector.create(4, 9, 2)
        console.log(a.cross(b))
        this.position = position;
        this.velocity = vector.create(0, 0, 0)
        this.velocity.inits(speed, angleXY, angleXZ)
        this.type = type
        this.drag_coeff = drag_coeff
        this.resistanse_coeff = resistanse_coeff
        this.friction_coeff = friction_coeff
        this.raduis = raduis; //m  -----------------------------------
        this.rho = 0;
        if (this.type == 1) {
            this.rho = 500; // kg/m^3  wood
            this.resistanse_coeff = 0.4
            this.friction_coeff = 0.603
            console.log("type is wood")
        }
        else if (this.type == 2) {
            this.rho = 7860; // steel
            this.resistanse_coeff = 0.597
            this.friction_coeff = 0.7
            console.log("type is steel")

        }
        else if (this.type == 3) {
            this.rho = 1100; // rubber
            this.resistanse_coeff = 0.828
            this.friction_coeff = 0.35
            console.log("type is rubber")

        }
        if (this.type == 0) { // user value
            this.mass = mass
        }
        else {
            this.mass = this.rho * (4 / 3)* Math.PI * Math.pow(this.raduis, 3); //kg //
        }
        //this.mass=0.035
        this.area = Math.PI * Math.pow(this.raduis, 2);
        console.log(this.area, " ", Math.pow(this.raduis, 3))
        console.log("mass " + this.mass, " rho " + this.rho + " raduis " + this.raduis)
        //rotation
        this.rotateAngle = 0
        this.rotateAxes = vector.create(angular_velocity.getX() > 0 ? 1 : 0, angular_velocity.getY(), angular_velocity.getZ())
        this.angular_velocity = angular_velocity
        this.angular_acc = new Vector3()
    }


  
    update(time, gravity, height, tempereture, wind_speed, wind_angle) {
        
        let gravityForce = this.gravity_force(gravity);
        let air_rho = this.calc_air_rho(gravity, height, tempereture)
        let wind_velo = this.calc_wind_velo(wind_speed, wind_angle)

        //   let dragForce = vector.create(0, 0, 0); 
        let dragForce = this.drag_force(air_rho);

        //   let windForce = vector.create(0, 0, 0);
        let windForce = this.wind_force(air_rho, wind_velo);


        // let liftForce = vector.create(0, 0, 0);
        let liftForce = this.lift_force(air_rho);
    
        let totalForce = vector.create(dragForce.getX() + windForce.getX() + liftForce.getX(),
            gravityForce.getY() + dragForce.getY() + liftForce.getY(),
            dragForce.getZ() + windForce.getZ() + liftForce.getZ());
        let acc = vector.create(totalForce.getX() / this.mass, totalForce.getY() / this.mass, totalForce.getZ() / this.mass)

        this.velocity.addTo(acc, time);

        this.position.x += (this.velocity.getX() * time * 10)
        this.position.y += (this.velocity.getY() * time * 10)
        this.position.z -= (this.velocity.getZ() * time * 10)
      
        this.calc_angular_acc(gravity, air_rho, wind_velo)
      
        this.rotateAngle += this.angular_velocity.getLength() * time

        this.angular_velocity.setX(this.angular_velocity.getX() + Number(this.angular_acc.x).toFixed(7) * time)
        this.angular_velocity.setY(this.angular_velocity.getY() + Number(this.angular_acc.y).toFixed(7) * time)
        this.angular_velocity.setZ(this.angular_velocity.getZ() + Number(this.angular_acc.z).toFixed(7) * time)
        // console.log("angular_acc " + Number(this.angular_acc.x).toFixed(7)+ " "+ Number(this.angular_acc.y).toFixed(7)+ " "+Number(this.angular_acc.z).toFixed(7))
        // console.log("angular_VILO " +this.angular_velocity.getX()+ " "+ this.angular_velocity.getY()+ " "+ this.angular_velocity.getZ() + "")

        //another porjectile 
        this.bouncing()
       
    }


    gravity_force(gravity) {
        return vector.create(0, - gravity * this.mass, 0)
    }

    drag_force(rho) {
        let velocitySquere = this.velocity.squere()

        let normalize = this.velocity.normalize()
        let drag = vector.create(
            velocitySquere * -1 / 2 * this.drag_coeff * rho * this.area * normalize.getX(),
            velocitySquere * -1 / 2 * this.drag_coeff * rho * this.area * normalize.getY(),
            velocitySquere * -1 / 2 * this.drag_coeff * rho * this.area * normalize.getZ()
        )
        return drag
    }

    wind_force(rho, wind_velo) {

        let velocitySquere = wind_velo.squere()
        let normalize = wind_velo.normalize()

        let wind = vector.create(
            velocitySquere * 1 / 2 * rho * this.area * normalize.getX(),
            0,
            velocitySquere * 1 / 2 * rho * this.area * normalize.getZ()
        )
        return wind
    }

    lift_force(rho) {
      
        let lift_coeff = -0.05 + Math.sqrt(0.0025 + 0.36 * this.raduis * this.angular_velocity.getLength() / this.velocity.getLength())  // cl=r*ω/v

        // let velo = vector.create(this.velocity.getX() - wind_velo.getX(),
        //     this.velocity.getY() - wind_velo.getY(),
        //     this.velocity.getZ() - wind_velo.getZ())

        let velocitySquere = this.velocity.squere()
        //todo:: hhhh check that

        let cross = this.rotateAxes.cross(this.velocity)
      
        let lift = vector.create(
            velocitySquere * 1 / 2 * lift_coeff * rho * this.area * cross.getX(),
            - velocitySquere * 1 / 2 * lift_coeff * rho * this.area * cross.getY(),
            velocitySquere * 1 / 2 * lift_coeff * rho * this.area * cross.getZ()
        )
        return lift

    }

    calc_air_rho(g, H, T) {

        let Rspecific = 287.058, R = 8.3148, Md = 0.028964
        let P0 = 1.01325;// 1bar =100000pa  
        let Tkelvin = T + 273.15
        let P = P0 * Math.exp(- Md * g * H / (R * Tkelvin)) * Math.pow(10, 5);
        let rho = P / (Rspecific * Tkelvin);
        //  console.log("rho "+rho+" T "+Tkelvin+" H "+H+" P "+P)
        return rho;
    }

    calc_wind_velo(wind_speed, wind_angle) {
        return vector.create(Number(Math.cos(wind_angle).toFixed(2)) * wind_speed, 0, Math.sin(wind_angle) * wind_speed)
    }

    rotate() {
        let matrix = new Matrix4()
        let axes = new Vector3(this.rotateAxes.getX() > 0 ? 1 : 0, this.rotateAxes.getY() > 0 ? 1 : 0, this.rotateAxes.getZ() > 0 ? 1 : 0)
        matrix.makeRotationAxis(axes, this.rotateAngle)
        return matrix
    }

    bouncing() {
        if (this.position.y < 3.0) {
            this.position.y = 3.0
            this.velocity._y *= -this.resistanse_coeff

         //   console.log(this.position)
        }
    }

    calc_angular_acc2(lift_force, time) {
        let i = (2 / 5) * this.mass * Math.pow(this.raduis, 2)
        let v = vector.create(-lift_force.getX(), -lift_force.getY(), -lift_force.getZ())
        // let newXz = lift_force.getAngleXZ()+(Math.PI/2)
        // let newXy = lift_force.getAngleXY() +(Math.PI/2)
        let len1 = time * this.angular_velocity.getLength()
        let len2 = (-8 * this.raduis * this.raduis * this.raduis * Math.PI * 18.27) / i
        let len = len1 * len2
        // v.inits(len,newXy ,newXz)
        v.setLength(len)
        this.angular_acc = new THREE.Vector3(v.getX(), v.getY(), v.getZ())
    }

    viscousTorque() {
        let i = (2 / 5) * this.mass * Math.pow(this.raduis, 2)
        let v = vector.create(-this.angular_velocity.getX(), -this.angular_velocity.getY(), -this.angular_velocity.getZ())
        let len = (this.angular_velocity.getLength() * -8 * this.raduis * this.raduis * this.raduis * Math.PI * 0.0000185) / i
        v.setLength(len)
      //  console.log("viscousTorque " + v.getX() + " "  + v.getY() + " " + v.getZ())
        return vector.create(v.getX(), v.getY(), v.getZ())
    }

    calc_angular_acc(gravity, air_rho, wind_velo) {
        let I = 2 / 5 * this.mass * Math.pow(this.raduis, 2)
        let interia_ball = new Matrix3()//ibody
        interia_ball.set(I, 0, 0,
            0, I, 0,
            0, 0, I).invert()
        let rotateMatrix = new Matrix3()//R 
        rotateMatrix.setFromMatrix4(this.rotate())
        let transposeRotate = new Matrix3()

        transposeRotate.setFromMatrix4(this.rotate()).transpose()
      
        let interia = new THREE.Matrix3().multiply(transposeRotate).multiply(interia_ball).multiply(rotateMatrix)
              
        let friction_torque
        if (this.position.y <= 3) {
            friction_torque = this.torque_friction(gravity)
        }
        else friction_torque = 0

        let viscousTorque = this.viscousTorque()
      
        let torque = new Vector3(friction_torque - viscousTorque.getX(),
            friction_torque - viscousTorque.getY(),
            friction_torque - viscousTorque.getZ())
          
        this.angular_acc = torque.applyMatrix3(interia)
    
    }


    torque_friction(gravity) {
        return this.mass * gravity * this.friction_coeff * this.raduis
    }
}
export default Ball

