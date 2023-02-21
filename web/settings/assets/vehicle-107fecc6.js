import{_ as f,a3 as g,a4 as h,a5 as b,q as l,l as k,m as w,A as a,K as i,v as s,u as m,x as v}from"./vendor-29588c66.js";import{a as y}from"./vendor-axios-75370482.js";import{C}from"./index-5ccb55f1.js";import"./vendor-sortablejs-66a8dc70.js";import"./vendor-fortawesome-2889b4a5.js";import"./vendor-bootstrap-4e27eaa6.js";import"./vendor-jquery-ba0ce817.js";const T={name:"VehicleSocTesla",emits:["update:configuration"],props:{configuration:{type:Object,required:!0},vehicleId:{required:!0}},data(){return{tesla_api_oauth2:"https://auth.tesla.com/oauth2/v3",tesla_api_redirect:"https://auth.tesla.com/void/callback",tesla_api_owners:"https://owner-api.teslamotors.com/oauth/token",user_agent:"Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",code_challenge:null,code_verifier:null,page_not_found_url:""}},mixins:[C],methods:{updateConfiguration(e,n=void 0){this.$emit("update:configuration",{value:e,object:n})},tesla_login_window(){this.tesla_gen_challenge();var e=window.open(this.tesla_gen_url(),"TeslaLogin","width=800,height=600,status=yes,scrollbars=yes,resizable=yes");e.focus()},tesla_gen_challenge(){this.code_verifier=g.encode(h.randomBytes(86)).replace(/[^a-zA-Z0-9]/gi,"").substring(0,86);const e=h.createHash("sha256").update(this.code_verifier).digest();this.code_challenge=g.encode(e),console.log(this.code_verifier,this.code_verifier.length,this.code_challenge,this.code_challenge.length)},tesla_gen_url(){const e=new URL(this.tesla_api_oauth2+"/authorize/");return e.searchParams.append("client_id","ownerapi"),e.searchParams.append("code_challenge",this.code_challenge),e.searchParams.append("code_challenge_method","S256"),e.searchParams.append("redirect_uri",this.tesla_api_redirect),e.searchParams.append("response_type","code"),e.searchParams.append("scope","openid email offline_access"),e.searchParams.append("state","myteslaapp"),e},async tesla_login(){const e=b.parse(this.page_not_found_url,!0).query;if(console.debug("queryObject",e),!e.code){console.error("Something is wrong... Code does not exist in URL"),this.$root.postClientMessage("Die eingegebene URL ist ungültig.","danger");return}const n={url:this.tesla_api_owners,user_agent:this.user_agent,data:{grant_type:"authorization_code",client_id:"ownerapi",code:e.code,code_verifier:this.code_verifier,redirect_uri:this.tesla_api_redirect}};try{const t=await y.post(location.protocol+"//"+location.host+"/openWB/web/settings/modules/vehicles/tesla/tesla.php",JSON.parse(JSON.stringify(n)),{headers:{"Content-Type":"application/json",Accept:"application/json"}});console.debug("response",t),this.updateConfiguration({access_token:t.data.access_token,refresh_token:t.data.refresh_token,created_at:t.data.created_at,expires_in:t.data.expires_in},"configuration.token"),this.$root.postClientMessage("Token erfolgreich abgerufen.","success")}catch(t){console.error(t),this.$root.postClientMessage("Beim Abruf der Token ist ein Fehler aufgetreten!<pre>"+t+"</pre>","danger")}}}},x={class:"vehicle-soc-tesla"},U={class:"small"},B=m("hr",null,null,-1);function z(e,n,t,V,u,r){const _=l("openwb-base-heading"),d=l("openwb-base-number-input"),p=l("openwb-base-button-input"),c=l("openwb-base-text-input");return k(),w("div",x,[a(_,null,{default:i(()=>[s(" Einstellungen für Tesla SoC "),m("span",U,"(Modul: "+v(e.$options.name)+")",1)]),_:1}),a(d,{title:"Fahrzeug-ID",required:"",min:0,"model-value":t.configuration.tesla_ev_num,"onUpdate:modelValue":n[0]||(n[0]=o=>r.updateConfiguration(o,"configuration.tesla_ev_num"))},{help:i(()=>[s(' Die ID des Fahrzeugs bei Tesla. Normalerweise "0" bei nur einem Fahrzeug im Konto. ')]),_:1},8,["model-value"]),a(_,null,{default:i(()=>[s("Token abrufen oder eingeben")]),_:1}),a(p,{title:"1. Anmelden",buttonText:"Bei Tesla Anmelden",subtype:"success",onButtonClicked:r.tesla_login_window},{help:i(()=>[s(" Es wird ein neues Browserfenster geöffnet, in dem Sie sich bei Tesla mit Ihren Zugangsdaten anmelden können. ")]),_:1},8,["onButtonClicked"]),a(c,{title:"2. URL kopieren",subtype:"url",emptyValue:"",modelValue:u.page_not_found_url,"onUpdate:modelValue":n[1]||(n[1]=o=>u.page_not_found_url=o)},{help:i(()=>[s(' Hier die komplette URL (Text in der Adresszeile) aus dem geöffneten Browserfenster einfügen, wenn dort "Page Not Found" angezeigt wird. ')]),_:1},8,["modelValue"]),a(p,{title:"3. Token abrufen",buttonText:"Jetzt abrufen",subtype:"success",disabled:u.page_not_found_url.length==0,onButtonClicked:r.tesla_login},{help:i(()=>[s(" Der in der eingegebenen URL enthaltene Code wird genutzt, um ein Anmeldetoken bei Tesla abzurufen. Ist dies erfolgreich, so werden die Daten des Token in den weiteren Feldern automatisch eingegeben. ")]),_:1},8,["disabled","onButtonClicked"]),B,a(c,{title:"Access Token",pattern:"^(ey).*",required:"","model-value":t.configuration.token?t.configuration.token.access_token:"","onUpdate:modelValue":n[2]||(n[2]=o=>r.updateConfiguration(o,"configuration.token.access_token"))},null,8,["model-value"]),a(c,{title:"Refresh Token",pattern:"^(ey).*",required:"","model-value":t.configuration.token?t.configuration.token.refresh_token:"","onUpdate:modelValue":n[3]||(n[3]=o=>r.updateConfiguration(o,"configuration.token.refresh_token"))},null,8,["model-value"]),a(d,{title:"Erstellt um",required:"","model-value":t.configuration.token?t.configuration.token.created_at:0,"onUpdate:modelValue":n[4]||(n[4]=o=>r.updateConfiguration(o,"configuration.token.created_at"))},{help:i(()=>[s(" Unix Timestamp des Zeitpunktes, an dem das Token erzeugt wurde. ")]),_:1},8,["model-value"]),a(d,{title:"Ungültig in",unit:"s",required:"","model-value":t.configuration.token?t.configuration.token.expires_in:0,"onUpdate:modelValue":n[5]||(n[5]=o=>r.updateConfiguration(o,"configuration.token.expires_in"))},{help:i(()=>[s(" Zeitspanne in Sekunden, nach der das Token ungültig wird. ")]),_:1},8,["model-value"])])}const N=f(T,[["render",z],["__file","/opt/openWB-dev/openwb-ui-settings/src/components/vehicles/tesla/vehicle.vue"]]);export{N as default};
