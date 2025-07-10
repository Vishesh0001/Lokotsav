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
           is_approved: 1
           
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
async deleteEvent(event_id){
    try {
        // console.log(event_id)
        let updatequery =`update tbl_event set is_deleted = 1 where id=?`
        let response = await db.query(updatequery,event_id.productId)
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
        console.log("hhhhhhhhhhhhhhhhhhhhh");
        
        let selectQuery = `SELECT 
  u.username, 
  GROUP_CONCAT(e.event_title SEPARATOR ', ') AS event_titles
FROM tbl_user u
JOIN tbl_event e ON u.id = e.user_id
WHERE u.is_active = 1 
  AND u.is_deleted = 0 
  AND e.is_active = 1 
  AND e.is_deleted = 0 
  AND e.is_approved = 1
GROUP BY u.id;`
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
async unapprovedEvents(){
    try {
        // console.log('enterd');
        
        const selectQuery =`   SELECT e.id, e.event_title, e.category, e.start_time, u.username
      FROM tbl_event e
      JOIN tbl_user u ON u.id = e.user_id
      WHERE u.is_active = 1 AND u.is_deleted = 0 AND e.is_approved = 0`
        const [response] = await db.query(selectQuery)
        // console.log(response);
        
        if(response){
            if(response.length==0){
                return({
                    code:responsecode.CODE_NULL,
                    message:{keyword:"No events for approval"},
                    data:null,
                    status:300
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


}module.exports = new AdminModel()