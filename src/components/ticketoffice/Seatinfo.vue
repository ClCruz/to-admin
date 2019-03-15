<template>
<div class="container">
    <div v-bind:class="{ notice_success: isOpen, notice_warning: isSelected, notice: true }">
        <div class="cardinfo">
            <div class="box" v-if="isloaded">
                <h2>{{NomSala}} - {{NomSetor}}<br><span>{{NomObjeto}} ({{indice}})</span></h2>
                <p v-if="isOpen">Assento disponível</p>
                <p v-if="isBought">Assento comprado</p>
                <p v-if="isReserved">Assento reservado</p>
                <p v-if="isSelected">Assento selecionado por você</p>
                <p v-if="isBought && isTicketOffice">Compra efetuada pela Bilheteria (Usuário: {{login}})</p>
                <p v-if="isWeb">Compra efetuada pela internet</p>
                <p v-if="isBought">Tipo de Bilhete: {{TipBilhete}}</p>
                <p v-if="isBought">Forma de Pagamento: {{ForPagto}}</p>
                <p v-if="isBought || isReserved">Emitido para: {{Nome}} ({{CPF}})</p>
                <p v-if="isBought || isReserved">Telefone: ({{DDD}}) {{Telefone}}</p>
                <p v-if="isBought">Código Venda: {{CodVenda}}</p>
                <p v-if="isReserved">Código Reserva: {{CodReserva}}</p>
                <p v-if="isBought && isWeb">Pedido: {{id_pedido_venda}}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import { func } from '@/functions';
import { funcOperation } from '../ticketoffice/services/functions';
import { eventService } from '../ticketoffice/services/event';

export default {
    name: "seatinfo",
    mixins: [func, funcOperation],
    props: ["indice", "id_apresentacao"],
    data () {
        return {
            isloaded: false,
            isBought: false,
            isReserved: false,
            isOpen: false,
            isSelected: false,
            isWeb: false,
            isTicketOffice: false,
            NomSala: '',
            NomObjeto: '',
            NomSetor: '',
            TipBilhete: '',
            ForPagto: '',
            Nome: '',
            CPF: '',
            DDD: '',
            Telefone: '',
            StaCadeira: '',
            CodVenda: "",
            id_pedido_venda: "",
        }
    },
    mounted () {
        this.get();
    },
    created () {
    },
    computed: {
    },
    methods: {
        get() {            
            this.isloaded = false;
            this.showWaitAboveAll();
            eventService.seatinfo(this.getLoggedId(), this.get_id_base(), this.id_apresentacao, this.indice).then(response=> {
                    this.hideWaitAboveAll();
                    if (this.validateJSON(response))
                    {
                        this.isloaded = true;
                        console.log(response);

                        this.isBought = response.isBought == 1;
                        this.isReserved = response.isReserved == 1;
                        this.isOpen = response.isOpen == 1;
                        this.isSelected = response.isSelected == 1;
                        this.isWeb = response.isWeb == 1;
                        this.isTicketOffice = response.isTicketOffice == 1;
                        this.NomSala = response.NomSala;
                        this.NomObjeto = response.NomObjeto;
                        this.NomSetor = response.NomSetor;
                        this.TipBilhete = response.TipBilhete;
                        this.ForPagto = response.ForPagto;
                        this.Nome = response.Nome;
                        this.CPF = response.CPF;
                        this.DDD = response.DDD;
                        this.Telefone = response.Telefone;
                        this.StaCadeira = response.StaCadeira;
                        this.CodVenda = response.CodVenda;
                        this.id_pedido_venda = response.id_pedido_venda;
                        this.login = response.login;
                        this.CodReserva = response.CodReserva;

                    }
                }
                ,error=> {
                    this.hideWaitAboveAll();
                    this.toastError("Falha na execução.");
            });
        },
    }
}
</script>

<style scoped>
.notice {
    padding: 15px;
    background-color: #fafafa;
    border-left: 6px solid #7f7f84;
    margin-bottom: 10px;
    -webkit-box-shadow: 0 5px 8px -6px rgba(0,0,0,.2);
       -moz-box-shadow: 0 5px 8px -6px rgba(0,0,0,.2);
            box-shadow: 0 5px 8px -6px rgba(0,0,0,.2);
}
.notice_sm {
    padding: 10px;
    font-size: 80%;
}
.notice_lg {
    padding: 35px;
    font-size: large;
}
.notice_success {
    border-color: #80D651;
}
.notice_success>strong {
    color: #80D651;
}
.notice_info {
    border-color: #45ABCD;
}
.notice_info>strong {
    color: #45ABCD;
}
.notice_warning {
    border-color: #FEAF20;
}
.notice_warning>strong {
    color: #FEAF20;
}
.notice_danger {
    border-color: #d73814;
}
.notice_danger>strong {
    color: #d73814;
}

.cardseatinfo {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width:300px;
    min-height:400px;
    background:#fff;
    box-shadow:0 20px 50px rgba(0,0,0,.1);
    border-radius:10px;
    transition:0.5s;
}
.cardseatinfo:hover {
    box-shadow:0 30px 70px rgba(0,0,0,.2);
}
.cardseatinfo .box {
    position:absolute;
    top:50%;
    left:0;
    transform:translateY(-50%);
    text-align:center;
    padding:20px;
    box-sizing:border-box;
    width:100%;
}
.cardseatinfo .box .img {
    width:120px;
    height:120px;
    margin:0 auto;
    border-radius:50%;
    overflow:hidden;
}
.cardseatinfo .box .img img {
    width:100%;
    height:100%;
}
.cardseatinfo .box h2 {
    font-size:20px;
    color:#262626;
    margin:20px auto;
}
.cardseatinfo .box h2 span {
    font-size:14px;
    background:#e91e63;
    color:#fff;
    display:inline-block;
    padding:4px 10px;
    border-radius:15px;
}
.cardseatinfo .box p {
    color:#262626;
}
.cardseatinfo .box span {
    display:inline-flex;
}
.cardseatinfo .box ul {
    margin:0;
    padding:0;
}
.cardseatinfo .box ul li {
    list-style:none;
    float:left;
}
.cardseatinfo .box ul li a {
    display:block;
    color:#aaa;
    margin:0 10px;
    font-size:20px;
    transition:0.5s;
    text-align:center;
}
.cardseatinfo .box ul li:hover a {
    color:#e91e63;
    transform:rotateY(360deg);
}
</style>
