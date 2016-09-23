var common = {
    getSuccessObj: function(){
        return "OK";
    },
    getResultObj: function(obj){
        var obj = {data:obj};
        return obj;
    },
    getErrorObj: function(strError, code){
        var obj = {error:{}};
        if (!strError){
            strError = "system_error";
        }
        obj.error.description = strError;
        if (!code){
            code = 401;
        }
        obj.error.code = code;
        return obj;
    },
    isEmpty: function(obj){
        return (obj==undefined || obj==null || obj=="");
    },
    isError : function (obj){
        if (!this.isEmpty(obj)){
            if (!this.isEmpty(obj.error)) {
                return true;
            }
        }
        return false;
    },
    validCPF: function(cpf){
        // adaptado de  http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
        var Soma;
        var Resto;
        Soma = 0;
        if (cpf == "00000000000")
            return false;
        for (i=1; i<=9; i++)
            Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11))
            Resto = 0;
        if (Resto != parseInt(cpf.substring(9, 10)) )
            return false;
        Soma = 0;
        for (i = 1; i <= 10; i++)
            Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11))
            Resto = 0;
        if (Resto != parseInt(cpf.substring(10, 11) ) )
            return false;
        return true;
    }
};

module.exports = common;