import React from "react";
import ApiClass from "../../api/api";
import { useEffect, useState } from "react";
import { useRef } from "react";
 function P2pChatBox({ id, socket, UserId, OtherUserDetail, data }) {
  let x = document.getElementById("chat_id");
  //  console.log(socket,'check it')
  const [message, setMessage] = useState([]);
  const [msgData, setMsgData] = useState("");
  const [image, setImage] = useState(null)
  const [selimage, setSelImage] = useState(false)
  const [showImage, setShowImage] = useState({ type: "", val: "" })

  const imageRef = useRef();

  const showOpenFileDialog = () => {
    imageRef.current.click();
  };
  useEffect(() => {
    if (image !== null) {
      setSelImage(true)
    }
    if (image == null) {
      setSelImage(false)
    }
  }, [image])

  const onChange = e => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage([reader.result]);

    };
  };


  const ClearImage = () => {
    setImage(null)
    setSelImage(false)

  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (msgData.trim().length > 0 || image !== null) {
      // console.log(x,'check')
      x.scrollTo(0, document.getElementById("chat_id").scrollHeight);
      let data = {
        match_id: parseFloat(id),
        message: msgData,
        files: image,
      };
      socket.emit("sendMessage", data);
      // console.log(data,'chek it')
      setMessage(message => [...message, data]);
      setMsgData("")
      setImage(null)
      setSelImage(false)
    }
  }

  const MessageData = async () => {
    const result = await ApiClass.getNodeRequest(`P2P/chat/list?match_id=${id}`, true);
    if (result?.data?.status_code == 0) { return }
    let mess = result?.data?.data || []
    setMessage(mess);
  };

  useEffect(() => {
    MessageData();
  }, []);

  useEffect(() => {

    if (socket) {
      socket.on("getMessage", (data) => {
        setMessage(message => [...message, data]);
      });

      return () => {
        socket.off('getMessage', () => {
          console.log('message get socket disconnected');
        });
      };

    }

  }, [socket])


  useEffect(() => { x?.scrollTo(0, document.getElementById("chat_id").scrollHeight); }, [message])

  const showImg = (val, type) => {
    setShowImage({ val: val, type: type })
  }

  
  return (
    <>
      <div className="row justify-content-xl-end justify-content-center">
        <div className="col-md-9 col-lg-6 col-xl-8">
          {/* MAIN BOX */}
          <div className="main_chat_box rounded">
            {/* DEMONAME HEAD */}
            <div className="head p-2 rounded-top">
              <div className="user_name d-flex gap-md-5 gap-2 align-items-center">
                <h6 className="d-flex  align-items-center gap-md-3 gap-2">
                  <span className="text-uppercase">{OtherUserDetail?.name?.toUpperCase().split("", 1)}</span> {OtherUserDetail?.name}
                </h6>
                <span>Verified User</span>
              </div>
              {/* <div className="d-flex justify-content-around gap-md-3 gap-1">
                <div>
                  <p>30d Trades</p>
                  <h6>451</h6>
                </div>
                <div>
                  <p>30d Completion Rate</p>
                  <h6>90.93%</h6>
                </div>
              </div> */}
            </div>
            {/* CHAT BOX */}
            <div className="chat p-2" id="chat_id" style={{overflowY:'scroll'}}>
            <div className="chatbox_body mb-4" >
              <p className="text-center">{new Date(data?.order?.buyer?.updated_at).toLocaleString("en-GB")}</p>
              <div className="w-100 px-2 chatbox_image position-relative">
                  {message?.length > 0 && message?.map((val, i) =>
                  (
                    val.receiver_id == UserId ?
                      <div className="mb-2" key={i}>

                        {val?.message?.length > 0 &&
                          <div className="d-flex justify-content-start">
                            <div className="received rounded p-2" style={{ textOverflow: "ellipsis", maxWidth: '75%' }}>
                              <p className="mb-0 ">{val.message}</p>
                            </div></div>}
                        <img loading="lazy" data-bs-toggle="modal" data-bs-target="#chat-image-modal" onClick={() => { showImg( val.image,"url") }} 
                        src={`${ApiClass.nodeUrl}chatImages/${val.image}`} style={val.image ? {} : { display: "none" }} alt="charlie" className="img-fluid" width="150px" height="150px" />
                      </div>
                      : <div className="mb-2" key={i}>

                        {val?.message?.length > 0 &&
                          <div className="d-flex justify-content-end">
                            <div className="sent rounded p-2" style={{ textOverflow: "ellipsis", maxWidth: '75%' }}>
                              <p className="mb-0 ">{val.message}</p>
                            </div> </div>}
                        {val?.files ?
                          <div className="d-flex justify-content-end">
                            <img loading="lazy" data-bs-toggle="modal" data-bs-target="#chat-image-modal" onClick={() => { showImg( val.files,"file") }} src={val?.files} alt="charlie" className="img-fluid" width="150px" height="150px" />
                          </div>
                          :
                          <div className="d-flex justify-content-end">
                            <img loading="lazy" data-bs-toggle="modal" data-bs-target="#chat-image-modal" onClick={() => { showImg( val.image,"url") }} src={`${ApiClass.nodeUrl}chatImages/${val.image}`} style={val.image ? {} : { display: "none" }} alt="charlie" className="img-fluid" width="150px" height="150px" /></div>
                        }

                      </div>

                  ))}
                  {selimage && <div className="d-flex align-items-end overlap" > <div className="p-3 border rounded position-relative border-bottom-0 "><img src={image} width="100px" height="100px" /><button className="btn border-0 p-0 position-absolute" style={{ left: '2px', top: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" onClick={ClearImage}>
                      <g id="Group_30812" data-name="Group 30812" transform="translate(8410 1893)">
                        <circle id="Ellipse_13" data-name="Ellipse 13" cx="16" cy="16" r="16" transform="translate(-8410 -1893)" fill="#9d1212" />
                        <path id="Icon_metro-cross" data-name="Icon metro-cross" d="M15.481,12.4h0L11.528,8.442,15.481,4.49h0a.408.408,0,0,0,0-.576L13.613,2.047a.408.408,0,0,0-.576,0h0L9.085,6,5.133,2.047h0a.408.408,0,0,0-.576,0L2.69,3.914a.408.408,0,0,0,0,.576h0L6.642,8.442,2.69,12.395h0a.408.408,0,0,0,0,.576l1.867,1.867a.408.408,0,0,0,.576,0h0l3.952-3.953,3.952,3.953h0a.408.408,0,0,0,.576,0l1.867-1.867a.408.408,0,0,0,0-.576Z" transform="translate(-8403.57 -1885.928)" fill="#fff" />
                      </g>
                    </svg></button></div></div>}
                </div>
                </div>


            </div>
            {/* SEND MSG */}
            <div className="send_msg_box">

               

            
                 <form onSubmit={sendMessage}>
                 <div className="cht_msg_boc">
                  <div className="input-group mb-2">
                <input type="text" className="form-control rounded-0 border-0 shadow-none" value={msgData} placeholder="Write A Message....." id="myInput"  onInput={(e) => setMsgData(e.target.value)} aria-label="Username" aria-describedby="basic-addon1" />
                <span className="input-group-text rounded-0 border-0" id="basic-addon1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20.506" height="11.278" viewBox="0 0 20.506 11.278" id="trans" onClick={showOpenFileDialog}>
                  <path id="Icon_material-attachment" data-name="Icon material-attachment" d="M3,16.139A5.636,5.636,0,0,1,8.639,10.5H19.4a4.1,4.1,0,1,1,0,8.2H10.69a2.563,2.563,0,1,1,0-5.126h7.69v2.051H10.6c-.564,0-.564,1.025,0,1.025H19.4a2.051,2.051,0,0,0,0-4.1H8.639a3.589,3.589,0,1,0,0,7.177h9.74v2.051H8.639A5.636,5.636,0,0,1,3,16.139Z" transform="translate(-3 -10.5)" fill="#fff"/>
                </svg>
                <input
                        type="file"
                        ref={imageRef}
                        id="trans"
                        accept="image/*"
                        onInput={onChange}
                        hidden
                      />
                <svg xmlns="http://www.w3.org/2000/svg" onClick={sendMessage} width="26.712" height="26.127" viewBox="0 0 26.712 26.127">
                  <g id="Icon_feather-send" data-name="Icon feather-send" transform="translate(12.231 -2.825) rotate(42)">
                    <path id="Path_1973" data-name="Path 1973" d="M25.575,3,16.5,12.075" transform="translate(-6.075)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    <path id="Path_1974" data-name="Path 1974" d="M19.5,3,13.725,19.5l-3.3-7.425L3,8.775Z" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  </g>
                </svg>
                </span>
                </div>
                </div>
                </form>
            </div>
          </div>
        </div>
        <div className="modal fade modal-lg" id="chat-image-modal" tabIndex="-1" aria-labelledby="buy-sell-modalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border rounded-0 p-modal">
            <div className="modal-header position-relative border-bottom-0 p-0">
              <button type="button" className="btn p-0 border-0 position-absolute" data-bs-dismiss="modal" aria-label="Close" style={{ top: '-18px', right: '-17px', zIndex: '1' }}>
                <img src="/images/icons/modal_cross.svg" alt="" className="img-fluid" />
              </button>
            </div>
            <div className="modal-body p-0 p-body text-center">
              {showImage.type == "file" ? <img src={showImage.val} className="img-fluid" /> :<img src={`${ApiClass.nodeUrl}chatImages/${showImage.val}`} className="img-fluid" />}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
export default P2pChatBox;
