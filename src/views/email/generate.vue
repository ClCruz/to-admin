<template>
  <div>
    <b-container>
      <b-row class="mb-3 w-70">
        <b-col>
          <b-input-group size="sm">
            <b-input-group-prepend class="mr-2">
              Faça uma busca:
            </b-input-group-prepend>
            <b-form-input id="name" type="text" name="name" placeholder="Digite os termos de busca" v-model="input">
            </b-form-input>
            <b-button type="button" variant="outline-success" class="ml-2" size="sm" @click="save"> Realizar busca
            </b-button>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-input-group size="sm">
            <b-input-group-prepend class="mr-2">
              Digite um título para o e-mail:
            </b-input-group-prepend>
            <b-form-input id="Title" type="text" name="title" placeholder="Digite um título para o conteúdo" v-model="customTitle">
            </b-form-input>
          </b-input-group>
          <b-input-group size="sm" class="mt-2">
            <b-input-group-prepend class="mr-2">
              Digite um sub titulo para o e-mail:
            </b-input-group-prepend>
            <b-form-input id="Title" type="text" name="title" placeholder="Digite um sub título para o conteúdo"  v-model="customSubtitle">
            </b-form-input>
          </b-input-group>
          <b-input-group size="sm" class="mt-2">
            <b-input-group-prepend class="mr-2">
              Logo customizado:
            </b-input-group-prepend>
            <b-form-input id="Title" type="text" name="title" placeholder="Coloque um link"  v-model="customLogo">
            </b-form-input>
          </b-input-group>
          <b-input-group size="sm" class="mt-2">
            <b-input-group-prepend class="mr-2">
              Máximo de itens:
            </b-input-group-prepend>
            <b-form-input id="Title" type="text" name="title" placeholder="Máximo de itens"  v-model="numberOfItens">
            </b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="pt-5">
          <div class="align-center mx-0 m-0" v-html="emailBody">
          </div>
        </b-col>
        <b-col>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button v-if="emailBody !== ''" type="button" variant="outline-success" class="mt-5" size="sm" @click="copy"> Copiar email para o clipboard</b-button>
          <b-form-input v-if="emailBody !== ''" placeholder="Digite um sub título para o conteúdo"  v-model="emailBody"  value="Código HTML" id="myInput">></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import Vue from "vue";
  import VueHead from 'vue-head';
  import VueMask from 'v-mask';
  import Moment from 'moment';
  import HotelDatePicker from 'vue-hotel-datepicker';
  import VueClipboard from 'vue-clipboard2';
  import Vuelidate from 'vuelidate';
  import VueFriendlyIframe from 'vue-friendly-iframe';
  
  import {
    extendMoment
  } from 'moment-range';
  import config from "@/config";
  import {
    func
  } from "@/functions";
  import {
    partnerService
  } from '../../components/common/services/partner';
  
  import {
    required
  } from 'vuelidate/lib/validators';
  import {
    eventService
  } from "@/components/common/services/event";
  
  const moment = extendMoment(Moment);
  Vue.use(VueClipboard);
  Vue.use(VueHead);
  Vue.use(VueMask);
  Vue.use(Vuelidate);
  
  export default {
    mixins: [func],
    props: ['id'],
    name: 'email-generate',
    components: {
      VueFriendlyIframe
    },
    head: {
      title: function () {
        return {
          inner: `TicketOffice | Admin`,
          separator: " | ",
          complement: `Criar template email - ${this.typeOf}`,
        }
      },
    },
    created() {
      Vue.nextTick().then(response => {
        
      });
    },
    computed: {
  
    },
    methods: {
      generateBodyEmail() {
  this.emailBody =  `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html style="width:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
   <head> 
    <meta charset="UTF-8"> 
    <meta content="width=device-width, initial-scale=1" name="viewport"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta content="telephone=no" name="format-detection"> 
    <title>New email</title> 
    <!--[if (mso 16)]>    <style type="text/css">    a {text-decoration: none;}    </style>    <![endif]--> 
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
    <!--[if !mso]><!-- --> 
    <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"> 
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet"> 
    <!--<![endif]--> 
    <style type="text/css">
  @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:32px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:32px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:16px!important; display:inline-block!important; border-width:15px 30px 15px 30px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
  #outlook a {
  	padding:0;
  }
  .ExternalClass {
  	width:100%;
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
  	line-height:100%;
  }
  .es-button {
  	mso-style-priority:100!important;
  	text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
  	color:inherit!important;
  	text-decoration:none!important;
  	font-size:inherit!important;
  	font-family:inherit!important;
  	font-weight:inherit!important;
  	line-height:inherit!important;
  }
  .es-desk-hidden {
  	display:none;
  	float:left;
  	overflow:hidden;
  	width:0;
  	max-height:0;
  	line-height:0;
  	mso-hide:all;
  }
  </style> 
   </head> 
   <body style="width:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> 
    <div class="es-wrapper-color" style="background-color:#EEEEEE;"> 
     <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"><v:fill type="tile" color="#eeeeee"></v:fill></v:background><![endif]--> 
     <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
       <tr style="border-collapse:collapse;"> 
        <td valign="top" style="padding:0;Margin:0;"> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
           </tr> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             
                 <!--[if mso]></td><td width="20"></td><td width="278" valign="top"><![endif]--> 
                
                 <!--[if mso]></td></tr></table><![endif]--> </td> 
               </tr> 
             </table> </td> 
           </tr> 
         </table> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
           </tr> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1A1B1B;" width="600" cellspacing="0" cellpadding="0" bgcolor="#1a1b1b" align="center"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="padding:0;Margin:0;padding-top:35px;padding-left:35px;padding-right:35px;"> 
                 <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td class="es-m-p0r" width="530" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"> <a target="_blank" href="https://tixs.me" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:none;color:#FFFFFF;"> <img class="adapt-img" src="` + this.customLogo + `" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="103"> </a> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;"> <h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:36px;font-style:normal;font-weight:bold;color:#FFFFFF;"><br></h1> </td> 
                       </tr> 
                     </table> </td> 
                   </tr> 
                 </table> </td> 
               </tr> 
             </table> </td> 
           </tr> 
         </table> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#F7F7F7;border-top:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;" width="600" cellspacing="0" cellpadding="0" bgcolor="#f3f3f3" align="center"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="padding:0;Margin:0;padding-top:35px;padding-left:35px;padding-right:35px;"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td width="530" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-left:10px;"> <h3 style="Margin:0;line-height:1.3em;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:600;color:#484848;-webkit-font-smoothing:antialiased;margin-bottom:-10px;text-align:left;">` + this.customTitle + `</h3> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:10px;padding-left:10px;"> <h3 style="Margin:0;line-height:1.3em;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;font-style:normal;font-weight:400;color:#484848;-webkit-font-smoothing:antialiased;margin-bottom:-10px;text-align:left;">` + this.customSubtitle + `</h3> </td> 
                       </tr> 
                     </table> </td> 
                   </tr> 
                 </table> </td> 
               </tr> 
                 ` + this.generateItems() + `
             </table> </td> 
           </tr> 
         </table> 
         <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
           <tr style="border-collapse:collapse;"> 
            <td align="center" style="padding:0;Margin:0;"> 
             <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center" bgcolor="#f3f3f3"> 
               <tr style="border-collapse:collapse;"> 
                <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;"> 
                 <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td class="es-infoblock" align="center" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC;"> <a target="_blank" href="https://www.tixs.me/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:12px;text-decoration:none;color:#CCCCCC;"> <img src="` + this.customLogo + `" alt width="125" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"> </a> </td> 
                       </tr> 
                     </table> </td> 
                   </tr> 
                 </table> </td> 
               </tr> 
             </table> </td> 
           </tr> 
         </table> </td> 
       </tr> 
     </table> 
    </div>  
   </body>
  </html>
        `
      },
      generateItemLeft(item) {
        let temp = `
            <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;margin-top:10px;float:left;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td class="es-m-p20b" width="250" align="left" style="padding:0;Margin:0;background-size:initial;background-attachment:initial;background-origin:initial;background-clip:initial;background-color:#FFFFFF;overflow:hidden;color:#444444;border-radius:0.25rem;box-shadow:rgba(0, 0, 0, 0.3) 0px 0px 3px 0px;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"> <a target="_blank" href="`+ this.uriSite + item.uri  +`" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:15px;text-decoration:none;color:#ED8E20;"> <img class="adapt-img" src="` + item.img  + `" alt="Item #1" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" title="Item #1" width="246"> </a> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-left:10px;padding-top:15px;"> <h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;text-align:left;">` + item.ds_evento + `</h4> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-left:10px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:18px;color:#777777;text-align:left;"><span class="product-description">` + item.datas + `</span></p> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-left:10px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:18px;color:#777777;text-align:left;"><span class="product-description">` + item.ds_nome_teatro + ' - ' + item.ds_municipio + ' - ' + item.sg_estado + '' + `</span></p> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                          <td align="center" bgcolor="transparent" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:25px;"> <span class="es-button-border" style="border-style:solid;border-color:#333333;background:#2F2F2F;border-width:0px;display:inline-block;border-radius:5px;width:auto;box-shadow:rgba(0, 0, 0, 0.6) 0px 0px 3px 0px;"> <a href="`+ this.uriSite + item.uri  +`" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:12px;color:#FFFFFF;border-style:solid;border-color:#2F2F2F;border-width:10px 30px;display:inline-block;background:#2F2F2F;border-radius:5px;font-weight:bold;font-style:normal;line-height:14px;width:auto;text-align:center;">COMPRAR INGRESSOS</a> </span> </td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table> 
        `;
  
        return temp;
      },
      generateItemRight(item) {
        let temp = `
                <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;margin-top:10px;"> 
                   <tr style="border-collapse:collapse;"> 
                    <td class="es-m-p20b" width="250" align="left" style="padding:0;Margin:0;background-size:initial;background-attachment:initial;background-origin:initial;background-clip:initial;background-color:#FFFFFF;overflow:hidden;color:#444444;border-radius:0.25rem;box-shadow:rgba(0, 0, 0, 0.3) 0px 0px 3px 0px;"> 
                     <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;"> <a target="_blank" href="`+ item.uri  +`" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:15px;text-decoration:none;color:#ED8E20;"> <img class="adapt-img" src="` + item.img  + `" alt="Item #1" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" title="Item #1" width="246"> </a> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-left:10px;padding-top:15px;"> <h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;text-align:left;">` + item.ds_evento + `</h4> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-left:10px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:18px;color:#777777;text-align:left;"><span class="product-description">` + item.datas + `</span></p> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                        <td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-left:10px;"> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:18px;color:#777777;text-align:left;"><span class="product-description">` + item.ds_nome_teatro + ' - ' + item.ds_municipio + ' - ' + item.sg_estado + '' + `</span></p> </td> 
                       </tr> 
                       <tr style="border-collapse:collapse;"> 
                         <td align="center" bgcolor="transparent" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:25px;"> <span class="es-button-border" style="border-style:solid;border-color:#333333;background:#2F2F2F;border-width:0px;display:inline-block;border-radius:5px;width:auto;box-shadow:rgba(0, 0, 0, 0.6) 0px 0px 3px 0px;"> <a href="`+ item.uri  +`" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:12px;color:#FFFFFF;border-style:solid;border-color:#2F2F2F;border-width:10px 30px;display:inline-block;background:#2F2F2F;border-radius:5px;font-weight:bold;font-style:normal;line-height:14px;width:auto;text-align:center;">COMPRAR INGRESSOS</a> </span> </td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table> 
        `;
  
        return temp;
      },
      generateItems() {
        let items = '';
        let header =  ` 
          <tr style="border-collapse:collapse;"> 
                <td align="left" style="Margin:0;padding-top:20px;padding-bottom:40px;padding-left:40px;padding-right:40px;"> 
                 <!--[if mso]><table width="520" cellpadding="0" cellspacing="0"><tr><td width="250" valign="top"><![endif]--> `;
        let bottom = ` 
                 </td>
                  <!--[if mso]></td></tr></table><![endif]--> </td> 
               </tr> `
        let count = 0;
  
        if (this.text.length < this.numberOfItens) {
          count = this.text.length;
        } else {
          count = this.numberOfItens;
        }
               
               
        for (var i = 0; i < count; i++) {
          if (i % 2 == 0) {
            items += this.generateItemLeft(this.text[i])
                
                      
          } else {
            items +=  this.generateItemRight(this.text[i])
          }
        }
          return header + items + bottom;
      },
      removeDuplicatesBy(keyFn, array) {
        var mySet = new Set();
        return array.filter(function (x) {
          var key = keyFn(x).toUpperCase(),
            isNew = !mySet.has(key);
          if (isNew) mySet.add(key);
          return isNew;
        });
      },
      getListResults() {
        eventService.getEvents().then(
          response => {
            this.slideData = response.filter(x => x.id_genre !== undefined && x.id_genre !== null);
  
            this.cityList = this.removeDuplicatesBy(x => x.ds_municipio, this.slideData);
  
          },
          error => {
            this.hideWaitAboveAll();
            this.toastError("Falha na execução.");
          }
        );
      },
      getSearchResults(type, input) {
        if (input == '') return;
        eventService.searchPage(type, input).then(
          response => {
            this.searchResults = response;
            this.searchResults.map(x => x.img = x.cardimage);
            this.isLoaded = true;
            this.text = response;
  
  
            this.generateBodyEmail();
          },
          error => {
            this.toastError("Falha na execução.");
          }
        );
      },
      save() {
        this.getSearchResults('search', this.input);
        // console.log(this.slideData);
      },
      copy() {
         /* Get the text field */
  var copyText = document.getElementById("myInput");
  
  /* Select the text field */
  copyText.select();
  
  /* Copy the text inside the text field */
  document.execCommand("copy");
  
  /* Alert the copied text */
  this.toastSuccess("Texto copiado");
      }
    },
    data() {
      return {
        uriSite: config.uri,
        cityList: [],
        slideData: [],
        text: '',
        customTitle: 'Explore eventos recomendados para você',
        customSubtitle: 'Descubra eventos através das categorias mais procuradas',
        customLogo: 'https://www.tixs.me/assets/texture/logo-vertical.png',
        numberOfItens: '10',
        input: '',
        emailBody: ''
      }
    }
  }
</script>
<style scoped>
  .errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
  }
  @media only screen and (max-width:600px) {
  p,
  ul li,
  ol li,
  a {
  font-size: 16px !important;
  line-height: 150% !important
  }
  h1 {
  font-size: 32px !important;
  text-align: center;
  line-height: 120% !important
  }
  h2 {
  font-size: 26px !important;
  text-align: center;
  line-height: 120% !important
  }
  h3 {
  font-size: 20px !important;
  text-align: center;
  line-height: 120% !important
  }
  h1 a {
  font-size: 32px !important
  }
  h2 a {
  font-size: 26px !important
  }
  h3 a {
  font-size: 20px !important
  }
  .es-menu td a {
  font-size: 16px !important
  }
  .es-header-body p,
  .es-header-body ul li,
  .es-header-body ol li,
  .es-header-body a {
  font-size: 16px !important
  }
  .es-footer-body p,
  .es-footer-body ul li,
  .es-footer-body ol li,
  .es-footer-body a {
  font-size: 16px !important
  }
  .es-infoblock p,
  .es-infoblock ul li,
  .es-infoblock ol li,
  .es-infoblock a {
  font-size: 12px !important
  }
  *[class="gmail-fix"] {
  display: none !important
  }
  .es-m-txt-c,
  .es-m-txt-c h1,
  .es-m-txt-c h2,
  .es-m-txt-c h3 {
  text-align: center !important
  }
  .es-m-txt-r,
  .es-m-txt-r h1,
  .es-m-txt-r h2,
  .es-m-txt-r h3 {
  text-align: right !important
  }
  .es-m-txt-l,
  .es-m-txt-l h1,
  .es-m-txt-l h2,
  .es-m-txt-l h3 {
  text-align: left !important
  }
  .es-m-txt-r img,
  .es-m-txt-c img,
  .es-m-txt-l img {
  display: inline !important
  }
  .es-button-border {
  display: inline-block !important
  }
  a.es-button {
  font-size: 16px !important;
  display: inline-block !important;
  border-width: 15px 30px 15px 30px !important
  }
  .es-btn-fw {
  border-width: 10px 0px !important;
  text-align: center !important
  }
  .es-adaptive table,
  .es-btn-fw,
  .es-btn-fw-brdr,
  .es-left,
  .es-right {
  width: 100% !important
  }
  .es-content table,
  .es-header table,
  .es-footer table,
  .es-content,
  .es-footer,
  .es-header {
  width: 100% !important;
  max-width: 600px !important
  }
  .es-adapt-td {
  display: block !important;
  width: 100% !important
  }
  .adapt-img {
  width: 100% !important;
  height: auto !important
  }
  .es-m-p0 {
  padding: 0px !important
  }
  .es-m-p0r {
  padding-right: 0px !important
  }
  .es-m-p0l {
  padding-left: 0px !important
  }
  .es-m-p0t {
  padding-top: 0px !important
  }
  .es-m-p0b {
  padding-bottom: 0 !important
  }
  .es-m-p20b {
  padding-bottom: 20px !important
  }
  .es-mobile-hidden,
  .es-hidden {
  display: none !important
  }
  .es-desk-hidden {
  display: table-row !important;
  width: auto !important;
  overflow: visible !important;
  float: none !important;
  max-height: inherit !important;
  line-height: inherit !important
  }
  .es-desk-menu-hidden {
  display: table-cell !important
  }
  table.es-table-not-adapt,
  .esd-block-html table {
  width: auto !important
  }
  table.es-social {
  display: inline-block !important
  }
  table.es-social td {
  display: inline-block !important
  }
  }
  #outlook a {
  padding: 0;
  }
  .ExternalClass {
  width: 100%;
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
  line-height: 100%;
  }
  .es-button {
  mso-style-priority: 100 !important;
  text-decoration: none !important;
  }
  a[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
  font-size: inherit !important;
  font-family: inherit !important;
  font-weight: inherit !important;
  line-height: inherit !important;
  }
  .es-desk-hidden {
  display: none;
  float: left;
  overflow: hidden;
  width: 0;
  max-height: 0;
  line-height: 0;
  mso-hide: all;
  }
</style>