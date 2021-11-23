var express = require('express');
var router = express.Router();

var mysql = require('mysql');
const fileUpload = require('express-fileupload');
let exec = require('child_process').exec;
var bodyParser = require('body-parser');
// Import End.

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json({limit: 500000}));
router.use(fileUpload({ createParentPath: true }));

// MySQL Connection
var info = mysql.createConnection({
    host     : '********',
    user     : '********',
    password : '********',
    database : '********'
});
info.connect();
// Connection End.

const BASE_DIR = __dirname;

// Parameter : 없음
// Method: Post
// Response: 모든 강의를 가져온다.
router.post("/api/lectures", (req, res) => {
    info.query("select * from lecture", (err, results, f)=>{
        if(err) throw err;

        res.json({"results": results});
    });
});

// Parameter : id(int, lecture의 고유 id)
// Method: Post
// Response: 강의 id를 통해 강의를 찾는다.
router.post("/api/lectureInfo", (req, res) => {
    var id = req.body.id;

    ret = {}

    info.query("select * from hashtag where lectureId=?", [id], (err, results, f)=>{
        if(err) throw err;

        ret['hashtag'] = results;

        info.query("select * from lecture where id=?", [id], (err, results, f)=>{
            if(err) throw err;

            ret['lectureName'] = results[0].lectureName;
            ret['lectureIntro'] = results[0].lectureIntro;
            ret['id'] = results[0].id;
            ret['lecturerId'] = results[0].lecturerId;

            res.json(ret);
        });
    });
});

// Parameter : parentCategoryId(int, 부모 카테고리의 고유 id)
// Method: Post
// Response: 부모 카테고리를 이용하여 강의를 찾는다.
router.post("/api/findLectures/category/parent", (req, res) => {
    var parentCategoryId = req.body.parentCategoryId;

    info.query("select * from lecture where parentCategoryId=?", [parentCategoryId], (err, results, f)=>{
        if(err) throw err;
        
        res.json(results);
    });
});

// Parameter : childCategoryId(int, 자식 카테고리의 고유 id)
// Method: Post
// Response: 자식 카테고리를 이용하여 강의를 찾는다.
router.post("/api/findLectures/category/child", (req, res) => {
    var childCategoryId = req.body.childCategoryId;

    info.query("select * from lecture where childCategoryId=?",
        [childCategoryId], (err, results, f)=>{
        if(err) throw err;
        
        res.json(results);
    });
});

// Parameter : lecturerId(String), lectureName(String), lectureIntro(String), hashtag(array[string]),
//             parentCategoryId(int, 부모 카테고리의 고유 id), childCategoryId(int, 자식 카테고리의 고유 id)
// Method: Post
// Response: 입력된 정보를 통해 강의를 만든다.
router.post("/api/makeLecture", (req, res) => {
    var lecturerId = req.body.lecturerId;
    var lectureName = req.body.lectureName;
    var lectureIntro = req.body.lectureIntro;
    var hashtag = req.body.hashtag;
    var parentCategoryId = req.body.parentCategoryId;
    var childCategoryId = req.body.childCategoryId;

    info.query("insert into lecture(lectureName, lectureIntro, lecturerId, parentCategoryId, childCategoryId) values (?, ?, ?, ?, ?)",
        [lectureName, lectureIntro, lecturerId, parentCategoryId, childCategoryId],(err, results, f)=>{
        if(err) throw err;

        var id = results.insertId;

        for(var i = 0; i < hashtag.length; i++){
            var now = hashtag[i];

            info.query("insert into hashtag(hashtagName, lectureId) values (?, ?)", [now, id], (err, results, f)=>{
                if(err) throw err;
            });
        };

        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter : id(int, lecture의 고유 id)
// Method: Post
// Response: 강의 id를 통해 강의를 삭제한다.
router.post("/api/deleteLecture", (req, res) => {
    var id = req.body.id;

    info.query("delete from lecture where id=?", [id], (err, results, f)=>{
        if(err) throw err;

        info.query("delete from hashtag where id=?", [id], (err, results, f)=>{
            if(err) throw err;

            info.query("delete from section where lectureId=?", [id], (err, results, f)=>{
                if(err) throw err;

                info.query("delete from section where lectureId=?", [id], (err, results, f)=>{
                    if(err) throw err;
            
                    exec('rm -rf ' + BASE_DIR + '/contents/' + id, (err, out, stderr)=>{
                        if(err) throw err;
                
                        exec('rm -rf ' + BASE_DIR + '/files/' + id, (err, out, stderr)=>{
                            if(err) throw err;
                
                            info.query("delete from contents where lectureId=?", [id], (err, results, f)=>{
                                if(err) throw err;
                        
                                info.query("delete from classFile where lectureId=?", [id], (err, results, f)=>{
                                    if(err) throw err;
                            
                                    info.query("delete from myLectures where lectureId=?", [id], (err, results, f)=>{
                                        res.json({
                                            "stateCode": 200,
                                            "state": "Success"
                                        });
                                    })
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Parameter : id(int, 수정하고 싶은 강의의 고유 id), lecturerId(String), lectureName(String), lectureIntro(String), hashtag(array[string]),
//             parentCategoryId(int, 부모 카테고리의 고유 id), childCategoryId(int, 자식 카테고리의 고유 id)
// Method: Post
// Response: 입력된 정보를 통해 강의를 수정한다.
router.post("/api/updateLecture", (req, res) => {
    var id = req.body.id;
    var lectureName = req.body.lectureName;
    var lectureIntro = req.body.lectureIntro;
    var lecturerId = req.body.lecturerId;
    var hashtag = req.body.hashtag;
    var parentCategoryId = req.body.parentCategoryId;
    var childCategoryId = req.body.childCategoryId;

    info.query("update lecture set lectureName=?, lectureIntro=?, lecturerId=?, parentCategoryId=?, childCategoryId=? where id=?",
        [lectureName, lectureIntro, lecturerId, parentCategoryId, childCategoryId, id],(err, results, f)=>{
        if(err) throw err;
        
        info.query("delete from hashtag where lectureId=?", [id], (err, results, f)=>{
            if(err) throw err;

            for(var i = 0; i < hashtag.length; i++){
                var now = hashtag[i];
    
                info.query("insert into hashtag(hashtagName, lectureId) values (?, ?)", [now, id], (err, results, f)=>{
                    if(err) throw err;

                });
            };

            res.json({
                "stateCode": 200,
                "state": "Success"
            });
        });
    });
});

// Parameter : id(int, lecture의 고유 id), sectionName(String)
// Method: Post
// Response: lecture의 고유 아이디를 통해 Section을 등록한다.
router.post("/api/makeSection", (req, res) => {
    var id = req.body.id;
    var sectionName = req.body.sectionName;

    info.query("insert into section(lectureId, sectionName) values (?, ?)", [id, sectionName],(err, results, f)=>{
        if(err) throw err;

        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter : id(int, lecture의 고유 id)
// Method: Post
// Response: lecture의 고유 아이디를 통해 Section을 조회한다.
router.post("/api/viewSections", (req, res) => {
    var id = req.body.id;

    info.query("select * from section where lectureId=?", [id], (err, results, f)=>{
        if(err) throw err;
        
        res.json(results);
    });
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id)
// Method: Post
// Response: id를 이용하여 Section을 삭제한다.
router.post("/api/deleteSection", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;

    info.query("delete from section where lectureId=? and id=?", [lectureId, sectionId], (err, results, f)=>{
        if(err) throw err;

        exec('rm -rf ' + BASE_DIR + '/contents/' + lectureId + '/' + sectionId, (err, out, stderr)=>{
            if(err) throw err;
    
            exec('rm -rf ' + BASE_DIR + '/files/' + lectureId + '/' + sectionId, (err, out, stderr)=>{
                if(err) throw err;
    
                info.query("delete from contents where lectureId=? and sectionId=?", [lectureId, sectionId], (err, results, f)=>{
                    if(err) throw err;
            
                    info.query("delete from classFile where lectureId=? and sectionId=?", [lectureId, sectionId], (err, results, f)=>{
                        if(err) throw err;
                
                        res.json({
                            "stateCode": 200,
                            "state": "Success"
                        });
                    });
                });
            });
        });
    });
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id), sectionName(String, 바꾸려고 하는 이름)
// Method: Post
// Response: id를 이용하여 Section의 이름을 변경한다.
router.post("/api/updateSection", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;
    var sectionName = req.body.sectionName;

    info.query("update section set sectionName=? where id=? and lectureId=?", [sectionName, sectionId, lectureId],(err, results, f)=>{
        if(err) throw err;
        
        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id), contentTitle(String, 수업의 이름),
// contentText(string, 수업 본문), contentVideo(multi-part, 동영상 콘텐츠), contentFile(array[multi-part], 수업 참고 자료)
// Method: Post
// Response: 주어진 정보로 수업을 만든다.
router.post("/api/makeContent", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;
    var contentTitle = req.body.contentTitle;
    var contentText = req.body.contentText;

    var contentFile = req.files.contentFile;
    let videofile = req.files.contentVideo;

    if(!req.files){
        res.json({
            "stateCode": 400,
            "state": "Failed"
        });
    }
    else{
        info.query("insert into contents(lectureId, contentTitle, sectionId, contentVideo, contentText) values (?, ?, ?, ?, ?)",
            [lectureId, contentTitle, sectionId, '', contentText], (err, results, f)=>{

            if(err) throw err;

            var contentId = results.insertId;
            
            var contentVideo = BASE_DIR + '/contents/' + lectureId + '/' + sectionId + '/' + contentId + '/' + videofile.name;
            videofile.mv(contentVideo);

            info.query("update contents set contentVideo=? where id=?", [contentVideo, contentId], (err, results, f)=>{
                if(err) throw err;

                for(var i = 0; i < contentFile.length; i++){
                    var now = contentFile[i];

                    var classFileDir = BASE_DIR + '/files/' + lectureId + '/' + sectionId + '/' + contentId + '/' + now.name;
                    now.mv(classFileDir)
        
                    info.query("insert into classFile(lectureId, sectionId, contentId, filePath) values (?, ?, ?, ?)", 
                        [lectureId, sectionId, contentId, classFileDir], (err, results, f)=>{

                        if(err) throw err;

                    });
                };

                res.json({
                    "stateCode": 200,
                    "state": "Success"
                });
            });
        });
    }
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id), contentId(int, content의 고유 id),
// contentTitle(String, 수업의 이름), contentText(string, 수업 본문), contentVideo(multi-part, 동영상 콘텐츠), contentFile(array[multi-part], 수업 참고 자료)
// Method: Post
// Response: 주어진 정보로 수업을 수정한다.
router.post("/api/updateContent", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;
    var contentId = req.body.contentId;

    var contentTitle = req.body.contentTitle;
    var contentText = req.body.contentText;

    var contentFile = req.files.contentFile;
    let videofile = req.files.contentVideo;

    if(!req.files){
        res.json({
            "stateCode": 400,
            "state": "Failed"
        });
    }
    else{
        exec('rm -rf ' + BASE_DIR + '/contents/' + lectureId + '/' + sectionId + '/' + contentId, (err, out, stderr)=>{
            if(err) throw err;
    
            exec('rm -rf ' + BASE_DIR + '/files/' + lectureId + '/' + sectionId + '/' + contentId, (err, out, stderr)=>{
                if(err) throw err;
    
                info.query("delete from classFile where lectureId=?", [lectureId], (err, results, f)=>{
                    if(err) throw err;

                    var contentVideo = BASE_DIR + '/contents/' + lectureId + '/' + sectionId + '/' + contentId + '/' + videofile.name;
                    videofile.mv(contentVideo);

                    info.query("update contents set contentTitle=?, contentText=?, contentVideo=? where lectureId=? and sectionId=? and id=?",
                        [contentTitle, contentText, contentVideo, lectureId ,sectionId, contentId], (err, results, f)=>{

                        if(err) throw err;

                        for(var i = 0; i < contentFile.length; i++){
                            var now = contentFile[i];

                            var classFileDir = BASE_DIR + '/files/' + lectureId + '/' + sectionId + '/' + contentId + '/' + now.name;
                            now.mv(classFileDir)
                
                            info.query("insert into classFile(lectureId, sectionId, contentId, filePath) values (?, ?, ?, ?)", 
                                [lectureId, sectionId, contentId, classFileDir], (err, results, f)=>{

                                if(err) throw err;

                            });
                        };

                        res.json({
                            "stateCode": 200,
                            "state": "Success"
                        });
                    });
                });
            });
        });
    }
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id)
// Method: Post
// Response: 특정 섹션의 수업을 모두 조회한다.
router.post("/api/viewContentList", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;
    
    info.query("select id, contentTitle from contents where lectureId=? and sectionId=?", [lectureId, sectionId], (err, results, f)=>{
        if(err) throw err;
        
        res.json(results);
    });
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id), contentId(int, content의 고유 id)
// Method: Post
// Response: 특정 수업을 조회한다.
router.post("/api/viewContent", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;
    var contentId = req.body.contentId;

    var ret = {};
    
    info.query("select * from contents where lectureId=? and sectionId=? and id=?", [lectureId, sectionId, contentId], (err, results, f)=>{
        if(err) throw err;

        ret['contentInfo'] = results[0];
        
        info.query("select * from classFile where lectureId=? and sectionId=? and contentId=?", [lectureId, sectionId, contentId], (err, results, f)=>{
            if(err) throw err;

            ret['contentFiles'] = results;

            res.json(ret);
        });
    });
});

// Parameter : lectureId(int, lecture의 고유 id), sectionId(int, section의 고유 id), contentId(int, content의 고유 id)
// Method: Post
// Response: 특정 수업을 삭제한다.
router.post("/api/deleteContent", (req, res) => {
    var lectureId = req.body.lectureId;
    var sectionId = req.body.sectionId;
    var contentId = req.body.contentId;

    exec('rm -rf ' + BASE_DIR + '/contents/' + lectureId + '/' + sectionId + '/' + contentId, (err, out, stderr)=>{
        if(err) throw err;

        exec('rm -rf ' + BASE_DIR + '/files/' + lectureId + '/' + sectionId + '/' + contentId, (err, out, stderr)=>{
            if(err) throw err;

            info.query("delete from contents where id=?", [contentId], (err, results, f)=>{
                if(err) throw err;
        
                info.query("delete from classFile where lectureId=?", [lectureId], (err, results, f)=>{
                    if(err) throw err;
            
                    res.json({
                        "stateCode": 200,
                        "state": "Success"
                    });
                });
            });
        });
    });
});

// Parameter: 없음
// Method: Post
// Response: 부모 카테고리를 조회한다.
router.post("/api/category/parent", (req, res)=>{
    info.query("select * from parentCategory", (err, results, f)=>{
        if(err) throw err;

        res.json(results);
    });
});

// Parameter: parentCategoryId(int, 부모 카테고리 고유 id)
// Method: Post
// Response: id로 부모 카테고리를 조회한다.
router.post("/api/category/parentWithId", (req, res)=>{
    var parentCategoryId = req.body.parentCategoryId;

    info.query("select * from parentCategory where id=?",[parentCategoryId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results[0]);
    });
});

// Parameter: parentId(int, 부모 카테고리의 고유 id, 0이면 모든 자식 카테고리 조회)
// Method: Post
// Response: 부모 카테고리의 하위 카테고리를 조회한다.
router.post("/api/category/child", (req, res)=>{
    var parentId = req.body.parentId;

    if(parentId == 0){
        info.query("select * from childCategory", (err, results, f)=>{
            if(err) throw err;
    
            res.json(results);
        });
    }
    else{
        info.query("select * from childCategory where parentId=?",[parentId] ,(err, results, f)=>{
            if(err) throw err;
    
            res.json(results);
        });
    }
});

// Parameter: childCategoryId(int, 자식 카테고리 고유 id)
// Method: Post
// Response: id로 자식 카테고리를 조회한다.
router.post("/api/category/childWithId", (req, res)=>{
    var childCategoryId = req.body.childCategoryId;

    info.query("select * from childCategory where id=?",[childCategoryId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results[0]);
    });
});

// Parameter: userId(string), lectureId(int, lecture의 고유 id)
// Method: Post
// Response: 해당 강의를 '내가 신청한 강의'에 추가한다.
router.post("/api/addMyLecture", (req, res)=>{
    var userId = req.body.userId;
    var lectureId = req.body.lectureId;

    info.query("insert into myLectures(userId, lectureId) values (?, ?)", [userId, lectureId] ,(err, results, f)=>{
        if(err) throw err;

        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter: userId(string)
// Method: Post
// Response: 내가 신청한 강의를 조회한다.
router.post("/api/viewMyLecture", (req, res)=>{
    var userId = req.body.userId;

    info.query("select * from myLectures where userId=?", [userId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results);
    });
});

// Parameter: userId(string), lectureId(int, lecture의 고유 id)
// Method: Post
// Response: 내가 신청한 강의를 삭제한다.
router.post("/api/deleteMyLecture", (req, res)=>{
    var userId = req.body.userId;
    var lectureId = req.body.lectureId;

    info.query("delete from myLectures where userId=? and lectureId=?", [userId, lectureId] ,(err, results, f)=>{
        if(err) throw err;

        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter: userId(string)
// Method: Post
// Response: 'My Skills'을 조회한다.
router.post("/api/viewMySkills", (req, res)=>{
    var userId = req.body.userId;

    info.query("select categoryName, count(childCategoryId) as count from myLectures as a join lecture as b on a.lectureId=b.id join childCategory as c on b.childCategoryId=c.id where userId=? group by childCategoryId;",
        [userId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results);
    });
});

// Parameter: userId(string), serial(string, 수료증의 시리얼(영문 숫자 혼합), lectureId(수강 완료한 lecture의 고유 id)
// Method: Post
// Response: 수료증을 추가한다.
router.post("/api/addCertificate", (req, res)=>{
    var userId = req.body.userId;
    var serial = req.body.serial;
    var lectureId = req.body.lectureId;
    
    info.query("insert into certificates(userId, serial, lectureId, time) values (?, ?, ?, now())", [userId, serial, lectureId] ,(err, results, f)=>{
        if(err) throw err;

        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter: userId(string)
// Method: Post
// Response: 수료증을 조회한다.
router.post("/api/viewCertificate", (req, res)=>{
    var userId = req.body.userId;
    
    info.query("select userId, serial, time, lectureName, lecturerId from certificates as a left join lecture as b on a.lectureId=b.id where userId=?", [userId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results);
    });
});

// Parameter: userId(string), lectureId(int, lecture의 고유 id), contentId(int, content의 고유 id), 
//            entireTime(int, 기록할 강의 동영상의 전체 길이(초)), watchedTime(int, 강의를 어디까지 봤는지(초))
// Method: Post
// Response: 수강 기록이 없으면 추가하고, 있으면 업데이트 한다.
router.post("/api/addRecord", (req, res)=>{
    var userId = req.body.userId;
    var lectureId = req.body.lectureId;
    var contentId = req.body.contentId;
    var isFinished = 0;
    var entireTime = req.body.entireTime;
    var watchedTime = req.body.watchedTime;

    if(entireTime == watchedTime) isFinished = 1;
    
    sql = "insert into learningRecord(userId, lectureId, contentId, isFinished, entireTime, watchedTime, time) values(?, ?, ?, ?, ?, ?, now()) on duplicate key update isFinished=?, entireTime=?, watchedTime=?, time=now();";
    info.query(sql, [userId, lectureId, contentId, isFinished, entireTime, watchedTime, isFinished, entireTime, watchedTime] ,(err, results, f)=>{
        if(err) throw err;

        res.json({
            "stateCode": 200,
            "state": "Success"
        });
    });
});

// Parameter: userId(string)
// Method: Post
// Response: 완료 강의 수를 조회한다.
router.post("/api/viewFinishedLecture", (req, res)=>{
    var userId = req.body.userId;
    
    info.query("select count(*) as count from certificates where userId=?", [userId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results[0]);
    });
});

// Parameter: userId(string)
// Method: Post
// Response: 완료 수업 수를 조회한다.
router.post("/api/viewFinishedContent", (req, res)=>{
    var userId = req.body.userId;
    
    info.query("select count(*) as count from learningRecord where userId=? and isFinished=1", [userId] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results[0]);
    });
});

// Parameter: userId(string), lectureId(int, lecture의 고유 id)
// Method: Post
// Response: 특정 강의의 학습 현황을 조회한다. (완료한 콘텐츠 수, 전체 콘텐츠 수, 총 재생 시간)
router.post("/api/viewLearningRecord", (req, res)=>{
    var userId = req.body.userId;
    var lectureId = req.body.lectureId;

    var ret = {
        "finishedContents": 0,
        "entireContents": 0,
        "totalWatchedTime": 0
    }
    
    info.query("select sum(watchedTime) as count from learningRecord where userId=? and lectureId=?", [userId, lectureId] ,(err, results, f)=>{
        if(err) throw err;

        ret['totalWatchedTime'] = results[0]['count'];

        info.query("select count(*) as count from learningRecord where userId=? and lectureId=? and isFinished=1", [userId, lectureId] ,(err, results, f)=>{
            if(err) throw err;
    
            ret['finishedContents'] = results[0]['count'];

            info.query("select count(*) as count from contents where lectureId=?", [lectureId] ,(err, results, f)=>{
                if(err) throw err;
        
                ret['entireContents'] = results[0]['count'];
                res.json(ret);
            });
        });
    });
});

// Parameter: userId(string)
// Method: Post
// Response: 가장 최근 학습한 강의를 조회한다.
router.post("/api/viewOneCurrentLearningRecord", (req, res)=>{
    var userId = req.body.userId;

    var ret = {
        "finishedContents": 0,
        "entireContents": 0,
        "totalWatchedTime": 0
    }
    
    info.query("select userId, lectureName, lectureId, lecturerId, time from learningRecord as a join lecture as b on a.lectureId=b.id where userId=? order by time desc limit 1 ;", [userId] ,(err, results, f)=>{
        if(err) throw err;

        if(results.length == 0) return res.json({});

        var ret = results[0];
        var lectureId = ret['lectureId'];
        
        info.query("select count(*) as count from learningRecord where userId=? and lectureId=? and isFinished=1", [userId, lectureId] ,(err, results, f)=>{
            if(err) throw err;
    
            ret['finishedContents'] = results[0]['count'];

            info.query("select count(*) as count from contents where lectureId=?", [lectureId] ,(err, results, f)=>{
                if(err) throw err;
        
                ret['entireContents'] = results[0]['count'];
                res.json(ret);
            });
        });
    });
});

// Parameter: userId(string), n(int)
// Method: Post
// Response: 가장 최근 학습한 강의 n개의 이름을 조회한다.
router.post("/api/viewCurrentLearningRecords", (req, res)=>{
    var userId = req.body.userId;
    var n = req.body.n;
    
    info.query("select userId, lectureName, lecturerId, time from learningRecord as a join lecture as b on a.lectureId=b.id where userId=? group by lectureId order by time desc limit ?;", [userId, n] ,(err, results, f)=>{
        if(err) throw err;

        res.json(results);
    });
});

module.exports = router;
