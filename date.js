
module.exports.getDate= function (){
const today=new Date();
// var currentDayid=today.getDay();
// var currentDay=dayname[currentDayid];
// var typeOfDay="";
const options={
  day:"numeric",
  weekday:"long",
  month:"long"
}
return today.toLocaleDateString("en-US",options);
}

exports.getDay= function (){
const today=new Date();
// var currentDayid=today.getDay();
// var currentDay=dayname[currentDayid];
// var typeOfDay="";
const options={

  weekday:"long",

}
return today.toLocaleDateString("en-US",options);
}
