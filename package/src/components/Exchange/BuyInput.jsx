import React from "react";
import exactMath from "exact-math";
import { useSelector } from "react-redux";
import Emitter from "../../event/Emitter.jsx";
function BuyInput({ inputJson, inputName, inputLable, FLABEL, formType }) {
  let IsLogin = useSelector((state) => (state.user.token ? true : false));
  const config = { returnString: true, eMinus: Infinity, ePlus: Infinity };

  let { handleChange, setKeyValue, getKeyValue, active, errors, touched,OT } =
    inputJson;

  let { currency, pair_with, decimal_pair, decimal_currency } = active;

  const onHandleKeyPress = (e, decimal) => {
    // ==============  Event charCode  =================
    // (DOT) = 46, backspace = 8, 0 =  48, 1 =  49, 2 =	50, 3 =	51, 4 =	52, 5 =	53, 6 =	54, 7 =	55, 8 =	56 , 9 = 57
    let res =
      e.charCode != 8 &&
      ((e.charCode >= 48 && e.charCode <= 57) ||
        (e.charCode == 46 && e.target.value.indexOf(".") == -1));
    if (e.charCode != 46 && e.target.value.indexOf(".") == -1) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }
    if (e.charCode == 46 && decimal > 0 && e.target.value.indexOf(".") == -1) {
      e.target.value = `${e.target.value.slice(
        0,
        e.target.selectionStart
      )}.${e.target.value
        .slice(e.target.selectionStart, e.target.value.length)
        .slice(0, decimal)}`;
      res = false;
    }
    if (decimal != null && res && e.target.value.indexOf(".") != -1) {
      res =
        e.target.value.split(".")[1].length < parseInt(decimal) ||
        e.target.value.slice(0, e.target.selectionStart).indexOf(".") == -1;
    }
    if (
      e.key == "0" &&
      (e.target.selectionStart == "0" || e.target.selectionStart == "1") &&
      e.target.value.indexOf(0) == "0"
    ) {
      e.preventDefault();
    }
    if (
      e.charCode != 46 &&
      e.charCode >= 48 &&
      e.charCode <= 57 &&
      e.target.value.slice(0, e.target.selectionStart) == 0 &&
      e.target.selectionStart == 1
    ) {
      e.target.value = `${e.key}${e.target.value.slice(
        e.target.selectionStart,
        e.target.value.length
      )}`;
      e.preventDefault();
    }
    // Only for Zero Decimal value of pair and currency
    if (e.charCode == 46 && decimal == 0) {
      e.preventDefault();
    }
    // if user directly entry dot without entering zero at zeroth place
    if (e.charCode == 46 && decimal > 0 && e.target.value == ".") {
      e.target.value = "0.";
      e.preventDefault();
    }

    //if value gt>1 does not enter 0 at zero index
    if (e.target.value > 1 && e.target.selectionStart == "0" && e.key == "0") {
      e.preventDefault();
    }
    return res ? res : e.preventDefault();
  };

  const onHandlePaste = (e, d) => {
    let vvv = e.clipboardData.getData("Text");

    if (isNaN(vvv)) {
      // if string
      e.preventDefault();
      return false;
    }

    vvv = Math.abs(vvv).toString();

    if (vvv.indexOf(".") == -1) {
      // if not include decimal
      e.target.value = vvv;
      e.preventDefault();
      return true;
    }

    if (vvv.indexOf(".") > -1) {
      if (d == 0) {
        vvv = vvv.replace(".", "").toString();
      }

      let s = d == 0 ? vvv.replace(".", "") : vvv.split(".");
      e.target.value = d == 0 ? s : `${s[0]}.${s[1].slice(0, d)}`;
      e.preventDefault();
      return false;
    }
  };

  const onHandleKeyUp = (e, key) => {
    if (
      (e.keyCode === 8 || e.keyCode == 46) &&
      !e.target.value.includes(".") &&
      e.target.value.indexOf("0") == 0
    ) {
      e.target.value = e.target.value != "" ? parseInt(e.target.value) : "";
    }

    if (
      (e.keyCode === 8 || e.keyCode == 46) &&
      e.target.value.includes(".") &&
      e.target.value.indexOf("0") == 0 &&
      e.target.selectionStart == 0
    ) {
      e.target.value = e.target.value != "" ? parseFloat(e.target.value) : "";
    }

    // set input value according to onchange.
    OnHandleInput(key);
  };

  const onHandleKeyDown = (e) => {
    // we are using it for stop ctrl+z
    if (e.ctrlKey && e.which === 90) {
      e.preventDefault();
      return false;
    }
  };

  const OnHandleInput = (k) => {
    let q = parseFloat(getKeyValue(FLABEL.quantity));
    let p = parseFloat(getKeyValue(FLABEL.at_price));
    let t = parseFloat(getKeyValue(FLABEL.total));

    // when change quantity Set Total Value
    if (k == FLABEL.quantity) {
      t = q > 0 && p > 0 ? exactMath.mul(p, q, config) : 0;
      setKeyValue(FLABEL.total, t);
    }

    // when change at_price Set quantity Value
    if (k == FLABEL.at_price || k == FLABEL.total) {
      q = p > 0 && t > 0 ? exactMath.div(t, p, config) : 0;
      setKeyValue(FLABEL.quantity, q);
    }
  };

  let d = inputName != FLABEL.quantity ? decimal_pair : decimal_currency;

  const inputFields = {
    type: "text",
    className: "form-control",
    id: inputName,
    name: inputName,
    "aria-describedby": inputName,
    onChange: handleChange,
    onKeyPress: (e) => onHandleKeyPress(e, d),
    onKeyUp: (e) => onHandleKeyUp(e, inputName),
    onKeyDown: (e) => onHandleKeyDown(e),
    onPaste: (e) => onHandlePaste(e, d),
    onDragOver: (e) => e.preventDefault(),
  };

  return (
    <>
      <div className="label-box mb-1" id="amount-label">
        <label className="input-label text-capitalize w-100  d-flex align-items-center justify-content-between">
          <span> {inputLable}</span>{" "}
          {inputLable == "At Price" && (
            <span
              className={`${
                formType.o_type == "buy" ? `text-success` : `text-danger`
              }`}
              style={{
                float: "right !important",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize:"14px",
                fontWeight:"500",
                cursor: "pointer",
            }}
            onClick={() =>
              Emitter.emit(
                  "event_price_handle",
                  formType.o_type == OT.OBV ? "l" : "h"
              )
          }
            >
              {" "}
              {formType.o_type == "buy" ? "Lowest" : "Highest"} Price
            </span>
          )}
        </label>
      </div>
      <div className="input-group mb-1">
        <input {...inputFields} />
        {console.log(inputFields,"---->>>>>>>>")}
        <span className="input-group-text" id={`aria_${inputName}`}>
          {inputName != FLABEL.quantity ? pair_with : currency}
        </span>
      </div>
      {IsLogin
        ? errors[inputName] &&
          touched[inputName] && (
            <span style={{ color: "red" }}>{errors[inputName]}</span>
          )
        : ""}
    </>
  );
}

export default BuyInput;
