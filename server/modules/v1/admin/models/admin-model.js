const db = require("../../../../config/database")
const responsecode = require("../../../../utilities/response-error-code")

class AdminModel{

async createEvent (requestData,user_id){
try {
    // console.log(requestData)
        let insertQuery = `insert into tbl_event set ?`
//         `    INSERT INTO tbl_product (category_id, product_name, price, description, image)
//     VALUES (?, ?, ?, ?, ?)
//   `;
        let eventData = {
            user_id: user_id,
            event_title: requestData.event_title,
            start_time: requestData.start_time,
            end_time:requestData.end_time,
            city:requestData.city,
            category:requestData.category,
            description:requestData.description,
            cover_image:'https://placehold.co/600x400?text=Admin+created+Event',
            tips:requestData.tips,
            cultural_significance:requestData.cultural_significance,
            location:requestData.location,
           is_approved: 1,
              total_tickets:requestData.total_tickets,
               tickets_left:requestData.tickets_left,
               ticket_price:requestData.ticket_price
           
        }
        // console.log("event data inserted",eventData);
        
        let [response] = await db.query(insertQuery,[eventData])
        // console.log(insertQuery);
        
        // console.log(response);
        
        if(response.affectedRows!=0){
             return({
                code:responsecode.SUCCESS,
                message:{keyword:"Event created successfully"},
                data:null,
                status:200
             })
        }else{
                return({
                    code:responsecode.OPERATION_FAILED,
                    message:{keyword:"failed to add event"},
                    data:null,
                    status:202
                })
        }
    } catch (error) {
        console.log("modle error",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"server error"},
            data:null,
            status:500
        })
    }
}
async approveEvent(requestData) {
  try {
    // console.log(requestData);/
    
    const updateQuery = `UPDATE tbl_event SET is_approved = 1 WHERE id = ?`;

    const [response] = await db.query(updateQuery, [requestData.id]);

    if (response.affectedRows != 0) {
      return {
        code: responsecode.SUCCESS,
        message: { keyword: "Event approved successfully" },
        data: null,
        status: 200
      };
    } else {
      return {
        code: responsecode.OPERATION_FAILED,
        message: { keyword: "Event not found or already approved" },
        data: null,
        status: 404
      };
    }
  } catch (error) {
    console.log("approveEvent model error:", error.message);
    return {
      code: responsecode.SERVER_ERROR,
      message: { keyword: "server error" },
      data: null,
      status: 500
    };
  }
}

async deleteEvent(event_id){
    try {
        // console.log(event_id)
        let updatequery =`update tbl_event set is_deleted = 1 where id=?`
        let response = await db.query(updatequery,event_id.id)
        if(response.affectedRows !=0){
           return({
            code:responsecode.SUCCESS,
            message:{keyword:"txt_event_deleted"},
            data:null,
            status:200
           })
        }else{
             return({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"txt_deletion_failed"},
                data:null,
                status:400
             })
        }
    } catch (error) {
        console.log("modle error",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:null,
            status:500
        })
    }

} 
async userList(){ 
    try {
        let selectQuery = `SELECT 
  u.username, 
  u.id,
  u.is_active,
  u.is_deleted,
  GROUP_CONCAT(e.event_title SEPARATOR ', ') AS event_titles
FROM tbl_user u
LEFT JOIN tbl_event e ON u.id = e.user_id 
  AND e.is_active = 1 
  AND e.is_deleted = 0 
  AND e.is_approved = 1
WHERE u.is_active = 1 
  AND u.is_deleted = 0 
GROUP BY u.id;
`
const[response] = await db.query(selectQuery)
if(response){
return({
    code:responsecode.SUCCESS,
    message:{keyword:"user fetched"},
    data:response,
    status:200
})
}else{
    return({
        code:responsecode.OPERATION_FAILED,
        message:{keyword:"failed fetched"},
        data:null,
        status:400
    })
}
    } catch (error) {
        console.log("modle error",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:null,
            status:500
        })
    }
}
async deleteUser(user_id) {
  try {
    const updateQuery = `UPDATE tbl_user SET is_deleted = 1 WHERE id = ?`;
    const [response] = await db.query(updateQuery, [user_id.id]);

    if (response.affectedRows !== 0) {
      return {
        code: responsecode.SUCCESS,
        message: { keyword: "txt_user_deleted" },
        data: null,
        status: 200,
      };
    } else {
      return {
        code: responsecode.OPERATION_FAILED,
        message: { keyword: "txt_user_delete_failed" },
        data: null,
        status: 400,
      };
    }
  } catch (error) {
    console.log("model error (deleteUser):", error.message);
    return {
      code: responsecode.SERVER_ERROR,
      message: { keyword: "txt_server_error" },
      data: null,
      status: 500,
    };
  }
}
async blockUser(user_id) {
  try {
    console.log(user_id);
    
    const updateQuery = `UPDATE tbl_user SET is_active = 0 WHERE id = ?`;
    const [response] = await db.query(updateQuery, [user_id.id]);

    if (response.affectedRows !=0) {
      return {
        code: responsecode.SUCCESS,
        message: { keyword: "txt_user_blocked" },
        data: null,
        status: 200,
      };
    } else {
      return {
        code: responsecode.OPERATION_FAILED,
        message: { keyword: "txt_user_block_failed" },
        data: null,
        status: 400,
      };
    }
  } catch (error) {
    console.log("model error (blockUser):", error.message);
    return {
      code: responsecode.SERVER_ERROR,
      message: { keyword: "txt_server_error" },
      data: null,
      status: 500,
    };
  }
}

async unapprovedEvents(){
    try {
        // console.log('enterd');
        
        const selectQuery =`   SELECT e.id, e.event_title, e.category, e.start_time, u.username
      FROM tbl_event e
      JOIN tbl_user u ON u.id = e.user_id
      WHERE u.is_active = 1 AND u.is_deleted = 0 AND e.is_approved = 0 and e.is_deleted=0`
        const [response] = await db.query(selectQuery)
        console.log(response);
        
        if(response){
            if(response.length==0){
                return({
                    code:responsecode.CODE_NULL,
                    message:{keyword:"No events for approval"},
                    data:null,
                    status: 200
                })

            }
            // console.log(response);
            
            return(
                {
                code:responsecode.SUCCESS,
                message:{keyword:'Events found'},
                data:response,
                status:200
            })
        }
        else{return({
            code:responsecode.OPERATION_FAILED,
            message:{keyword:"no events found"},
            data:null,
            status:300
        })}
    } catch (error) {
        console.log("modle error",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:null,
            status:500
        })
    }
}
async getEventById(requestData) {
  try {
    const query = `SELECT * FROM tbl_event WHERE id = ? AND is_deleted = 0 and is_active=1`;
    const [response] = await db.query(query, [requestData.id]);
    if (response.length > 0) {
      return {
        code: responsecode.SUCCESS,
        message: { keyword: 'event_fetched' },
        data: response[0],
        status: 200
      };
    } else {
      return {
        code: responsecode.CODE_NULL,
        message: { keyword: 'event_not_found' },
        data: null,
        status: 300
      };
    }
  } catch (error) {
    console.log('model error', error.message);
    return {
      code: responsecode.SERVER_ERROR,
      message: { keyword: 'txt_server_error' },
      data: null,
      status: 500
    };
  }
}

// Update event
async updateEvent(requestData) {
  try {
    const updateQuery = `UPDATE tbl_event SET event_title = ?, category = ?, city = ?, location = ?, start_time = ?, end_time = ?, description = ?, tips = ?, cultural_significance = ?, cover_image = ? WHERE id = ?`;
    const updateValues = [
      requestData.event_title,
      requestData.category,
      requestData.city,
      requestData.location,
      requestData.start_time,
      requestData.end_time,
      requestData.description,
      requestData.tips,
      requestData.cultural_significance,
      requestData.cover_image,
      requestData.id
    ];

    const [response] = await db.query(updateQuery, updateValues);
    if (response.affectedRows !== 0) {
      return {
        code: responsecode.SUCCESS,
        message: { keyword: 'event_updated' },
        data: null,
        status: 200
      };
    } else {
      return {
        code: responsecode.OPERATION_FAILED,
        message: { keyword: 'update_failed' },
        data: null,
        status: 400
      };
    }
  } catch (error) {
    console.log('model error', error.message);
    return {
      code: responsecode.SERVER_ERROR,
      message: { keyword: 'txt_server_error' },
      data: null,
      status: 500
    };
  }
}


}module.exports = new AdminModel()