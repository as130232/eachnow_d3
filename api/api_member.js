/*
    較特殊，新增假資料
    不跟routes.js混在一起，使用require('express').Router();
    於url:loalhost:8080/api(自己設定) 底下
*/
//router一樣可以處理get Request
var router = require('express').Router();


//import MemberBean
var Member = require('../app/models/member');

router.get('/insertMembers', function(req, res, next){

    //Member(table).find({設定篩選where條件(可空白)},callback(){找到where條件後的資料作對應的事})
    var maxInsertMemberSize = 500;
    Member.find({},function(error){
        if (error) {
            return next(error);
        }
        for (var i = 0; i < maxInsertMemberSize; i++) {  
            //建立Bean,並set屬性值
            var member = new Member();
            //會員Id數字部分總共要6碼，不足6碼前面補齊0
            var memNoLength = 6;
            var memNo = getSequenceMemberNo( (i+1), memNoLength)
            member.memberNo = 'memno' + memNo;
            
            member.name = getRandomName();
            member.gender = getRandomGender();
            member.birth = getRandomBirth();
            member.address = getRandomAddress();
            member.job = getRandomJob();
            member.save();
        }
        res.json({
            message: 'insert ' + maxInsertMemberSize + ' members success.'
        });
    });
});


module.exports = router;

function getSequenceMemberNo(number, length){
    //根據length長度將number前面補齊 '0'
    number = '' + number;
    if (number.length >= length) {
        return number;
    } else {
        return getSequenceMemberNo("0" + number, length);
    }

}

function getRandomName(){
    
    var firstNameArray = ['王','周','江','姜','黃','李','馬','蔡','吳','陳','陳','陳','陳','林','吳','葉','孫','謝','劉','曹','朱'];
    
    var secondNameArray = ['大','中','小','笨','樺','尹','聰','公','受','龍','虎','爭','使','洪','宏','鴻','建','爽','念','於','二','娘','包','乃','書','豪','君','文','勝','意','古','鴿','珍','貞','怡','慧','姍','祖','祥','友','盈','忠','萱','如','嫣','世','英','慈','言','玉','妤','淑','嵐','花','風','恩','伸','喬','全','誠','嫣','日','正','興','語','凡','杰','倫','美','香','琪','仁','天','水','華',''];
    
    var firstName = firstNameArray[createRandomValue(0,firstNameArray.length-1)];
    
    var secondName = secondNameArray[createRandomValue(0,secondNameArray.length-1)] 
                    + secondNameArray[createRandomValue(0,secondNameArray.length-1)];
    
    var result = firstName + secondName;
    
    return result;
    
}


function getRandomGender(){
    var gender = createRandomValue(0,1);
    if(gender == 0){
        return 'male';
    }else if(gender == 1){
        return 'female';
    }
    return 'gay';
}



function getRandomBirth(){
    var year = createRandomValue(1941,2000);
    var month = createRandomValue(1,12);
    var day = createRandomValue(1,30);
    
    return year + '/' + month + '/' + day;
}

function getRandomAddress(){
    var addressArray = ['台北市','台北市','台北市','台北市','台北市','台北市','台北市','新北市','新北市','新北市','新北市','桃園市','台中市','台中市','台中市','台中市','台南市','高雄市','高雄市','高雄市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣'];
    
    return addressArray[createRandomValue(0,addressArray.length-1)];
}

function getRandomJob(){
    var jobArray = ['醫生','護士','軍人','警察','老師','工程師','工程師','工程師','農夫','服務業','服務業','廚師','模特兒','設計師','藝術家','工人','無業遊民','律師','工具人','商人','商人'];
    return jobArray[createRandomValue(0,jobArray.length-1)];
}

function createRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}