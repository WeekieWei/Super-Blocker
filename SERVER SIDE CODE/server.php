<?php

  // POST https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyA5GSownEZH2erzLW7CcU9VSVOLoUtfpTE
  // Content-Type: application/json

  if(ISSET($_POST['url'])){
    $query_url = $_POST['url'];
} 

$body = '
 {
   "client": {
     "clientId":      "SuperBlocker",
     "clientVersion": "1.0"
   },
   "threatInfo": {
     "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING"],
     "platformTypes":    ["WINDOWS"],
     "threatEntryTypes": ["URL"],
     "threatEntries": [
       {"url": "'.$query_url.'"}
     ]
   }
 }';

  //echo $body;

  $api = "AIzaSyA5GSownEZH2erzLW7CcU9VSVOLoUtfpTE";

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=".$api);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
  $result = curl_exec($ch);
  

  if($result === FALSE){
    die(curl_error($ch));
  } else {
     echo $result;
  }


?>