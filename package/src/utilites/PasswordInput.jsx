import {useState} from "react";
import hide from "/images/icons/hide.svg";
import show from "/images/icons/show.svg";

export default function PasswordInput({placeholder}) {
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(hide);
    const togglePassword = () => {
      if (type == "password") {
        setIcon(show);
        setType("text");
      } else {
        setIcon(hide);
        setType("password");
      }
    };
  return (
    <div>
      <div className="input-group">
        <input
          type={type}
          className="form-control"
          placeholder={placeholder}
          aria-label="password"
          aria-describedby="basic-addon1"
          id="password"
        />

        <span className="input-group-text" id="basic-addon1">
          <img
            src={icon}
            alt="eyeicon"
            className="img-fluid"
            onClick={togglePassword}
            style={{cursor :'pointer'}}
          />
        </span>
      </div>
      {/**input-group**/}
    </div>
  );
}
