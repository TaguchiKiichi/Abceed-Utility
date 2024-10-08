    //boot js
    let OnQuestion = (location.pathname == "/books/study/word-test-confirm/quiz");
    let OldLoc;
    if (!OnQuestion) {
        OldLoc = location.pathname;
    }
    
    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
    
        element.onmousedown = function(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
    
        function elementDrag(e) {
            e.preventDefault();
            offsetX = mouseX - e.clientX;
            offsetY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - offsetY) + "px";
            element.style.left = (element.offsetLeft - offsetX) + "px";
        }
    
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    function StartLoad() {
      document.getElementById("loadingPop").style.display = "block";
    }
    
    function ExitLoad() {
      document.getElementById("loadingPop").style.display = "none";
    }
    
    //abceed script
    let AnswerData;

    let UserData = {
        AuthToken : "",
        TestID: "",
    }

    let AutoClearData = {
        ClassID : "",
        TaskID : "",
    }
    
    let AnswerAssist = false;
    
    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
    
    async function ShowCustomPop(ms) {
        document.getElementById("customPop").style.display = "block";
        document.getElementById("customPop").textContent = ms;
        await sleep(500);
        document.getElementById("customPop").style.display = "none";
    }
    
    function AssistFunc() {
        for (let i = 0; i < document.getElementById("answerPop").children.length; i++) {
            document.getElementById("answerPop").children[i].style.backgroundColor = "white";
        }
        document.getElementById("answerPop").children[Number(document.getElementsByClassName("marksheet-answer__number")[0].textContent.replaceAll(" ","").replaceAll("\n","").split("/")[0])+3].style.backgroundColor = "yellow";
        console.log("changed");
    }
    
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('loading') && AnswerAssist) {
                        AssistFunc();
                    }
                });
            }
        }
    };
    
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    
    function CloseElem() {
        document.getElementById("answerPop").style.display = "none";
    }

function GetUserData() {
    UserData.AuthToken = localStorage.getItem("abcJwtToken");
    AutoClearData.TaskID = location.pathname.split("/")[3];
    AutoClearData.ClassID = JSON.parse(localStorage.getItem("abceed")).classes.focusedClassInfo.id_class;


    const url = 'https://app-api.abceed.com/web/world_practices/info?id_task='+location.pathname.split("/")[3];
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + UserData.AuthToken,
            'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Chrome OS"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'X-User-Agent': 'abceed-web:7.1.0/Chrome:127.0.6533.132',
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        UserData.TestID = data.task_info.id_test;
    })
    .catch(error => {
        console.error('Error:', error);
    });

    ShowCustomPop("Success");
}

function ToggleAssist() {
    if (location.pathname != "/books/study/word-test-confirm/quiz") {
        alert("タスクを開始してから押してください");
        return
    }
    if (AnswerAssist) {
        document.getElementById("tglAst").style.setProperty("background-color","white","important");
        document.getElementById("tglAst").style.setProperty("color","black","important");
        AnswerAssist = !AnswerAssist;
        ShowCustomPop("Assist OFF");
        observer.disconnect();
    } else {
        document.getElementById("tglAst").style.setProperty("background-color","royalblue","important");
        document.getElementById("tglAst").style.setProperty("color","white","important");
        AnswerAssist = !AnswerAssist;
        ShowCustomPop("Assist ON");
        AssistFunc();
        
        observer.observe(document.body, config);
    }
}
function ShowAnswer() {
    const url = 'https://app-api.abceed.com/web/world_practices/info?id_task='+location.pathname.split("/")[3];

StartLoad();
fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + UserData.AuthToken,
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Chrome OS"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'X-User-Agent': 'abceed-web:7.1.0/Chrome:127.0.6533.132',
        'Content-Type': 'application/json'
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log('Success:', data.all_question_list);
    AnswerData = data.all_question_list;

    ansPop = document.getElementById("answerPop");
    makeDraggable(ansPop);
    ansPop.innerHTML = '<a id="closeBtn" onclick="javascript:CloseElem()">×</a>';
    te = document.createElement("h1");
    te.textContent = "Answer List";
    ansPop.appendChild(te);
    AnswerListElem = document.createElement("a");
    AnswerListElem.innerHTML = `英語 日本語<hr style="border: none !important;border-top: 1px solid black !important;margin: 0 !important;"><br>`;
    ansPop.appendChild(AnswerListElem);
    data.all_question_list.forEach(ans => {
        AnswerListElem = document.createElement("a");
        AnswerListElem.innerHTML = `${ans.word} ${ans.word_ja}<hr style="border: none !important;border-top: 1px solid black !important;margin: 0 !important;"><br>`;
        ansPop.appendChild(AnswerListElem);
    });
    ansPop.style.display = "block";
})
.catch(error => {
    console.error('Error:', error);
}).finally(() => {
    ExitLoad();
});
}

//auto clear
function RunAuto() {
    ShowCustomPop("Boot system...");

    cfg = {
        ClassID : AutoClearData.ClassID,
        TaskID : AutoClearData.TaskID,
        authorization : UserData.AuthToken,
        TestID : UserData.TestID,
    };

    AutoClear(cfg);

    ShowCustomPop("clear!");
}

function AutoClear(cfg) {
    //get answer
    let AnsData;
    
    (async function(){
      const url = "https://app-api.abceed.com/web/world_practices/info?id_task=" + cfg.TaskID;
      try {
        const response = await fetch(url,{
            headers: {
                "documentLifecycle": "active",
                "frameType": "outermost_frame",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "ja,en;q=0.9,ig;q=0.8,it;q=0.7,sn;q=0.6,tg;q=0.5,uz;q=0.4,lt;q=0.3,nso;q=0.2,az;q=0.1,ee;q=0.1",
                "authorization": "Bearer " + cfg.authorization,
                "Content-Type": "application/json",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Chrome OS\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                "X-User-Agent": "abceed-web:7.1.0/Chrome:127.0.6533.132"
              },
          });
        if (!response.ok) {
          throw new Error(`レスポンスステータス: ${response.status}`);
        }
    
        const json = await response.json();
        console.log(json);
        AnsData = json;
        qNum = AnsData.all_question_list.length-1;
        const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
    
        for (let i = 0; i < AnsData.all_question_list.length; i++) {
          const ans = AnsData.all_question_list[i];
          SendAns(ans, i, qNum);
          AddStudyTime(cfg);
          await sleep(50);
        }
      } catch (error) {
        console.error(error.message);
      }
    }())
    
    //add study time
    async function AddStudyTime(cfg) {
        const body = {
            "add_second":Math.floor( Math.random() * 30 ),
            "id_task":cfg.TaskID,
            "id_test":cfg.TestID,
        }

        console.log("added : ",body.add_second);

        const url = "https://app-api.abceed.com/web/study_time/update";
        await fetch(url,{
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "documentLifecycle": "active",
                "frameType": "outermost_frame",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "ja,en;q=0.9,ig;q=0.8,it;q=0.7,sn;q=0.6,tg;q=0.5,uz;q=0.4,lt;q=0.3,nso;q=0.2,az;q=0.1,ee;q=0.1",
                "authorization": "Bearer "+cfg.authorization,
                "Content-Type": "application/json",
                "sec-ch-ua": "\"Not)A;Bra nd\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Chrome OS\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                "X-User-Agent": "abceed-web:7.1.0/Chrome:127.0.6533.132"
              },
        }).then(response => {
            if (!response.ok) {
                throw new Error("Error :",response.status);
            }else{
                console.log(response);
            }
        });
    }
    //add end

    //send answer
    async function SendAns(AnsNum, numP, qNum) {
      const body = {
        "question_list": [
          {
            "id_test": cfg.TestID,
            "num_part": AnsNum.num_part,
            "num_question": AnsNum.num_question,
            "inputted_answer": "",
            "is_uneasy": 0,
            "consume_second": Math.floor( Math.random() * 150 ),
            "acquire_status": 1,
            "choiced_answer": AnsNum.true_answer
          }
        ],
        "id_task": cfg.TaskID,
        "id_class": cfg.ClassID,
        "is_world_practice": 1
      }
      if (qNum == numP) {
        body.has_finished_world_practice = 1;
        console.log("add");
      }
      const url = "https://app-api.abceed.com/web/question/grading";
      try {
        const response = await fetch(url,{
          method: "POST",
          body: JSON.stringify(body),
            headers: {
                "documentLifecycle": "active",
                "frameType": "outermost_frame",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "ja,en;q=0.9,ig;q=0.8,it;q=0.7,sn;q=0.6,tg;q=0.5,uz;q=0.4,lt;q=0.3,nso;q=0.2,az;q=0.1,ee;q=0.1",
                "authorization": "Bearer "+cfg.authorization,
                "Content-Type": "application/json",
                "sec-ch-ua": "\"Not)A;Bra nd\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Chrome OS\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                "X-User-Agent": "abceed-web:7.1.0/Chrome:127.0.6533.132"
              },
          }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          console.log("Success : " + numP);
          console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
      } catch (error) {
        console.error(error.message);
      }
    }
    }
//auto end

(function(){
    if (location.host != "app.abceed.com" || document.getElementById("showHubbox") != null) {
        return
    }

    hubButton = document.createElement("div");
hub = document.body.insertBefore(hubButton, document.body.firstChild);
hub.innerHTML += atob("PHN0eWxlPgogIC5kcmFnZ2FibGUgewogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsKICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICB0b3A6IDUwcHg7CiAgICAgIGxlZnQ6IDUwcHg7CiAgICAgIGN1cnNvcjogbW92ZTsKICAgICAgZGlzcGxheTogZmxleDsKICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7CiAgICAgIHotaW5kZXg6IDEwMDA7CiAgICAgIHVzZXItc2VsZWN0OiBub25lOwogIH0KCiAgLnN3aXRjaGJ0biB7CiAgICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTYsIDEwOSwgMTQwKTsKICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgICAgIGNvbG9yOiBibGFjazsKICAgICAgY3Vyc29yOiBwb2ludGVyOwogIH0KCiAgI2h1YmJveCB7CiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICAgICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgICAgIGRpc3BsYXk6IG5vbmU7CiAgICAgIGN1cnNvcjogbW92ZTsKICAgICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7CiAgICAgIHBhZGRpbmc6IDIwcHggMjBweCAyMHB4IDIwcHg7CiAgICAgIHotaW5kZXg6ICAgOTk5OwogIH0KCiAgLnBvcCB7CiAgICBkaXNwbGF5OiBmbGV4OwogICAgcG9zaXRpb246IHJlbGF0aXZlOwogIH0KCiNsb2FkaW5nUG9wIHsKICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgZGlzcGxheTogbm9uZTsKICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7CiAgIHBhZGRpbmc6IDIwcHggMjBweCAyMHB4IDIwcHg7Cn0KCiNhbnN3ZXJQb3AgewogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsKICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICBkaXNwbGF5OiBub25lOwogICAgICBjdXJzb3I6IG1vdmU7CiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICAgICBwYWRkaW5nOiAyMHB4IDIwcHggMjBweCAyMHB4OwogICAgICB6LWluZGV4OiAgIDk5OTsKfQoKI2Nsb3NlQnRuIHsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdG9wOiAxMHB4OwogIHJpZ2h0OiAxMHB4OwogIGN1cnNvcjogcG9pbnRlcjsKfQoKI2N1c3RvbVBvcCB7CiAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgIGRpc3BsYXk6IG5vbmU7CiAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICBwYWRkaW5nOiAyMHB4IDIwcHggMjBweCAyMHB4Owp9CgogIC5kcmFnIHsKICAgICAgei1pbmRleDogMTAwMTsKICB9Cjwvc3R5bGU+Cgo8ZGl2IGlkPSJkcmFnZ2FibGVFbGVtZW50IiBjbGFzcz0iZHJhZ2dhYmxlIj4KICA8YnV0dG9uIGlkPSJzaG93SHViYm94IiBjbGFzcz0ic3dpdGNoYnRuIj5BYmNlZWQgVXRpbGl0eTwvYnV0dG9uPgo8L2Rpdj4KCjxkaXYgaWQ9Imh1YmJveCI+CiAgPGgxPjxiPkFiY2VlZCBVdGlsaXR5IEh1YjwvYj48L2gxPgogIDxhIG9uY2xpY2s9ImphdmFzY3JpcHQ6R2V0VXNlckRhdGEoKSI+SW5pdGFsaXplPC9hPjxicj4KPGEgb25jbGljaz0iamF2YXNjcmlwdDpTaG93QW5zd2VyKCkiPlZpZXcgQW5zd2VyPC9hPjxicj4KPGEgaWQ9InRnbEFzdCIgb25jbGljaz0iamF2YXNjcmlwdDpUb2dnbGVBc3Npc3QoKSI+QW5zd2VyIEFzc2lzdDwvYT48YnI+CjxhIG9uY2xpY2s9ImphdmFzY3JpcHQ6UnVuQXV0bygpIj5BdXRvIENvbXBsZXRlPC9hPjxicj4KPGRpdiBjbGFzcz0icG9wIj4KICA8aDEgaWQ9ImxvYWRpbmdQb3AiPkxvYWRpbmcuLi48L2gxPgogIDxoMSBpZD0iY3VzdG9tUG9wIj48L2gxPgo8L2Rpdj4KPC9kaXY+CjxkaXYgaWQ9ImFuc3dlclBvcCI+CiAgPGEgaWQ9ImNsb3NlQnRuIiBvbmNsaWNrPSJqYXZhc2NyaXB0OkNsb3NlRWxlbSgpIj7DlzwvYT4KPC9kaXY+Cgo8c2NyaXB0PgogICAgLy9ib290IGpzCiAgICBsZXQgT25RdWVzdGlvbiA9IChsb2NhdGlvbi5wYXRobmFtZSA9PSAiL2Jvb2tzL3N0dWR5L3dvcmQtdGVzdC1jb25maXJtL3F1aXoiKTsKICAgIGxldCBPbGRMb2M7CiAgICBpZiAoIU9uUXVlc3Rpb24pIHsKICAgICAgICBPbGRMb2MgPSBsb2NhdGlvbi5wYXRobmFtZTsKICAgIH0KICAgIAogICAgZnVuY3Rpb24gbWFrZURyYWdnYWJsZShlbGVtZW50KSB7CiAgICAgICAgbGV0IG9mZnNldFggPSAwLCBvZmZzZXRZID0gMCwgbW91c2VYID0gMCwgbW91c2VZID0gMDsKICAgIAogICAgICAgIGVsZW1lbnQub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7CiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsKICAgICAgICAgICAgbW91c2VYID0gZS5jbGllbnRYOwogICAgICAgICAgICBtb3VzZVkgPSBlLmNsaWVudFk7CiAgICAgICAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IGNsb3NlRHJhZ0VsZW1lbnQ7CiAgICAgICAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gZWxlbWVudERyYWc7CiAgICAgICAgfTsKICAgIAogICAgICAgIGZ1bmN0aW9uIGVsZW1lbnREcmFnKGUpIHsKICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOwogICAgICAgICAgICBvZmZzZXRYID0gbW91c2VYIC0gZS5jbGllbnRYOwogICAgICAgICAgICBvZmZzZXRZID0gbW91c2VZIC0gZS5jbGllbnRZOwogICAgICAgICAgICBtb3VzZVggPSBlLmNsaWVudFg7CiAgICAgICAgICAgIG1vdXNlWSA9IGUuY2xpZW50WTsKICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSAoZWxlbWVudC5vZmZzZXRUb3AgLSBvZmZzZXRZKSArICJweCI7CiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IChlbGVtZW50Lm9mZnNldExlZnQgLSBvZmZzZXRYKSArICJweCI7CiAgICAgICAgfQogICAgCiAgICAgICAgZnVuY3Rpb24gY2xvc2VEcmFnRWxlbWVudCgpIHsKICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDsKICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsOwogICAgICAgIH0KICAgIH0KICAgIAogICAgZnVuY3Rpb24gU3RhcnRMb2FkKCkgewogICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibG9hZGluZ1BvcCIpLnN0eWxlLmRpc3BsYXkgPSAiYmxvY2siOwogICAgfQogICAgCiAgICBmdW5jdGlvbiBFeGl0TG9hZCgpIHsKICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImxvYWRpbmdQb3AiKS5zdHlsZS5kaXNwbGF5ID0gIm5vbmUiOwogICAgfQogICAgCiAgICAvL2FiY2VlZCBzY3JpcHQKICAgIGxldCBBbnN3ZXJEYXRhOwoKICAgIGxldCBVc2VyRGF0YSA9IHsKICAgICAgICBBdXRoVG9rZW4gOiAiIiwKICAgICAgICBUZXN0SUQ6ICIiLAogICAgfQoKICAgIGxldCBBdXRvQ2xlYXJEYXRhID0gewogICAgICAgIENsYXNzSUQgOiAiIiwKICAgICAgICBUYXNrSUQgOiAiIiwKICAgIH0KICAgIAogICAgbGV0IEFuc3dlckFzc2lzdCA9IGZhbHNlOwogICAgCiAgICBjb25zdCBzbGVlcCA9ICh0aW1lKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aW1lKSk7CiAgICAKICAgIGFzeW5jIGZ1bmN0aW9uIFNob3dDdXN0b21Qb3AobXMpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY3VzdG9tUG9wIikuc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImN1c3RvbVBvcCIpLnRleHRDb250ZW50ID0gbXM7CiAgICAgICAgYXdhaXQgc2xlZXAoNTAwKTsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY3VzdG9tUG9wIikuc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgIH0KICAgIAogICAgZnVuY3Rpb24gQXNzaXN0RnVuYygpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhbnN3ZXJQb3AiKS5jaGlsZHJlbi5sZW5ndGg7IGkrKykgewogICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5zd2VyUG9wIikuY2hpbGRyZW5baV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gIndoaXRlIjsKICAgICAgICB9CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFuc3dlclBvcCIpLmNoaWxkcmVuW051bWJlcihkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCJtYXJrc2hlZXQtYW5zd2VyX19udW1iZXIiKVswXS50ZXh0Q29udGVudC5yZXBsYWNlQWxsKCIgIiwiIikucmVwbGFjZUFsbCgiXG4iLCIiKS5zcGxpdCgiLyIpWzBdKSszXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAieWVsbG93IjsKICAgICAgICBjb25zb2xlLmxvZygiY2hhbmdlZCIpOwogICAgfQogICAgCiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbnNMaXN0KSA9PiB7CiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7CiAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0JykgewogICAgICAgICAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4gewogICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGluZycpICYmIEFuc3dlckFzc2lzdCkgewogICAgICAgICAgICAgICAgICAgICAgICBBc3Npc3RGdW5jKCk7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9OwogICAgCiAgICBjb25zdCBjb25maWcgPSB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9OwogICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7CiAgICAKICAgIGZ1bmN0aW9uIENsb3NlRWxlbSgpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5zd2VyUG9wIikuc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgIH0KCmZ1bmN0aW9uIEdldFVzZXJEYXRhKCkgewogICAgVXNlckRhdGEuQXV0aFRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oImFiY0p3dFRva2VuIik7CgoKICAgIGNvbnN0IHVybCA9ICdodHRwczovL2FwcC1hcGkuYWJjZWVkLmNvbS93ZWIvd29ybGRfcHJhY3RpY2VzL2luZm8/aWRfdGFzaz0nK2xvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCIvIilbM107CiAgICBmZXRjaCh1cmwsIHsKICAgICAgICBtZXRob2Q6ICdHRVQnLAogICAgICAgIGhlYWRlcnM6IHsKICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBVc2VyRGF0YS5BdXRoVG9rZW4sCiAgICAgICAgICAgICdzZWMtY2gtdWEnOiAnIk5vdClBO0JyYW5kIjt2PSI5OSIsICJHb29nbGUgQ2hyb21lIjt2PSIxMjciLCAiQ2hyb21pdW0iO3Y9IjEyNyInLAogICAgICAgICAgICAnc2VjLWNoLXVhLW1vYmlsZSc6ICc/MCcsCiAgICAgICAgICAgICdzZWMtY2gtdWEtcGxhdGZvcm0nOiAnIkNocm9tZSBPUyInLAogICAgICAgICAgICAnU2VjLUZldGNoLURlc3QnOiAnZW1wdHknLAogICAgICAgICAgICAnU2VjLUZldGNoLU1vZGUnOiAnY29ycycsCiAgICAgICAgICAgICdTZWMtRmV0Y2gtU2l0ZSc6ICdzYW1lLXNpdGUnLAogICAgICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoWDExOyBDck9TIHg4Nl82NCAxNDU0MS4wLjApIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjcuMC4wLjAgU2FmYXJpLzUzNy4zNicsCiAgICAgICAgICAgICdYLVVzZXItQWdlbnQnOiAnYWJjZWVkLXdlYjo3LjEuMC9DaHJvbWU6MTI3LjAuNjUzMy4xMzInLAogICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nCiAgICAgICAgfSwKICAgIH0pCiAgICAudGhlbihyZXNwb25zZSA9PiB7CiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykgewogICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvaycpOwogICAgICAgIH0KICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOwogICAgfSkKICAgIC50aGVuKGRhdGEgPT4gewogICAgICAgIFVzZXJEYXRhLlRlc3RJRCA9IGRhdGEudGFza19pbmZvLmlkX3Rlc3Q7CiAgICB9KQogICAgLmNhdGNoKGVycm9yID0+IHsKICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcik7CiAgICB9KTsKCiAgICBTaG93Q3VzdG9tUG9wKCJTdWNjZXNzIik7Cn0KCmZ1bmN0aW9uIFRvZ2dsZUFzc2lzdCgpIHsKICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPSAiL2Jvb2tzL3N0dWR5L3dvcmQtdGVzdC1jb25maXJtL3F1aXoiKSB7CiAgICAgICAgYWxlcnQoIuOCv+OCueOCr+OCkumWi+Wni+OBl+OBpuOBi+OCieaKvOOBl+OBpuOBj+OBoOOBleOBhCIpOwogICAgICAgIHJldHVybgogICAgfQogICAgaWYgKEFuc3dlckFzc2lzdCkgewogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0Z2xBc3QiKS5zdHlsZS5zZXRQcm9wZXJ0eSgiYmFja2dyb3VuZC1jb2xvciIsIndoaXRlIiwiaW1wb3J0YW50Iik7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInRnbEFzdCIpLnN0eWxlLnNldFByb3BlcnR5KCJjb2xvciIsImJsYWNrIiwiaW1wb3J0YW50Iik7CiAgICAgICAgQW5zd2VyQXNzaXN0ID0gIUFuc3dlckFzc2lzdDsKICAgICAgICBTaG93Q3VzdG9tUG9wKCJBc3Npc3QgT0ZGIik7CiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpOwogICAgfSBlbHNlIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidGdsQXN0Iikuc3R5bGUuc2V0UHJvcGVydHkoImJhY2tncm91bmQtY29sb3IiLCJyb3lhbGJsdWUiLCJpbXBvcnRhbnQiKTsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidGdsQXN0Iikuc3R5bGUuc2V0UHJvcGVydHkoImNvbG9yIiwid2hpdGUiLCJpbXBvcnRhbnQiKTsKICAgICAgICBBbnN3ZXJBc3Npc3QgPSAhQW5zd2VyQXNzaXN0OwogICAgICAgIFNob3dDdXN0b21Qb3AoIkFzc2lzdCBPTiIpOwogICAgICAgIEFzc2lzdEZ1bmMoKTsKICAgICAgICAKICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIGNvbmZpZyk7CiAgICB9Cn0KZnVuY3Rpb24gU2hvd0Fuc3dlcigpIHsKICAgIGNvbnN0IHVybCA9ICdodHRwczovL2FwcC1hcGkuYWJjZWVkLmNvbS93ZWIvd29ybGRfcHJhY3RpY2VzL2luZm8/aWRfdGFzaz0nK2xvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCIvIilbM107CgpTdGFydExvYWQoKTsKZmV0Y2godXJsLCB7CiAgICBtZXRob2Q6ICdHRVQnLAogICAgaGVhZGVyczogewogICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgVXNlckRhdGEuQXV0aFRva2VuLAogICAgICAgICdzZWMtY2gtdWEnOiAnIk5vdClBO0JyYW5kIjt2PSI5OSIsICJHb29nbGUgQ2hyb21lIjt2PSIxMjciLCAiQ2hyb21pdW0iO3Y9IjEyNyInLAogICAgICAgICdzZWMtY2gtdWEtbW9iaWxlJzogJz8wJywKICAgICAgICAnc2VjLWNoLXVhLXBsYXRmb3JtJzogJyJDaHJvbWUgT1MiJywKICAgICAgICAnU2VjLUZldGNoLURlc3QnOiAnZW1wdHknLAogICAgICAgICdTZWMtRmV0Y2gtTW9kZSc6ICdjb3JzJywKICAgICAgICAnU2VjLUZldGNoLVNpdGUnOiAnc2FtZS1zaXRlJywKICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoWDExOyBDck9TIHg4Nl82NCAxNDU0MS4wLjApIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjcuMC4wLjAgU2FmYXJpLzUzNy4zNicsCiAgICAgICAgJ1gtVXNlci1BZ2VudCc6ICdhYmNlZWQtd2ViOjcuMS4wL0Nocm9tZToxMjcuMC42NTMzLjEzMicsCiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJwogICAgfSwKfSkKLnRoZW4ocmVzcG9uc2UgPT4gewogICAgaWYgKCFyZXNwb25zZS5vaykgewogICAgICAgIHRocm93IG5ldyBFcnJvcignTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rJyk7CiAgICB9CiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOwp9KQoudGhlbihkYXRhID0+IHsKICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIGRhdGEuYWxsX3F1ZXN0aW9uX2xpc3QpOwogICAgQW5zd2VyRGF0YSA9IGRhdGEuYWxsX3F1ZXN0aW9uX2xpc3Q7CgogICAgYW5zUG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFuc3dlclBvcCIpOwogICAgbWFrZURyYWdnYWJsZShhbnNQb3ApOwogICAgYW5zUG9wLmlubmVySFRNTCA9ICc8YSBpZD0iY2xvc2VCdG4iIG9uY2xpY2s9ImphdmFzY3JpcHQ6Q2xvc2VFbGVtKCkiPsOXPC9hPic7CiAgICB0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImgxIik7CiAgICB0ZS50ZXh0Q29udGVudCA9ICJBbnN3ZXIgTGlzdCI7CiAgICBhbnNQb3AuYXBwZW5kQ2hpbGQodGUpOwogICAgQW5zd2VyTGlzdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJhIik7CiAgICBBbnN3ZXJMaXN0RWxlbS5pbm5lckhUTUwgPSBg6Iux6KqeIOaXpeacrOiqnjxociBzdHlsZT0iYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7Ym9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrICFpbXBvcnRhbnQ7bWFyZ2luOiAwICFpbXBvcnRhbnQ7Ij48YnI+YDsKICAgIGFuc1BvcC5hcHBlbmRDaGlsZChBbnN3ZXJMaXN0RWxlbSk7CiAgICBkYXRhLmFsbF9xdWVzdGlvbl9saXN0LmZvckVhY2goYW5zID0+IHsKICAgICAgICBBbnN3ZXJMaXN0RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImEiKTsKICAgICAgICBBbnN3ZXJMaXN0RWxlbS5pbm5lckhUTUwgPSBgJHthbnMud29yZH0gJHthbnMud29yZF9qYX08aHIgc3R5bGU9ImJvcmRlcjogbm9uZSAhaW1wb3J0YW50O2JvcmRlci10b3A6IDFweCBzb2xpZCBibGFjayAhaW1wb3J0YW50O21hcmdpbjogMCAhaW1wb3J0YW50OyI+PGJyPmA7CiAgICAgICAgYW5zUG9wLmFwcGVuZENoaWxkKEFuc3dlckxpc3RFbGVtKTsKICAgIH0pOwogICAgYW5zUG9wLnN0eWxlLmRpc3BsYXkgPSAiYmxvY2siOwp9KQouY2F0Y2goZXJyb3IgPT4gewogICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpOwp9KS5maW5hbGx5KCgpID0+IHsKICAgIEV4aXRMb2FkKCk7Cn0pOwp9CgovL2F1dG8gY2xlYXIKZnVuY3Rpb24gUnVuQXV0bygpIHsKICAgIFN0YXJ0TG9hZCgpOwoKICAgIGNmZyA9IHsKICAgICAgICBDbGFzc0lEIDogQXV0b0NsZWFyRGF0YS5DbGFzc0lELAogICAgICAgIFRhc2tJRCA6IEF1dG9DbGVhckRhdGEuVGFza0lELAogICAgICAgIGF1dGhvcml6YXRpb24gOiBVc2VyRGF0YS5BdXRoVG9rZW4sCiAgICAgICAgVGVzdElEIDogVXNlckRhdGEuVGVzdElELAogICAgfTsKCiAgICBBdXRvQ2xlYXIoY2ZnKTsKCiAgICBFeGl0TG9hZCgpOwp9CgpmdW5jdGlvbiBBdXRvQ2xlYXIoY2ZnKSB7CiAgICAvL2dldCBhbnN3ZXIKICAgIGxldCBBbnNEYXRhOwogICAgCiAgICAoYXN5bmMgZnVuY3Rpb24oKXsKICAgICAgY29uc3QgdXJsID0gImh0dHBzOi8vYXBwLWFwaS5hYmNlZWQuY29tL3dlYi93b3JsZF9wcmFjdGljZXMvaW5mbz9pZF90YXNrPSIgKyBjZmcuVGFza0lEOwogICAgICB0cnkgewogICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLHsKICAgICAgICAgICAgaGVhZGVyczogewogICAgICAgICAgICAgICAgImRvY3VtZW50TGlmZWN5Y2xlIjogImFjdGl2ZSIsCiAgICAgICAgICAgICAgICAiZnJhbWVUeXBlIjogIm91dGVybW9zdF9mcmFtZSIsCiAgICAgICAgICAgICAgICAiQWNjZXB0IjogImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKiIsCiAgICAgICAgICAgICAgICAiQWNjZXB0LUVuY29kaW5nIjogImd6aXAsIGRlZmxhdGUsIGJyLCB6c3RkIiwKICAgICAgICAgICAgICAgICJBY2NlcHQtTGFuZ3VhZ2UiOiAiamEsZW47cT0wLjksaWc7cT0wLjgsaXQ7cT0wLjcsc247cT0wLjYsdGc7cT0wLjUsdXo7cT0wLjQsbHQ7cT0wLjMsbnNvO3E9MC4yLGF6O3E9MC4xLGVlO3E9MC4xIiwKICAgICAgICAgICAgICAgICJhdXRob3JpemF0aW9uIjogY2ZnLmF1dGhvcml6YXRpb24sCiAgICAgICAgICAgICAgICAiQ29udGVudC1UeXBlIjogImFwcGxpY2F0aW9uL2pzb24iLAogICAgICAgICAgICAgICAgInNlYy1jaC11YSI6ICJcIk5vdClBO0JyYW5kXCI7dj1cIjk5XCIsIFwiR29vZ2xlIENocm9tZVwiO3Y9XCIxMjdcIiwgXCJDaHJvbWl1bVwiO3Y9XCIxMjdcIiIsCiAgICAgICAgICAgICAgICAic2VjLWNoLXVhLW1vYmlsZSI6ICI/MCIsCiAgICAgICAgICAgICAgICAic2VjLWNoLXVhLXBsYXRmb3JtIjogIlwiQ2hyb21lIE9TXCIiLAogICAgICAgICAgICAgICAgIlNlYy1GZXRjaC1EZXN0IjogImVtcHR5IiwKICAgICAgICAgICAgICAgICJTZWMtRmV0Y2gtTW9kZSI6ICJjb3JzIiwKICAgICAgICAgICAgICAgICJTZWMtRmV0Y2gtU2l0ZSI6ICJzYW1lLXNpdGUiLAogICAgICAgICAgICAgICAgIlVzZXItQWdlbnQiOiAiTW96aWxsYS81LjAgKFgxMTsgQ3JPUyB4ODZfNjQgMTQ1NDEuMC4wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI3LjAuMC4wIFNhZmFyaS81MzcuMzYiLAogICAgICAgICAgICAgICAgIlgtVXNlci1BZ2VudCI6ICJhYmNlZWQtd2ViOjcuMS4wL0Nocm9tZToxMjcuMC42NTMzLjEzMiIKICAgICAgICAgICAgICB9LAogICAgICAgICAgfSk7CiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykgewogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjg6zjgrnjg53jg7Pjgrnjgrnjg4bjg7zjgr/jgrk6ICR7cmVzcG9uc2Uuc3RhdHVzfWApOwogICAgICAgIH0KICAgIAogICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7CiAgICAgICAgY29uc29sZS5sb2coanNvbik7CiAgICAgICAgQW5zRGF0YSA9IGpzb247CiAgICAgICAgcU51bSA9IEFuc0RhdGEuYWxsX3F1ZXN0aW9uX2xpc3QubGVuZ3RoLTE7CiAgICAgICAgY29uc3Qgc2xlZXAgPSAodGltZSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpOwogICAgCiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBBbnNEYXRhLmFsbF9xdWVzdGlvbl9saXN0Lmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBjb25zdCBhbnMgPSBBbnNEYXRhLmFsbF9xdWVzdGlvbl9saXN0W2ldOwogICAgICAgICAgU2VuZEFucyhhbnMsIGksIHFOdW0pOwogICAgICAgICAgYXdhaXQgc2xlZXAoNTApOwogICAgICAgIH0KICAgICAgfSBjYXRjaCAoZXJyb3IpIHsKICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOwogICAgICB9CiAgICB9KCkpCiAgICAKICAgIC8vc2VuZCBhbnN3ZXIKICAgIGFzeW5jIGZ1bmN0aW9uIFNlbmRBbnMoQW5zTnVtLCBudW1QLCBxTnVtKSB7CiAgICAgIGNvbnN0IGJvZHkgPSB7CiAgICAgICAgInF1ZXN0aW9uX2xpc3QiOiBbCiAgICAgICAgICB7CiAgICAgICAgICAgICJpZF90ZXN0IjogY2ZnLlRlc3RJRCwKICAgICAgICAgICAgIm51bV9wYXJ0IjogQW5zTnVtLm51bV9wYXJ0LAogICAgICAgICAgICAibnVtX3F1ZXN0aW9uIjogQW5zTnVtLm51bV9xdWVzdGlvbiwKICAgICAgICAgICAgImlucHV0dGVkX2Fuc3dlciI6ICIiLAogICAgICAgICAgICAiaXNfdW5lYXN5IjogMCwKICAgICAgICAgICAgImNvbnN1bWVfc2Vjb25kIjogTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIDE1MCApLAogICAgICAgICAgICAiYWNxdWlyZV9zdGF0dXMiOiAxLAogICAgICAgICAgICAiY2hvaWNlZF9hbnN3ZXIiOiBBbnNOdW0udHJ1ZV9hbnN3ZXIKICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJpZF90YXNrIjogY2ZnLlRhc2tJRCwKICAgICAgICAiaWRfY2xhc3MiOiBjZmcuQ2xhc3NJRCwKICAgICAgICAiaXNfd29ybGRfcHJhY3RpY2UiOiAxCiAgICAgIH0KICAgICAgaWYgKHFOdW0gPT0gbnVtUCkgewogICAgICAgIGJvZHkuaGFzX2ZpbmlzaGVkX3dvcmxkX3ByYWN0aWNlID0gMTsKICAgICAgICBjb25zb2xlLmxvZygiYWRkIik7CiAgICAgIH0KICAgICAgY29uc3QgdXJsID0gImh0dHBzOi8vYXBwLWFwaS5hYmNlZWQuY29tL3dlYi9xdWVzdGlvbi9ncmFkaW5nIjsKICAgICAgdHJ5IHsKICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCx7CiAgICAgICAgICBtZXRob2Q6ICJQT1NUIiwKICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLAogICAgICAgICAgICBoZWFkZXJzOiB7CiAgICAgICAgICAgICAgICAiZG9jdW1lbnRMaWZlY3ljbGUiOiAiYWN0aXZlIiwKICAgICAgICAgICAgICAgICJmcmFtZVR5cGUiOiAib3V0ZXJtb3N0X2ZyYW1lIiwKICAgICAgICAgICAgICAgICJBY2NlcHQiOiAiYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qIiwKICAgICAgICAgICAgICAgICJBY2NlcHQtRW5jb2RpbmciOiAiZ3ppcCwgZGVmbGF0ZSwgYnIsIHpzdGQiLAogICAgICAgICAgICAgICAgIkFjY2VwdC1MYW5ndWFnZSI6ICJqYSxlbjtxPTAuOSxpZztxPTAuOCxpdDtxPTAuNyxzbjtxPTAuNix0ZztxPTAuNSx1ejtxPTAuNCxsdDtxPTAuMyxuc287cT0wLjIsYXo7cT0wLjEsZWU7cT0wLjEiLAogICAgICAgICAgICAgICAgImF1dGhvcml6YXRpb24iOiBjZmcuYXV0aG9yaXphdGlvbiwKICAgICAgICAgICAgICAgICJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiIsCiAgICAgICAgICAgICAgICAic2VjLWNoLXVhIjogIlwiTm90KUE7QnJhIG5kXCI7dj1cIjk5XCIsIFwiR29vZ2xlIENocm9tZVwiO3Y9XCIxMjdcIiwgXCJDaHJvbWl1bVwiO3Y9XCIxMjdcIiIsCiAgICAgICAgICAgICAgICAic2VjLWNoLXVhLW1vYmlsZSI6ICI/MCIsCiAgICAgICAgICAgICAgICAic2VjLWNoLXVhLXBsYXRmb3JtIjogIlwiQ2hyb21lIE9TXCIiLAogICAgICAgICAgICAgICAgIlNlYy1GZXRjaC1EZXN0IjogImVtcHR5IiwKICAgICAgICAgICAgICAgICJTZWMtRmV0Y2gtTW9kZSI6ICJjb3JzIiwKICAgICAgICAgICAgICAgICJTZWMtRmV0Y2gtU2l0ZSI6ICJzYW1lLXNpdGUiLAogICAgICAgICAgICAgICAgIlVzZXItQWdlbnQiOiAiTW96aWxsYS81LjAgKFgxMTsgQ3JPUyB4ODZfNjQgMTQ1NDEuMC4wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI3LjAuMC4wIFNhZmFyaS81MzcuMzYiLAogICAgICAgICAgICAgICAgIlgtVXNlci1BZ2VudCI6ICJhYmNlZWQtd2ViOjcuMS4wL0Nocm9tZToxMjcuMC42NTMzLjEzMiIKICAgICAgICAgICAgICB9LAogICAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7CiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHsKICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rJyk7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTsKICAgICAgICB9KQogICAgICAgIC50aGVuKGRhdGEgPT4gewogICAgICAgICAgY29uc29sZS5sb2coIlN1Y2Nlc3MgOiAiICsgbnVtUCk7CiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTsKICAgICAgICB9KQogICAgICAgIC5jYXRjaChlcnJvciA9PiB7CiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKTsKICAgICAgICB9KTsKICAgICAgfSBjYXRjaCAoZXJyb3IpIHsKICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOwogICAgICB9CiAgICB9CiAgICB9Ci8vYXV0byBlbmQKPC9zY3JpcHQ+");

//Init
const draggableElement = document.getElementById("draggableElement");
const hubbox = document.getElementById("hubbox");
makeDraggable(draggableElement);
document.getElementById("showHubbox").addEventListener("click", function() {
    makeDraggable(hubbox);
    hubbox.style.display = hubbox.style.display === "none" ? "block" : "none";
});
}())
