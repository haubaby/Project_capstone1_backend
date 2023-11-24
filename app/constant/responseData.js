exports.responseData = (isSuccess,data,msg = "invalid condition") => {
        return {
            status:200,
            msg: msg,
            isSuccess,
            data
        }
    }
