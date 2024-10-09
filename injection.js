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
    let FakeMissGen = true;
    
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
async function RunAuto() {
    ShowCustomPop("Boot system...");

    cfg = {
        ClassID : AutoClearData.ClassID,
        TaskID : AutoClearData.TaskID,
        authorization : UserData.AuthToken,
        TestID : UserData.TestID,
    };

    await AutoClear(cfg);
}

async function AutoClear(cfg) {
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

        ShowCustomPop("All Clear!");
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
        if (Math.floor(Math.random() * 10) < (10 - 9) && FakeMissGen) {
            console.log("Miss!");
            if (AnsNum.true_answer != 4) {
                AnsNum.true_answer++
            } else {
                AnsNum.true_answer--
            }
        }

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
hub.innerHTML += atob("PHN0eWxlPgogIC5kcmFnZ2FibGUgewogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsKICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICB0b3A6IDUwcHg7CiAgICAgIGxlZnQ6IDUwcHg7CiAgICAgIGN1cnNvcjogbW92ZTsKICAgICAgZGlzcGxheTogZmxleDsKICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7CiAgICAgIHotaW5kZXg6IDEwMDA7CiAgICAgIHVzZXItc2VsZWN0OiBub25lOwogIH0KCiAgLnN3aXRjaGJ0biB7CiAgICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTYsIDEwOSwgMTQwKTsKICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgICAgIGNvbG9yOiBibGFjazsKICAgICAgY3Vyc29yOiBwb2ludGVyOwogIH0KCiAgI2h1YmJveCB7CiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICAgICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgICAgIGRpc3BsYXk6IG5vbmU7CiAgICAgIGN1cnNvcjogbW92ZTsKICAgICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7CiAgICAgIHBhZGRpbmc6IDIwcHggMjBweCAyMHB4IDIwcHg7CiAgICAgIHotaW5kZXg6ICAgOTk5OwogIH0KCiAgLnBvcCB7CiAgICBkaXNwbGF5OiBmbGV4OwogICAgcG9zaXRpb246IHJlbGF0aXZlOwogIH0KCiNsb2FkaW5nUG9wIHsKICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgZGlzcGxheTogbm9uZTsKICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7CiAgIHBhZGRpbmc6IDIwcHggMjBweCAyMHB4IDIwcHg7Cn0KCiNhbnN3ZXJQb3AgewogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsKICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICBkaXNwbGF5OiBub25lOwogICAgICBjdXJzb3I6IG1vdmU7CiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICAgICBwYWRkaW5nOiAyMHB4IDIwcHggMjBweCAyMHB4OwogICAgICB6LWluZGV4OiAgIDk5OTsKfQoKI2Nsb3NlQnRuIHsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdG9wOiAxMHB4OwogIHJpZ2h0OiAxMHB4OwogIGN1cnNvcjogcG9pbnRlcjsKfQoKI2N1c3RvbVBvcCB7CiAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgIGRpc3BsYXk6IG5vbmU7CiAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICBwYWRkaW5nOiAyMHB4IDIwcHggMjBweCAyMHB4Owp9CgogIC5kcmFnIHsKICAgICAgei1pbmRleDogMTAwMTsKICB9Cjwvc3R5bGU+Cgo8ZGl2IGlkPSJkcmFnZ2FibGVFbGVtZW50IiBjbGFzcz0iZHJhZ2dhYmxlIj4KICA8YnV0dG9uIGlkPSJzaG93SHViYm94IiBjbGFzcz0ic3dpdGNoYnRuIj5BYmNlZWQgVXRpbGl0eTwvYnV0dG9uPgo8L2Rpdj4KCjxkaXYgaWQ9Imh1YmJveCI+CiAgPGgxPjxiPkFiY2VlZCBVdGlsaXR5IEh1YjwvYj48L2gxPgogIDxhIG9uY2xpY2s9ImphdmFzY3JpcHQ6R2V0VXNlckRhdGEoKSI+SW5pdGFsaXplPC9hPjxicj4KPGEgb25jbGljaz0iamF2YXNjcmlwdDpTaG93QW5zd2VyKCkiPlZpZXcgQW5zd2VyPC9hPjxicj4KPGEgaWQ9InRnbEFzdCIgb25jbGljaz0iamF2YXNjcmlwdDpUb2dnbGVBc3Npc3QoKSI+QW5zd2VyIEFzc2lzdDwvYT48YnI+CjxhIG9uY2xpY2s9ImphdmFzY3JpcHQ6UnVuQXV0bygpIj5BdXRvIENvbXBsZXRlPC9hPjxicj4KPGRpdiBjbGFzcz0icG9wIj4KICA8aDEgaWQ9ImxvYWRpbmdQb3AiPkxvYWRpbmcuLi48L2gxPgogIDxoMSBpZD0iY3VzdG9tUG9wIj48L2gxPgo8L2Rpdj4KPC9kaXY+CjxkaXYgaWQ9ImFuc3dlclBvcCI+CiAgPGEgaWQ9ImNsb3NlQnRuIiBvbmNsaWNrPSJqYXZhc2NyaXB0OkNsb3NlRWxlbSgpIj7DlzwvYT4KPC9kaXY+Cgo8c2NyaXB0PiAgICAvL2Jvb3QganMKICAgIGxldCBPblF1ZXN0aW9uID0gKGxvY2F0aW9uLnBhdGhuYW1lID09ICIvYm9va3Mvc3R1ZHkvd29yZC10ZXN0LWNvbmZpcm0vcXVpeiIpOwogICAgbGV0IE9sZExvYzsKICAgIGlmICghT25RdWVzdGlvbikgewogICAgICAgIE9sZExvYyA9IGxvY2F0aW9uLnBhdGhuYW1lOwogICAgfQogICAgCiAgICBmdW5jdGlvbiBtYWtlRHJhZ2dhYmxlKGVsZW1lbnQpIHsKICAgICAgICBsZXQgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwLCBtb3VzZVggPSAwLCBtb3VzZVkgPSAwOwogICAgCiAgICAgICAgZWxlbWVudC5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHsKICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOwogICAgICAgICAgICBtb3VzZVggPSBlLmNsaWVudFg7CiAgICAgICAgICAgIG1vdXNlWSA9IGUuY2xpZW50WTsKICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gY2xvc2VEcmFnRWxlbWVudDsKICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBlbGVtZW50RHJhZzsKICAgICAgICB9OwogICAgCiAgICAgICAgZnVuY3Rpb24gZWxlbWVudERyYWcoZSkgewogICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7CiAgICAgICAgICAgIG9mZnNldFggPSBtb3VzZVggLSBlLmNsaWVudFg7CiAgICAgICAgICAgIG9mZnNldFkgPSBtb3VzZVkgLSBlLmNsaWVudFk7CiAgICAgICAgICAgIG1vdXNlWCA9IGUuY2xpZW50WDsKICAgICAgICAgICAgbW91c2VZID0gZS5jbGllbnRZOwogICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IChlbGVtZW50Lm9mZnNldFRvcCAtIG9mZnNldFkpICsgInB4IjsKICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gKGVsZW1lbnQub2Zmc2V0TGVmdCAtIG9mZnNldFgpICsgInB4IjsKICAgICAgICB9CiAgICAKICAgICAgICBmdW5jdGlvbiBjbG9zZURyYWdFbGVtZW50KCkgewogICAgICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsOwogICAgICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7CiAgICAgICAgfQogICAgfQogICAgCiAgICBmdW5jdGlvbiBTdGFydExvYWQoKSB7CiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJsb2FkaW5nUG9wIikuc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICB9CiAgICAKICAgIGZ1bmN0aW9uIEV4aXRMb2FkKCkgewogICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibG9hZGluZ1BvcCIpLnN0eWxlLmRpc3BsYXkgPSAibm9uZSI7CiAgICB9CiAgICAKICAgIC8vYWJjZWVkIHNjcmlwdAogICAgbGV0IEFuc3dlckRhdGE7CgogICAgbGV0IFVzZXJEYXRhID0gewogICAgICAgIEF1dGhUb2tlbiA6ICIiLAogICAgICAgIFRlc3RJRDogIiIsCiAgICB9CgogICAgbGV0IEF1dG9DbGVhckRhdGEgPSB7CiAgICAgICAgQ2xhc3NJRCA6ICIiLAogICAgICAgIFRhc2tJRCA6ICIiLAogICAgfQogICAgCiAgICBsZXQgQW5zd2VyQXNzaXN0ID0gZmFsc2U7CiAgICBsZXQgRmFrZU1pc3NHZW4gPSB0cnVlOwogICAgCiAgICBjb25zdCBzbGVlcCA9ICh0aW1lKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aW1lKSk7CiAgICAKICAgIGFzeW5jIGZ1bmN0aW9uIFNob3dDdXN0b21Qb3AobXMpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY3VzdG9tUG9wIikuc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImN1c3RvbVBvcCIpLnRleHRDb250ZW50ID0gbXM7CiAgICAgICAgYXdhaXQgc2xlZXAoNTAwKTsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY3VzdG9tUG9wIikuc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgIH0KICAgIAogICAgZnVuY3Rpb24gQXNzaXN0RnVuYygpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhbnN3ZXJQb3AiKS5jaGlsZHJlbi5sZW5ndGg7IGkrKykgewogICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5zd2VyUG9wIikuY2hpbGRyZW5baV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gIndoaXRlIjsKICAgICAgICB9CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFuc3dlclBvcCIpLmNoaWxkcmVuW051bWJlcihkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCJtYXJrc2hlZXQtYW5zd2VyX19udW1iZXIiKVswXS50ZXh0Q29udGVudC5yZXBsYWNlQWxsKCIgIiwiIikucmVwbGFjZUFsbCgiXG4iLCIiKS5zcGxpdCgiLyIpWzBdKSszXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAieWVsbG93IjsKICAgICAgICBjb25zb2xlLmxvZygiY2hhbmdlZCIpOwogICAgfQogICAgCiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbnNMaXN0KSA9PiB7CiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7CiAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0JykgewogICAgICAgICAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4gewogICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGluZycpICYmIEFuc3dlckFzc2lzdCkgewogICAgICAgICAgICAgICAgICAgICAgICBBc3Npc3RGdW5jKCk7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9OwogICAgCiAgICBjb25zdCBjb25maWcgPSB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9OwogICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7CiAgICAKICAgIGZ1bmN0aW9uIENsb3NlRWxlbSgpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5zd2VyUG9wIikuc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgIH0KCmZ1bmN0aW9uIEdldFVzZXJEYXRhKCkgewogICAgVXNlckRhdGEuQXV0aFRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oImFiY0p3dFRva2VuIik7CiAgICBBdXRvQ2xlYXJEYXRhLlRhc2tJRCA9IGxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCIvIilbM107CiAgICBBdXRvQ2xlYXJEYXRhLkNsYXNzSUQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCJhYmNlZWQiKSkuY2xhc3Nlcy5mb2N1c2VkQ2xhc3NJbmZvLmlkX2NsYXNzOwoKCiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcHAtYXBpLmFiY2VlZC5jb20vd2ViL3dvcmxkX3ByYWN0aWNlcy9pbmZvP2lkX3Rhc2s9Jytsb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgiLyIpWzNdOwogICAgZmV0Y2godXJsLCB7CiAgICAgICAgbWV0aG9kOiAnR0VUJywKICAgICAgICBoZWFkZXJzOiB7CiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgVXNlckRhdGEuQXV0aFRva2VuLAogICAgICAgICAgICAnc2VjLWNoLXVhJzogJyJOb3QpQTtCcmFuZCI7dj0iOTkiLCAiR29vZ2xlIENocm9tZSI7dj0iMTI3IiwgIkNocm9taXVtIjt2PSIxMjciJywKICAgICAgICAgICAgJ3NlYy1jaC11YS1tb2JpbGUnOiAnPzAnLAogICAgICAgICAgICAnc2VjLWNoLXVhLXBsYXRmb3JtJzogJyJDaHJvbWUgT1MiJywKICAgICAgICAgICAgJ1NlYy1GZXRjaC1EZXN0JzogJ2VtcHR5JywKICAgICAgICAgICAgJ1NlYy1GZXRjaC1Nb2RlJzogJ2NvcnMnLAogICAgICAgICAgICAnU2VjLUZldGNoLVNpdGUnOiAnc2FtZS1zaXRlJywKICAgICAgICAgICAgJ1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAgKFgxMTsgQ3JPUyB4ODZfNjQgMTQ1NDEuMC4wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI3LjAuMC4wIFNhZmFyaS81MzcuMzYnLAogICAgICAgICAgICAnWC1Vc2VyLUFnZW50JzogJ2FiY2VlZC13ZWI6Ny4xLjAvQ2hyb21lOjEyNy4wLjY1MzMuMTMyJywKICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJwogICAgICAgIH0sCiAgICB9KQogICAgLnRoZW4ocmVzcG9uc2UgPT4gewogICAgICAgIGlmICghcmVzcG9uc2Uub2spIHsKICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2snKTsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTsKICAgIH0pCiAgICAudGhlbihkYXRhID0+IHsKICAgICAgICBVc2VyRGF0YS5UZXN0SUQgPSBkYXRhLnRhc2tfaW5mby5pZF90ZXN0OwogICAgfSkKICAgIC5jYXRjaChlcnJvciA9PiB7CiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpOwogICAgfSk7CgogICAgU2hvd0N1c3RvbVBvcCgiU3VjY2VzcyIpOwp9CgpmdW5jdGlvbiBUb2dnbGVBc3Npc3QoKSB7CiAgICBpZiAobG9jYXRpb24ucGF0aG5hbWUgIT0gIi9ib29rcy9zdHVkeS93b3JkLXRlc3QtY29uZmlybS9xdWl6IikgewogICAgICAgIGFsZXJ0KCLjgr/jgrnjgq/jgpLplovlp4vjgZfjgabjgYvjgonmirzjgZfjgabjgY/jgaDjgZXjgYQiKTsKICAgICAgICByZXR1cm4KICAgIH0KICAgIGlmIChBbnN3ZXJBc3Npc3QpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidGdsQXN0Iikuc3R5bGUuc2V0UHJvcGVydHkoImJhY2tncm91bmQtY29sb3IiLCJ3aGl0ZSIsImltcG9ydGFudCIpOwogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0Z2xBc3QiKS5zdHlsZS5zZXRQcm9wZXJ0eSgiY29sb3IiLCJibGFjayIsImltcG9ydGFudCIpOwogICAgICAgIEFuc3dlckFzc2lzdCA9ICFBbnN3ZXJBc3Npc3Q7CiAgICAgICAgU2hvd0N1c3RvbVBvcCgiQXNzaXN0IE9GRiIpOwogICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTsKICAgIH0gZWxzZSB7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInRnbEFzdCIpLnN0eWxlLnNldFByb3BlcnR5KCJiYWNrZ3JvdW5kLWNvbG9yIiwicm95YWxibHVlIiwiaW1wb3J0YW50Iik7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInRnbEFzdCIpLnN0eWxlLnNldFByb3BlcnR5KCJjb2xvciIsIndoaXRlIiwiaW1wb3J0YW50Iik7CiAgICAgICAgQW5zd2VyQXNzaXN0ID0gIUFuc3dlckFzc2lzdDsKICAgICAgICBTaG93Q3VzdG9tUG9wKCJBc3Npc3QgT04iKTsKICAgICAgICBBc3Npc3RGdW5jKCk7CiAgICAgICAgCiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBjb25maWcpOwogICAgfQp9CmZ1bmN0aW9uIFNob3dBbnN3ZXIoKSB7CiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcHAtYXBpLmFiY2VlZC5jb20vd2ViL3dvcmxkX3ByYWN0aWNlcy9pbmZvP2lkX3Rhc2s9Jytsb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgiLyIpWzNdOwoKU3RhcnRMb2FkKCk7CmZldGNoKHVybCwgewogICAgbWV0aG9kOiAnR0VUJywKICAgIGhlYWRlcnM6IHsKICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIFVzZXJEYXRhLkF1dGhUb2tlbiwKICAgICAgICAnc2VjLWNoLXVhJzogJyJOb3QpQTtCcmFuZCI7dj0iOTkiLCAiR29vZ2xlIENocm9tZSI7dj0iMTI3IiwgIkNocm9taXVtIjt2PSIxMjciJywKICAgICAgICAnc2VjLWNoLXVhLW1vYmlsZSc6ICc/MCcsCiAgICAgICAgJ3NlYy1jaC11YS1wbGF0Zm9ybSc6ICciQ2hyb21lIE9TIicsCiAgICAgICAgJ1NlYy1GZXRjaC1EZXN0JzogJ2VtcHR5JywKICAgICAgICAnU2VjLUZldGNoLU1vZGUnOiAnY29ycycsCiAgICAgICAgJ1NlYy1GZXRjaC1TaXRlJzogJ3NhbWUtc2l0ZScsCiAgICAgICAgJ1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAgKFgxMTsgQ3JPUyB4ODZfNjQgMTQ1NDEuMC4wKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI3LjAuMC4wIFNhZmFyaS81MzcuMzYnLAogICAgICAgICdYLVVzZXItQWdlbnQnOiAnYWJjZWVkLXdlYjo3LjEuMC9DaHJvbWU6MTI3LjAuNjUzMy4xMzInLAogICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicKICAgIH0sCn0pCi50aGVuKHJlc3BvbnNlID0+IHsKICAgIGlmICghcmVzcG9uc2Uub2spIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvaycpOwogICAgfQogICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTsKfSkKLnRoZW4oZGF0YSA9PiB7CiAgICBjb25zb2xlLmxvZygnU3VjY2VzczonLCBkYXRhLmFsbF9xdWVzdGlvbl9saXN0KTsKICAgIEFuc3dlckRhdGEgPSBkYXRhLmFsbF9xdWVzdGlvbl9saXN0OwoKICAgIGFuc1BvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhbnN3ZXJQb3AiKTsKICAgIG1ha2VEcmFnZ2FibGUoYW5zUG9wKTsKICAgIGFuc1BvcC5pbm5lckhUTUwgPSAnPGEgaWQ9ImNsb3NlQnRuIiBvbmNsaWNrPSJqYXZhc2NyaXB0OkNsb3NlRWxlbSgpIj7DlzwvYT4nOwogICAgdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJoMSIpOwogICAgdGUudGV4dENvbnRlbnQgPSAiQW5zd2VyIExpc3QiOwogICAgYW5zUG9wLmFwcGVuZENoaWxkKHRlKTsKICAgIEFuc3dlckxpc3RFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYSIpOwogICAgQW5zd2VyTGlzdEVsZW0uaW5uZXJIVE1MID0gYOiLseiqniDml6XmnKzoqp48aHIgc3R5bGU9ImJvcmRlcjogbm9uZSAhaW1wb3J0YW50O2JvcmRlci10b3A6IDFweCBzb2xpZCBibGFjayAhaW1wb3J0YW50O21hcmdpbjogMCAhaW1wb3J0YW50OyI+PGJyPmA7CiAgICBhbnNQb3AuYXBwZW5kQ2hpbGQoQW5zd2VyTGlzdEVsZW0pOwogICAgZGF0YS5hbGxfcXVlc3Rpb25fbGlzdC5mb3JFYWNoKGFucyA9PiB7CiAgICAgICAgQW5zd2VyTGlzdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJhIik7CiAgICAgICAgQW5zd2VyTGlzdEVsZW0uaW5uZXJIVE1MID0gYCR7YW5zLndvcmR9ICR7YW5zLndvcmRfamF9PGhyIHN0eWxlPSJib3JkZXI6IG5vbmUgIWltcG9ydGFudDtib3JkZXItdG9wOiAxcHggc29saWQgYmxhY2sgIWltcG9ydGFudDttYXJnaW46IDAgIWltcG9ydGFudDsiPjxicj5gOwogICAgICAgIGFuc1BvcC5hcHBlbmRDaGlsZChBbnN3ZXJMaXN0RWxlbSk7CiAgICB9KTsKICAgIGFuc1BvcC5zdHlsZS5kaXNwbGF5ID0gImJsb2NrIjsKfSkKLmNhdGNoKGVycm9yID0+IHsKICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKTsKfSkuZmluYWxseSgoKSA9PiB7CiAgICBFeGl0TG9hZCgpOwp9KTsKfQoKLy9hdXRvIGNsZWFyCmFzeW5jIGZ1bmN0aW9uIFJ1bkF1dG8oKSB7CiAgICBTaG93Q3VzdG9tUG9wKCJCb290IHN5c3RlbS4uLiIpOwoKICAgIGNmZyA9IHsKICAgICAgICBDbGFzc0lEIDogQXV0b0NsZWFyRGF0YS5DbGFzc0lELAogICAgICAgIFRhc2tJRCA6IEF1dG9DbGVhckRhdGEuVGFza0lELAogICAgICAgIGF1dGhvcml6YXRpb24gOiBVc2VyRGF0YS5BdXRoVG9rZW4sCiAgICAgICAgVGVzdElEIDogVXNlckRhdGEuVGVzdElELAogICAgfTsKCiAgICBhd2FpdCBBdXRvQ2xlYXIoY2ZnKTsKfQoKYXN5bmMgZnVuY3Rpb24gQXV0b0NsZWFyKGNmZykgewogICAgLy9nZXQgYW5zd2VyCiAgICBsZXQgQW5zRGF0YTsKICAgIAogICAgKGFzeW5jIGZ1bmN0aW9uKCl7CiAgICAgIGNvbnN0IHVybCA9ICJodHRwczovL2FwcC1hcGkuYWJjZWVkLmNvbS93ZWIvd29ybGRfcHJhY3RpY2VzL2luZm8/aWRfdGFzaz0iICsgY2ZnLlRhc2tJRDsKICAgICAgdHJ5IHsKICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCx7CiAgICAgICAgICAgIGhlYWRlcnM6IHsKICAgICAgICAgICAgICAgICJkb2N1bWVudExpZmVjeWNsZSI6ICJhY3RpdmUiLAogICAgICAgICAgICAgICAgImZyYW1lVHlwZSI6ICJvdXRlcm1vc3RfZnJhbWUiLAogICAgICAgICAgICAgICAgIkFjY2VwdCI6ICJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyoiLAogICAgICAgICAgICAgICAgIkFjY2VwdC1FbmNvZGluZyI6ICJnemlwLCBkZWZsYXRlLCBiciwgenN0ZCIsCiAgICAgICAgICAgICAgICAiQWNjZXB0LUxhbmd1YWdlIjogImphLGVuO3E9MC45LGlnO3E9MC44LGl0O3E9MC43LHNuO3E9MC42LHRnO3E9MC41LHV6O3E9MC40LGx0O3E9MC4zLG5zbztxPTAuMixhejtxPTAuMSxlZTtxPTAuMSIsCiAgICAgICAgICAgICAgICAiYXV0aG9yaXphdGlvbiI6ICJCZWFyZXIgIiArIGNmZy5hdXRob3JpemF0aW9uLAogICAgICAgICAgICAgICAgIkNvbnRlbnQtVHlwZSI6ICJhcHBsaWNhdGlvbi9qc29uIiwKICAgICAgICAgICAgICAgICJzZWMtY2gtdWEiOiAiXCJOb3QpQTtCcmFuZFwiO3Y9XCI5OVwiLCBcIkdvb2dsZSBDaHJvbWVcIjt2PVwiMTI3XCIsIFwiQ2hyb21pdW1cIjt2PVwiMTI3XCIiLAogICAgICAgICAgICAgICAgInNlYy1jaC11YS1tb2JpbGUiOiAiPzAiLAogICAgICAgICAgICAgICAgInNlYy1jaC11YS1wbGF0Zm9ybSI6ICJcIkNocm9tZSBPU1wiIiwKICAgICAgICAgICAgICAgICJTZWMtRmV0Y2gtRGVzdCI6ICJlbXB0eSIsCiAgICAgICAgICAgICAgICAiU2VjLUZldGNoLU1vZGUiOiAiY29ycyIsCiAgICAgICAgICAgICAgICAiU2VjLUZldGNoLVNpdGUiOiAic2FtZS1zaXRlIiwKICAgICAgICAgICAgICAgICJVc2VyLUFnZW50IjogIk1vemlsbGEvNS4wIChYMTE7IENyT1MgeDg2XzY0IDE0NTQxLjAuMCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNy4wLjAuMCBTYWZhcmkvNTM3LjM2IiwKICAgICAgICAgICAgICAgICJYLVVzZXItQWdlbnQiOiAiYWJjZWVkLXdlYjo3LjEuMC9DaHJvbWU6MTI3LjAuNjUzMy4xMzIiCiAgICAgICAgICAgICAgfSwKICAgICAgICAgIH0pOwogICAgICAgIGlmICghcmVzcG9uc2Uub2spIHsKICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Os44K544Od44Oz44K544K544OG44O844K/44K5OiAke3Jlc3BvbnNlLnN0YXR1c31gKTsKICAgICAgICB9CiAgICAKICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpOwogICAgICAgIGNvbnNvbGUubG9nKGpzb24pOwogICAgICAgIEFuc0RhdGEgPSBqc29uOwogICAgICAgIHFOdW0gPSBBbnNEYXRhLmFsbF9xdWVzdGlvbl9saXN0Lmxlbmd0aC0xOwogICAgICAgIGNvbnN0IHNsZWVwID0gKHRpbWUpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRpbWUpKTsKICAgIAogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQW5zRGF0YS5hbGxfcXVlc3Rpb25fbGlzdC5sZW5ndGg7IGkrKykgewogICAgICAgICAgY29uc3QgYW5zID0gQW5zRGF0YS5hbGxfcXVlc3Rpb25fbGlzdFtpXTsKICAgICAgICAgIFNlbmRBbnMoYW5zLCBpLCBxTnVtKTsKICAgICAgICAgIEFkZFN0dWR5VGltZShjZmcpOwogICAgICAgICAgYXdhaXQgc2xlZXAoNTApOwogICAgICAgIH0KICAgICAgfSBjYXRjaCAoZXJyb3IpIHsKICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpOwogICAgICB9CiAgICB9KCkpCiAgICAKICAgIC8vYWRkIHN0dWR5IHRpbWUKICAgIGFzeW5jIGZ1bmN0aW9uIEFkZFN0dWR5VGltZShjZmcpIHsKICAgICAgICBjb25zdCBib2R5ID0gewogICAgICAgICAgICAiYWRkX3NlY29uZCI6TWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIDMwICksCiAgICAgICAgICAgICJpZF90YXNrIjpjZmcuVGFza0lELAogICAgICAgICAgICAiaWRfdGVzdCI6Y2ZnLlRlc3RJRCwKICAgICAgICB9CgogICAgICAgIGNvbnNvbGUubG9nKCJhZGRlZCA6ICIsYm9keS5hZGRfc2Vjb25kKTsKCiAgICAgICAgY29uc3QgdXJsID0gImh0dHBzOi8vYXBwLWFwaS5hYmNlZWQuY29tL3dlYi9zdHVkeV90aW1lL3VwZGF0ZSI7CiAgICAgICAgYXdhaXQgZmV0Y2godXJsLHsKICAgICAgICAgICAgbWV0aG9kOiAiUE9TVCIsCiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLAogICAgICAgICAgICBoZWFkZXJzOiB7CiAgICAgICAgICAgICAgICAiZG9jdW1lbnRMaWZlY3ljbGUiOiAiYWN0aXZlIiwKICAgICAgICAgICAgICAgICJmcmFtZVR5cGUiOiAib3V0ZXJtb3N0X2ZyYW1lIiwKICAgICAgICAgICAgICAgICJBY2NlcHQiOiAiYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qIiwKICAgICAgICAgICAgICAgICJBY2NlcHQtRW5jb2RpbmciOiAiZ3ppcCwgZGVmbGF0ZSwgYnIsIHpzdGQiLAogICAgICAgICAgICAgICAgIkFjY2VwdC1MYW5ndWFnZSI6ICJqYSxlbjtxPTAuOSxpZztxPTAuOCxpdDtxPTAuNyxzbjtxPTAuNix0ZztxPTAuNSx1ejtxPTAuNCxsdDtxPTAuMyxuc287cT0wLjIsYXo7cT0wLjEsZWU7cT0wLjEiLAogICAgICAgICAgICAgICAgImF1dGhvcml6YXRpb24iOiAiQmVhcmVyICIrY2ZnLmF1dGhvcml6YXRpb24sCiAgICAgICAgICAgICAgICAiQ29udGVudC1UeXBlIjogImFwcGxpY2F0aW9uL2pzb24iLAogICAgICAgICAgICAgICAgInNlYy1jaC11YSI6ICJcIk5vdClBO0JyYSBuZFwiO3Y9XCI5OVwiLCBcIkdvb2dsZSBDaHJvbWVcIjt2PVwiMTI3XCIsIFwiQ2hyb21pdW1cIjt2PVwiMTI3XCIiLAogICAgICAgICAgICAgICAgInNlYy1jaC11YS1tb2JpbGUiOiAiPzAiLAogICAgICAgICAgICAgICAgInNlYy1jaC11YS1wbGF0Zm9ybSI6ICJcIkNocm9tZSBPU1wiIiwKICAgICAgICAgICAgICAgICJTZWMtRmV0Y2gtRGVzdCI6ICJlbXB0eSIsCiAgICAgICAgICAgICAgICAiU2VjLUZldGNoLU1vZGUiOiAiY29ycyIsCiAgICAgICAgICAgICAgICAiU2VjLUZldGNoLVNpdGUiOiAic2FtZS1zaXRlIiwKICAgICAgICAgICAgICAgICJVc2VyLUFnZW50IjogIk1vemlsbGEvNS4wIChYMTE7IENyT1MgeDg2XzY0IDE0NTQxLjAuMCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNy4wLjAuMCBTYWZhcmkvNTM3LjM2IiwKICAgICAgICAgICAgICAgICJYLVVzZXItQWdlbnQiOiAiYWJjZWVkLXdlYjo3LjEuMC9DaHJvbWU6MTI3LjAuNjUzMy4xMzIiCiAgICAgICAgICAgICAgfSwKICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHsKICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykgewogICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCJFcnJvciA6IixyZXNwb25zZS5zdGF0dXMpOwogICAgICAgICAgICB9ZWxzZXsKICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTsKICAgICAgICAgICAgfQogICAgICAgIH0pOwogICAgfQogICAgLy9hZGQgZW5kCgogICAgLy9zZW5kIGFuc3dlcgogICAgYXN5bmMgZnVuY3Rpb24gU2VuZEFucyhBbnNOdW0sIG51bVAsIHFOdW0pIHsKICAgICAgICBpZiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApIDwgKDEwIC0gOSkgJiYgRmFrZU1pc3NHZW4pIHsKICAgICAgICAgICAgY29uc29sZS5sb2coIk1pc3MhIik7CiAgICAgICAgICAgIGlmIChBbnNOdW0udHJ1ZV9hbnN3ZXIgIT0gNCkgewogICAgICAgICAgICAgICAgQW5zTnVtLnRydWVfYW5zd2VyKysKICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgIEFuc051bS50cnVlX2Fuc3dlci0tCiAgICAgICAgICAgIH0KICAgICAgICB9CgogICAgICBjb25zdCBib2R5ID0gewogICAgICAgICJxdWVzdGlvbl9saXN0IjogWwogICAgICAgICAgewogICAgICAgICAgICAiaWRfdGVzdCI6IGNmZy5UZXN0SUQsCiAgICAgICAgICAgICJudW1fcGFydCI6IEFuc051bS5udW1fcGFydCwKICAgICAgICAgICAgIm51bV9xdWVzdGlvbiI6IEFuc051bS5udW1fcXVlc3Rpb24sCiAgICAgICAgICAgICJpbnB1dHRlZF9hbnN3ZXIiOiAiIiwKICAgICAgICAgICAgImlzX3VuZWFzeSI6IDAsCiAgICAgICAgICAgICJjb25zdW1lX3NlY29uZCI6IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiAxNTAgKSwKICAgICAgICAgICAgImFjcXVpcmVfc3RhdHVzIjogMSwKICAgICAgICAgICAgImNob2ljZWRfYW5zd2VyIjogQW5zTnVtLnRydWVfYW5zd2VyCiAgICAgICAgICB9CiAgICAgICAgXSwKICAgICAgICAiaWRfdGFzayI6IGNmZy5UYXNrSUQsCiAgICAgICAgImlkX2NsYXNzIjogY2ZnLkNsYXNzSUQsCiAgICAgICAgImlzX3dvcmxkX3ByYWN0aWNlIjogMQogICAgICB9CiAgICAgIGlmIChxTnVtID09IG51bVApIHsKICAgICAgICBib2R5Lmhhc19maW5pc2hlZF93b3JsZF9wcmFjdGljZSA9IDE7CiAgICAgICAgY29uc29sZS5sb2coImFkZCIpOwogICAgICB9CiAgICAgIGNvbnN0IHVybCA9ICJodHRwczovL2FwcC1hcGkuYWJjZWVkLmNvbS93ZWIvcXVlc3Rpb24vZ3JhZGluZyI7CiAgICAgIHRyeSB7CiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsewogICAgICAgICAgbWV0aG9kOiAiUE9TVCIsCiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KSwKICAgICAgICAgICAgaGVhZGVyczogewogICAgICAgICAgICAgICAgImRvY3VtZW50TGlmZWN5Y2xlIjogImFjdGl2ZSIsCiAgICAgICAgICAgICAgICAiZnJhbWVUeXBlIjogIm91dGVybW9zdF9mcmFtZSIsCiAgICAgICAgICAgICAgICAiQWNjZXB0IjogImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKiIsCiAgICAgICAgICAgICAgICAiQWNjZXB0LUVuY29kaW5nIjogImd6aXAsIGRlZmxhdGUsIGJyLCB6c3RkIiwKICAgICAgICAgICAgICAgICJBY2NlcHQtTGFuZ3VhZ2UiOiAiamEsZW47cT0wLjksaWc7cT0wLjgsaXQ7cT0wLjcsc247cT0wLjYsdGc7cT0wLjUsdXo7cT0wLjQsbHQ7cT0wLjMsbnNvO3E9MC4yLGF6O3E9MC4xLGVlO3E9MC4xIiwKICAgICAgICAgICAgICAgICJhdXRob3JpemF0aW9uIjogIkJlYXJlciAiK2NmZy5hdXRob3JpemF0aW9uLAogICAgICAgICAgICAgICAgIkNvbnRlbnQtVHlwZSI6ICJhcHBsaWNhdGlvbi9qc29uIiwKICAgICAgICAgICAgICAgICJzZWMtY2gtdWEiOiAiXCJOb3QpQTtCcmEgbmRcIjt2PVwiOTlcIiwgXCJHb29nbGUgQ2hyb21lXCI7dj1cIjEyN1wiLCBcIkNocm9taXVtXCI7dj1cIjEyN1wiIiwKICAgICAgICAgICAgICAgICJzZWMtY2gtdWEtbW9iaWxlIjogIj8wIiwKICAgICAgICAgICAgICAgICJzZWMtY2gtdWEtcGxhdGZvcm0iOiAiXCJDaHJvbWUgT1NcIiIsCiAgICAgICAgICAgICAgICAiU2VjLUZldGNoLURlc3QiOiAiZW1wdHkiLAogICAgICAgICAgICAgICAgIlNlYy1GZXRjaC1Nb2RlIjogImNvcnMiLAogICAgICAgICAgICAgICAgIlNlYy1GZXRjaC1TaXRlIjogInNhbWUtc2l0ZSIsCiAgICAgICAgICAgICAgICAiVXNlci1BZ2VudCI6ICJNb3ppbGxhLzUuMCAoWDExOyBDck9TIHg4Nl82NCAxNDU0MS4wLjApIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjcuMC4wLjAgU2FmYXJpLzUzNy4zNiIsCiAgICAgICAgICAgICAgICAiWC1Vc2VyLUFnZW50IjogImFiY2VlZC13ZWI6Ny4xLjAvQ2hyb21lOjEyNy4wLjY1MzMuMTMyIgogICAgICAgICAgICAgIH0sCiAgICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHsKICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykgewogICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2snKTsKICAgICAgICAgICAgfQogICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOwogICAgICAgIH0pCiAgICAgICAgLnRoZW4oZGF0YSA9PiB7CiAgICAgICAgICBjb25zb2xlLmxvZygiU3VjY2VzcyA6ICIgKyBudW1QKTsKICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpOwogICAgICAgIH0pCiAgICAgICAgLmNhdGNoKGVycm9yID0+IHsKICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpOwogICAgICAgIH0pOwogICAgICB9IGNhdGNoIChlcnJvcikgewogICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7CiAgICAgIH0KICAgIH0KCiAgICBTaG93Q3VzdG9tUG9wKCJjbGVhciEiKTsKfQovL2F1dG8gZW5kCjwvc2NyaXB0Pg==");

//Init
const draggableElement = document.getElementById("draggableElement");
const hubbox = document.getElementById("hubbox");
makeDraggable(draggableElement);
document.getElementById("showHubbox").addEventListener("click", function() {
    makeDraggable(hubbox);
    hubbox.style.display = hubbox.style.display === "none" ? "block" : "none";
});
}())
