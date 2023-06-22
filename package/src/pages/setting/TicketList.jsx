import React, { useState, useEffect } from 'react'
import SettingWrapper from "../../utilites/SettingWrapper.jsx";
import { Link } from "react-router-dom";
import SwalClass from "../../Common/Swal";
import ReactPaginate from 'react-paginate';
import ApiClass from '../../api/api';

export default function TicketList() {


   var page = 1;
   var per_page = 2;
   const [currentItems, setCurrentItems] = useState([]);
   const [pageCount, perPageData] = useState(0);
   const [itemOffset, recordData] = useState(0);
   const [loading, setLoading] = useState(true);

   const loadPost = async (page) => {
      setLoading(true);
      var url = "ticket/get?page=" + page + "&per_page" + per_page;
      const response = await ApiClass.getRequest(url, true);
      if (response === undefined) {
         setLoading(false);
         SwalClass.error(response?.data?.message);
         return;
      }

      if (response?.data?.status_code == 0) {
         setLoading(false);
         SwalClass.error(response?.data?.message);
         return;
      }

      if (response?.data?.status_code == 1) {
         setLoading(false);
         setCurrentItems(response.data.data);
         perPageData(parseInt(response.data.data.last_page));
         recordData(parseInt(response.data.data.total));
         return;
      }
   }
   useEffect(() => {
      loadPost(page);
   }, []);

   const handlePageClick = (event) => {
      page = page + event.selected
      loadPost(page);
   };
   return (
      <div id="main">
         <div className="link_next p-4">
            <Link to="/support" className="text-capitalize mb-0 "><img src="../images/icons/back.svg" alt="back" className="img-fluid" /> back</Link>
         </div>
         <SettingWrapper heading="ticket list">
         {loading ?
               <div className="d-flex spinner_border  justify-content-center" >
                  <div className="spinner-border" role="status" >
                     <span className="visually-hidden">Loading...</span>
                  </div>
               </div>
               :
            <div className="ticket_table table-responsive">
               <table className="table text-center text-nowrap align-middle table-borderless">
                  <thead>
                     <tr>
                        <th scope="col" className="text-uppercase">S no.</th>
                        <th scope="col" className="text-uppercase">ticket type</th>
                        <th scope="col" className="text-uppercase">title</th>
                        <th scope="col" className="text-uppercase">name</th>
                        <th scope="col" className="text-uppercase">email</th>
                        <th scope="col" className="text-uppercase">ticket generated</th>
                        <th scope="col" className="text-uppercase">status</th>
                        <th scope="col" className="text-uppercase">action</th>
                     </tr>
                  </thead>
                  {
                     currentItems?.length > 0
                        ?
                        <tbody>
                           {currentItems.map((val, i) => {
                              return (
                                 <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{val.category.name}</td>
                                    <td>{val.title}</td>
                                    <td>{val.author_name}</td>
                                    <td>{val.author_email}</td>
                                    <td>{val.created_at}</td>
                                    <td>{val.status}</td>
                                    <td><Link to={`/ticketmodal/${val.id}`}><img src="../images/icons/show.svg" alt="text" className="img-fluid" /></Link></td>
                                 </tr>
                              )
                           })}
                        </tbody>
                        :
                        <tbody>
                           <tr>
                              <td colSpan={8} className="text-center text-uppercase">
                                 no tickets available
                              </td>
                           </tr>
                        </tbody>
                  }
               </table>
               {pageCount > 1 &&
                  <div className='d-flex justify-content-end'>
                     <div className="pagination " >
                        <ReactPaginate
                           breakLabel="..."
                           nextLabel=" >>"
                           onPageChange={handlePageClick}
                           pageRangeDisplayed={2}
                           pageCount={pageCount}
                           itemOffset={itemOffset}
                           previousLabel="<<"
                           renderOnZeroPageCount={null}
                           containerClassName={"pagination "}
                           pageClassName={"page-item"}
                           pageLinkClassName={"page-link  bg-transparent shadow-none"}
                           previousClassName={"page-item "}
                           previousLinkClassName={"page-link border-warning  shadow-none"}
                           nextClassName={"page-item"}
                           nextLinkClassName={"page-link border-warning  shadow-none"}
                           breakClassName={"page-item"}
                           breakLinkClassName={"page-link"}
                           activeClassName={"active bg-warning border-0"}
                        />
                     </div>
                  </div>
               }
            </div>
}
         </SettingWrapper>
      </div>
   );
}