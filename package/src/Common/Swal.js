import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.all.min.js'

export default class SwalClass {

    // Default Parameter
    static position = "top-end";
    static timer = "3000";
    static showConfirmButton = false;

    static success(message = "looking awesome!!") {

        Swal.fire({
            position: this.position,
            icon: 'success',
            text: message,
            showConfirmButton: this.showConfirmButton,
            toast: true,
            timer: this.timer
        })
    }

    static error(message = "looking awesome!!") {
        Swal.fire({
            position: this.position,
            icon: 'error',
            text: message,
            showConfirmButton: this.showConfirmButton,
            toast: true,
            timer: this.timer
        })
    }

    static warning(message = "looking awesome!!") {
        Swal.fire({
            position: this.position,
            icon: 'warning',
            text: message,
            showConfirmButton: this.showConfirmButton,
            toast: true,
            timer: this.timer
        })
    }
}

