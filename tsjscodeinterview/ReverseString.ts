

  //1.   Reverse String code in TypeScript

 /* function RevString(str : string) :string{
   let rev: string="";
   for (let i =str.length-1; i>=0; i--){
      rev+=str[i];
   }    return rev;

}


console.log(RevString("vishnu")); //output:unhsiv    */


 function RevString(str : string) :string{
   let rev: string="";
   
   rev = str.split("").reverse().join("");
 
   return rev;

}


console.log(RevString("vishnu")); //output:unhsiv   









