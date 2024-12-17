import dayjs from "dayjs";

export default function timeStyle( time: Date){
   return dayjs(time).format("YYYY-MM-DD hh:mm");
}