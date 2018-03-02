# ITMS Analystics API

We made the use of these end-points from ITSM system in order to retrive the data
 to our custom API and develops some analysis based on Hyundai Motors IT Assistence.

> _Action_: Login
>    - __Method__ : POST
>    - __Uri__ : https://itsm.hmckmc.co.kr/login.do?processId=&fromType=&uId=
>    - __Header__ :
>        - Accept: text/html, application/xhtml+xml, */*
>        - Accept-Language: pt-BR
>        - Content-Type: application/x-www-form-urlencoded
>    - __Body__ :
>        - userId=A400032&passwd=12345R.mon&language=en

> _Action_: Tickets List HTML
>    - __Method__ : GET
>    - __Uri__ : https://itsm.hmckmc.co.kr/requestMng/requestMngSearchForm.do
>    - __Header__ :
>        - Accept-Language: pt-BR
>        - Content-Type: application/x-www-form-urlencoded
>        - Accept: application/x-ms-application, image/jpeg, application/xaml+xml, image/gif, image/pjpeg, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*
>    - __Body__ :
>         - initSearchYn=Y&selectedId=&checkCoulmList=&tableName=&tabFlag=BASIC&statusFlag=&statusLastIndex=&statusCheck=A15%2CA40%2CA50%2CA60%2CA70%2CA75%2CA80%2CA85%2CA90%2CA95&statusTypeCheck=M001%2CM002%2CM006%2CM008%2CM004%2CM010&statusGrade=&searchKeyword=search&mockKeyword=1%3D2&listBack=REQ_MGR&listType=&searchSortType=&searchSort=INIT_SORT&searchToggle=&menuStatus=Request+%3E+Service+Request+Mgmt.&searchTitleYn=&searchKeywordProbsummary=&pageIndex=1&menuId=1528&searchTitle=&searchReqUserCompany=H301&searchClass=&searchCbu=H304&searchAssigneeName=&searchAssignee=&searchSatisfaction=&searchProcessId=&searchZreqId=&statusGubunType1=t&_statusGubunType1=on&statusGubunType2=t&_statusGubunType2=on&statusGubunType3=t&_statusGubunType3=on&searchAssigneementName=&searchAssigneement=&searchUpdateTimeStart=2017-03-01+00%3A00%3A59&searchUpdateTimeEnd=2017-03-31+23%3A59%3A59&searchDelay=&resolvedTimeStart=&resolvedTimeEnd=&searchTargetTimeStart=&searchTargetTimeEnd=&statusGubun2=t&_statusGubun2=on&statusGubun3=t&_statusGubun3=on&statusGubun4=t&_statusGubun4=on&statusGubun5=t&_statusGubun5=on&_statusGubun6=on

> _Action_: Tickets List XLSX
>    - __Method__ : POST
>    - __Uri__ : https://itsm.hmckmc.co.kr/common/ExcelDownProc.do
>    - __Header__ : 
>        - Accept: application/x-ms-application, image/jpeg, application/xaml+xml, image/gif, image/pjpeg, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*
>        - Referer: https://itsm.hmckmc.co.kr/requestMng/requestMngSearchForm.do
>        - Accept-Language: pt-BR
>        - User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)
>        - Content-Type: application/x-www-form-urlencoded
>        - Accept-Encoding: gzip, deflate
>        - Host: itsm.hmckmc.co.kr
>        - DNT: 1
>        - Cache-Control: no-cache
>    - __Body__ :
>        - initSearchYn=&selectedId=&checkCoulmList=ID%2CINCIDENT_TYPE%2CSERVICE_TYPE%2CSTEP%2CCBU%2CCREATED_BY%2CREQUESTER%2CREQUESTER_COMPANY%2CREQUESTER_USER_ID%2CREQUESTER_PHONE%2CRECEIPT_BY%2CMAIN_OPERATOR%2CSERVICE_1ST_CATEGORY%2CSERVICE_2ND_CATEGORY%2CSERVICE_3RD_CATEGORY%2CSERVICE_NAME%2CIMPACT%2CSEVERITY%2CPRIORITY%2CTITLE%2CDESCRIPTION%2CRESOLUTION%2CREASON_CODE%2CRESOLUTION_CODE%2COPERATING_TEAM%2CASSIGNEE_P_ID%2CASSIGNEE_P%2CASSIGNEE_S%2COPEN_DATE%2CTRANSFER_DATE%2CRECEIPT_DATE%2CTARGET_DATE%2CACTUAL_START_DATE%2CACTUAL_RESOLVED_DATE%2CRESOLVED_DATE%2CCLOSED_DATE%2CEXPECTED_DATE%2CTIME_TO_RESOLVE_MIN%2CSATISFACTION%2CSATISFACTION_COMMENTS%2CSATISFACTION_DATE%2CSERVICE%2CSERVICE_CI%2CUAT_REQ%2CDIVISION%2CDEPARTMENT&tableName=REQUESTMNG_EXCEL_EN&tabFlag=BASIC&statusFlag=&statusLastIndex=&statusCheck=A15%2CA40%2CA50%2CA60%2CA70%2CA75%2CA80%2CA85%2CA90%2CA95&statusTypeCheck=M001%2CM002%2CM006%2CM008%2CM004%2CM010&statusGrade=&searchKeyword=1%3D1&mockKeyword=1%3D2&listBack=REQ_MGR&listType=&searchSortType=&searchSort=INIT_SORT&searchToggle=&menuStatus=Request+%3E+Service+Request+Mgmt.&searchTitleYn=&searchKeywordProbsummary=&pageIndex=1&menuId=1528&searchTitle=&searchReqUserCompany=H301&searchClass=&searchCbu=H304&searchAssigneeName=&searchAssignee=&searchSatisfaction=&searchProcessId=&searchZreqId=&statusGubunType1=t&_statusGubunType1=on&statusGubunType2=t&_statusGubunType2=on&statusGubunType3=t&_statusGubunType3=on&searchAssigneementName=&searchAssigneement=&searchUpdateTimeStart=2017-03-01+00%3A00%3A59&searchUpdateTimeEnd=2017-03-31+23%3A59%3A59&searchDelay=&resolvedTimeStart=&resolvedTimeEnd=&searchTargetTimeStart=&searchTargetTimeEnd=&statusGubun2=t&_statusGubun2=on&statusGubun3=t&_statusGubun3=on&statusGubun4=t&_statusGubun4=on&statusGubun5=t&_statusGubun5=on&_statusGubun6=on

> _Action_ : Logout
>    - __Method__ : POST
>    - __Uri__ : https://itsm.hmckmc.co.kr/main/logOut.do
>    - __Header__: 
>        - Accept: application/x-ms-application, image/jpeg, application/xaml+xml, image/gif, image/pjpeg, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*
>        - Accept-Language: pt-BR
>        - Content-Type: application/x-www-form-urlencoded
>    - __Body__ :
>        - selId=&selName=&pageUrl=&userType=ADMIN&searchKeyWord=