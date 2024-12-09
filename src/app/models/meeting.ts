export class Meeting {
    meeting_id:number;
    meeting_date:Date;
    meetingtype_id:number;
    meetingterm_id:number;
    meetingset_id:number;
    meeting_year:number;
    meeting_time:number;
    count_consulation:number;
    count_consulationtotal:number;
    create_date:Date;
    create_by:number;
    update_date:Date;
    update_by:number;
    public_date:Date;
    public_by:number;
    progressstatus_id:number;
    owner_id:number;
    
    //notmapped
    meetingtype_name:string;
    meetingterm_name:string;
    progressstatus_name:string;
}
