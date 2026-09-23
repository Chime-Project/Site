(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3059,5816],{8471:(e,r,t)=>{"use strict";t.r(r),t.d(r,{__N_SSP:()=>d,default:()=>u});var n=t(37876),i=t(89099);t(14232);var a=t(73708),s=t(51194),o=t(92857),l=t(89369);let c=a.C.homepage;var d=!0;let u=function(){let{push:e}=(0,i.useRouter)(),{membership:r}=(0,o.Jd)();return(0,l.gz)(r)&&e("/join/faqs-sc1"),(0,n.jsx)(s.n,{slug:"faq",type:c})}},11891:(e,r,t)=>{var n=t(3979);e.exports=function(e,r,t,i){return n(e,function(e,n,a){r(i,e,t(e),a)}),i}},17167:(e,r,t)=>{"use strict";t.d(r,{x:()=>a});var n=t(4142),i=t(14232);let a=(e=null)=>{(0,i.useEffect)(()=>{e&&(0,n.O)(e)},[e])}},22171:(e,r,t)=>{"use strict";t.d(r,{h:()=>n});class n extends Error{constructor(e=""){super(e),this.message=`MissingDataError: ${e}`}}},31862:(e,r,t)=>{"use strict";t.d(r,{H:()=>w});var n=t(86355),i=t(3219);let a=(0,i.Ay)`
    fragment CMSLandingPage on LandingPage {
  name
  slug
  pageTitle
  metaDescription
  robots
  socialImage {
    url
    description
  }
  landingPageTypeSlug
}
    `;var s=t(1645),o=t(86512),l=t(19544),c=t(89673),d=t(70280),u=t(88976),p=t(59490),g=t(3012),m=t(89049),h=t(30427),y=t(66440),f=t(60374);let x=[s.n,l.z,c.t,d.i,u.r,p.D,g.i,m.M,h.P,f.L,y.q],v=(0,o.E)(x,"LandingPageEntryFragment"),w=(0,n.J1)`
  query landingPageCollection(
    $slug: String!
    $landingPageType: String!
    $locale: String!
    $preview: Boolean
  ) {
    landingPageCollection(
      limit: 1
      preview: $preview
      where: { AND: [{ landingPageTypeSlug: $landingPageType }, { slug: $slug }] }
      locale: $locale
    ) {
      items {
        ...CMSLandingPage
        modulesCollection(limit: 50) {
          items {
            __typename
            ... on Entry {
              sys {
                id
              }
            }
            ...LandingPageEntryFragment
          }
        }
      }
    }
  }

  ${a}
  ${v}
`},39037:(e,r,t)=>{"use strict";t.d(r,{A:()=>m});var n=t(99321),i=t(17167),a=t(75515),s=t(88748),o=t(99223),l=t(3219),c=t(6416);let d=(0,l.Ay)`
    query consumer_inventoryMetadata($filters: Consumer_InventoryMetadataFilters!) {
  consumer_inventoryMetadata(filters: $filters) {
    lowestPrice {
      priceInCents
      displayPrice
      discountInCents
      originalPriceInCents
      isCurrentlyDiscounted
    }
  }
}
    `,u={priceInCents:3e3,displayPrice:"$30",discountInCents:0,originalPriceInCents:3e3,isCurrentlyDiscounted:!1};var p=t(31862),g=t(69945);let m=function({slug:e,type:r}){let t=!e,{inventoryMetadata:l}=(e=>{var r;let{selectedMarket:t}=(0,o.At)(),n=t?.area.origin,[{data:l,error:p,fetching:g}]=(r={variables:{filters:{query:e,availability:{startDate:(0,a.formatDate)(new Date,s.um)??""},provider:{practiceStates:[`US-${t?.area?.stateIsoCode}`]},location:{origin:{lat:n?.lat??0,lon:n?.lon??0},radius:50}}},pause:!t},c.IT({query:d,...r}));return(0,i.x)(p),{inventoryMetadata:{lowestPrice:l?.consumer_inventoryMetadata?.lowestPrice??u},error:p,loading:g}})("telehealth-visit"),{data:m,error:h,loading:y}=(0,n.A)(p.H,{skip:t,variables:{landingPageType:r,slug:e}},{lowestPrice:l?.lowestPrice?.displayPrice??""});return(0,i.x)(h),{data:(e=>{if(!e)return null;let[r,...t]=e.landingPageCollection?.items??[],n=r?.modulesCollection?.items??[];return 0===n.length?e:{...e,landingPageCollection:{...e.landingPageCollection,items:[{...r,modulesCollection:{...r?.modulesCollection,items:n.filter(g.$)}},...t]}}})(m),loading:t||y,error:h}}},39570:(e,r,t)=>{"use strict";t.d(r,{E:()=>m});var n=t(37876),i=t(96206),a=t(44160),s=t(80216),o=t(2185),l=t(20916),c=t(54587),d=t.n(c),u=t(93221),p=t(80662),g=t.n(p);let m=({statusCode:e=404})=>{let{button:r,heading:t,image:c,subHeading:p}=h[e]||h[404];return(0,n.jsxs)(i.P,{className:g().wrapper,composition:"two-up",children:[(0,n.jsxs)(a.s,{align:"start",className:g().content,direction:"column",gap:"4",children:[t&&(0,n.jsx)(s.p,{variant:"rich",children:t}),p&&(0,n.jsx)(o.Q,{children:p}),r&&(0,n.jsx)(l.$,{href:r.url,renderer:u.N,size:"lg",type:"link",children:r.text})]}),(0,n.jsx)(a.s,{align:"center",justify:"end",children:(0,n.jsx)(d(),{alt:"","aria-hidden":"true",className:g().image,height:450,src:c.url,width:450})})]})},h={404:{heading:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.B,{color:"brand",font:"inherit",children:"Uh oh,"}),(0,n.jsx)("br",{})," page not found"]}),subHeading:"Visit our home page and read more about Sesame’s work making quality care accessible to everyone.",image:{url:"https://sesamecare.imgix.net/misc/medical_chart.jpg?h=720"},button:{url:"/",text:"Explore Sesame"}},500:{heading:(0,n.jsxs)(n.Fragment,{children:["Oops. ",(0,n.jsx)("br",{}),(0,n.jsx)(s.B,{color:"brand",font:"inherit",children:"Try that again."})]}),subHeading:"Please refresh your browser window or try again later when we’re all better.",image:{url:"https://sesamecare.imgix.net/misc/patches.jpg?h=720"},button:{url:"/",text:"Explore Sesame"}}}},51194:(e,r,t)=>{"use strict";t.d(r,{n:()=>l});var n=t(37876);t(14232);var i=t(84117),a=t(39037),s=t(94234),o=t(22171);let l=({slug:e,type:r})=>{let{data:t,error:l,loading:c}=(0,a.A)({slug:e,type:r});if(c)return null;let[d]=t?.landingPageCollection?.items??[];if(l&&l?.graphQLErrors[0]?.extensions?.contentful?.details?.field!=="modules")return(0,n.jsx)(i.A,{error:l,statusCode:500});if(!d){let t=new o.h(`could not find any data for landing page ${r}/${e}`);return(0,n.jsx)(i.A,{error:t,statusCode:404})}return(0,n.jsx)(s.A,{content:d})}},57069:(e,r,t)=>{"use strict";t.d(r,{M:()=>function e(r,t=0,a=[]){return n.Children.toArray(r).reduce((r,s,o)=>((0,i.isFragment)(s)?r.push(...e(s.props.children,t+1,a.concat(s.key||o))):(0,n.isValidElement)(s)?r.push((0,n.cloneElement)(s,{key:a.concat(String(s.key)).join(".")})):("string"==typeof s||"number"==typeof s)&&r.push(s),r),[])}});var n=t(14232),i=t(37639)},70704:(e,r,t)=>{e.exports=t(87230)(function(e,r,t){e[+!t].push(r)},function(){return[[],[]]})},80216:(e,r,t)=>{"use strict";t.d(r,{p:()=>d,B:()=>u});var n=t(37876),i=t(14232),a=t(43871);let s=(0,a.Fj)({variants:{variant:{primary:{textStyle:"headerPrimary"},secondary:{textStyle:"headerSecondary"},rich:{textStyle:"headerRich"}}},defaultVariants:{variant:"rich"}}),o=(0,a.Fj)({variants:{variant:{primary:{},secondary:{},rich:{}},color:{brand:{color:"var(--color-content-main-default)"},inherit:{}},font:{serif:{},inherit:{}}},compoundVariants:[{variant:"primary",font:"serif",css:{textStyle:"headerPrimarySerif"}},{variant:"secondary",font:"serif",css:{textStyle:"headerSecondarySerif"}},{variant:"rich",font:"serif",css:{textStyle:"headerRichSerif"}}]});var l=t(10294),c=t(57069);function d({children:e,className:r,elementType:t="h1",variant:a="primary",highlightChildType:o=u,...p}){let g=s({variant:a}),m=(0,c.M)(e).map(e=>o&&e.type===o?(0,i.cloneElement)(e,{variant:a}):e),h={className:(0,l.cx)(g,r),children:m,...p};return(0,n.jsx)(t,{...h})}function u({children:e,variant:r,font:t="serif",color:i="inherit"}){let a=o({variant:r,color:i,font:t});return(0,n.jsx)("span",{className:a,children:e})}},80662:e=>{e.exports={wrapper:"ErrorView_wrapper__MC42v",content:"ErrorView_content__xLo2V",image:"ErrorView_image__3L7de"}},82924:(e,r,t)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/faq",function(){return t(8471)}])},83271:(e,r,t)=>{"use strict";t.d(r,{d:()=>a});var n=t(37876),i=t(78787);let a=({children:e,narrow:r,spacing:t,tight:a,touch:s,touchMobile:o,wide:l,width:c,...d})=>{let u={spacing:s?"touch":o?"touchMobile":a?"tight":t,width:l?"wide":r?"narrow":c,...d};return(0,n.jsx)(i.d8,{...u,children:e})}},84117:(e,r,t)=>{"use strict";t.d(r,{A:()=>u});var n=t(37876);t(13174),t(14232);var i=t(74720),a=t(39892),s=t(39570),o=t(33074),l=t(11137),c=t(83271),d=t(68817);function u({error:e,statusCode:r}){return(0,n.jsxs)(o.A,{footer:(0,n.jsx)(l.A,{showSeoFooter:!0}),children:[404===r&&(0,n.jsx)(d.A,{robots:"noindex",title:"404 Page"}),(0,n.jsx)(c.d,{spacing:"tight",width:"wide",children:(0,n.jsx)(s.E,{statusCode:r})}),e&&(0,n.jsx)(i.A,{error:e,failScope:a.A.Page,severity:404===r?"warning":"error"})]})}},86393:e=>{e.exports=function(e,r,t,n){for(var i=-1,a=null==e?0:e.length;++i<a;){var s=e[i];r(n,s,t(s),e)}return n}},87230:(e,r,t)=>{var n=t(86393),i=t(11891),a=t(47871),s=t(93007);e.exports=function(e,r){return function(t,o){var l=s(t)?n:i,c=r?r():{};return l(t,e,a(o,2),c)}}},94234:(e,r,t)=>{"use strict";t.d(r,{A:()=>h});var n=t(37876),i=t(4142),a=t(69945),s=t(66025),o=t(70704),l=t.n(o),c=t(3945),d=t(24342),u=t(68817),p=t(33074),g=t(11137),m=t(16261);let h=function({content:e}){if(!e)return null;let{landingPageTypeSlug:r,metaDescription:t,modulesCollection:o,pageTitle:h,robots:y,slug:f,socialImage:x}=e,v=(o?.items??[]).filter(a.$),[w,_]=l()(v,e=>e.__typename===s.yw.PROMO_BANNER_MODULE);return(0,n.jsx)(m.C,{cmsModules:_,children:(0,n.jsxs)(p.A,{"data-testid":`landing-page__${r}-${f}`,footer:(0,n.jsx)(g.A,{showSeoFooter:!0}),children:[(0,n.jsx)(u.A,{description:t??void 0,robots:y??void 0,socialImageAlt:x?.description??void 0,socialImageUrl:x?.url??void 0,title:h??void 0}),w&&(0,n.jsx)(d.A,{promoBanner:w[0],showSkeleton:!0}),_.map((e,r)=>e.sys?(0,n.jsx)(c.A,{allCmsModules:_,cmsModule:e,cmsModuleIndex:r},`${e.sys.id}`):((0,i.O)(Error(`Tried to render an unknown CMS module of type ${e.__typename}, this is most likely due to an outdated fragmentTypes.json`)),null))]})})}},96206:(e,r,t)=>{"use strict";t.d(r,{P:()=>g});var n=t(37876),i=t(10294),a=t(71050),s=t(7834);let o={composition:"two-up"},l=[],c=[["wrapper","layout__wrapper"]].map(([e,r])=>[e,(0,s.z)(r,o,(0,a.T_)(l,e))]),d=(0,a.ph)((e={})=>Object.fromEntries(c.map(([r,t])=>[r,t.recipeFn(e)]))),u=["composition","gap"],p=Object.assign(d,{__recipe__:!1,__name__:"layout",raw:e=>e,classNameMap:{},variantKeys:u,variantMap:{composition:["one-two-up","two-up","two-one-up","three-up","four-up"],gap:["0","1","2","3","4","5","6","7","8","9","10"]},splitVariantProps:e=>(0,a.rg)(e,u),getVariantProps:e=>({...o,...(0,a.oE)(e)})});function g({children:e,className:r,composition:t,elementType:a="div",gap:s,style:o,...l}){let c=p({gap:s,composition:t});return(0,n.jsx)(a,{className:(0,i.cx)(r,c.wrapper),style:o,...l,children:e})}}},e=>{e.O(0,[8787,5663,137,8485,1776,8774,2860,368,3751,8394,693,3945,2474,636,6593,8792],()=>e(e.s=82924)),_N_E=e.O()}]);
//# sourceMappingURL=faq-4d8c967a54a6f979.js.map