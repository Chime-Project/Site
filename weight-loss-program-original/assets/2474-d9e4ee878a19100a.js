"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2474],{1645:(e,t,n)=>{n.d(t,{n:()=>r});var i=n(86512),a=n(3219);let o=(0,a.Ay)`
    fragment ConnectedCategoryHero_CategoryHero on CategoryHero {
  heading
  description
  symptoms
  image {
    description
    url
  }
  imagePositionMobile
}
    `,r=(0,i.w)(o)},3012:(e,t,n)=>{n.d(t,{i:()=>o});var i=n(86512),a=n(64751);let o=(0,i.w)(a.A)},16261:(e,t,n)=>{n.d(t,{C:()=>m});var i=n(37876),a=n(69945),o=n(66025),r=n(80505),l=n.n(r),s=n(25383);let m=({children:e,cmsModules:t})=>{let n,r=(n=l()(t.filter(e=>e.__typename===o.yw.SECTION).map(e=>e?.modulesCollection?.items).filter(a.$)),[...t.filter(e=>e.__typename===o.yw.FAQ_MODULE),...n?.filter(e=>e.__typename===o.yw.FAQ_MODULE)?.filter(a.$)??[]]);return(0,i.jsxs)(i.Fragment,{children:[r?.length>0&&(0,i.jsx)(s.o,{faqs:l()(r?.map(e=>e?.faqsCollection?.items))?.filter(a.$)??[]}),e]})}},19544:(e,t,n)=>{n.d(t,{z:()=>o});var i=n(86512),a=n(31027);let o=(0,i.w)(a.RD)},21334:(e,t,n)=>{n.d(t,{WJ:()=>o,dY:()=>l});var i=n(3219),a=n(6416);let o=(0,i.Ay)`
    fragment StaticPlaceholderFragment on StaticPlaceholder {
  staticModuleKey
  parameters
}
    `,r=(0,i.Ay)`
    query staticPlaceholder($id: String!, $locale: String!, $preview: Boolean) {
  staticPlaceholder(id: $id, locale: $locale, preview: $preview) {
    ...StaticPlaceholderFragment
  }
}
    ${o}`;function l(e){return a.IT({query:r,...e})}},25383:(e,t,n)=>{n.d(t,{o:()=>l});var i=n(37876),a=n(40547),o=n(89099),r=n(98813);let l=({faqs:e})=>{let{asPath:t}=(0,o.useRouter)(),n=Object.assign({"@context":"https://schema.org","@type":"FAQPage",url:`${(0,a.A)("WHOAMI")}${t}`,mainEntity:e?.map(e=>({"@type":"Question",name:e.question,acceptedAnswer:{"@type":"Answer",text:e.answer}}))});return(0,i.jsx)(r.T,{schema:n})}},30427:(e,t,n)=>{n.d(t,{P:()=>l});var i=n(86512),a=n(3219);let o=(0,a.Ay)`
    fragment ServiceCarouselItem on ServiceCarousel {
  heading
  inclusionsExclusionsCollection(limit: 8) {
    items {
      label
      state
    }
  }
  name
  patientType
  providerSpecialties
  seeMoreLabel
  seeMoreLink
  serviceTemplatesV2Collection(limit: 20) {
    items {
      uuid
      name
    }
  }
  subHeading
}
    `,r=(0,a.Ay)`
    fragment ConnectedServiceSection_ServiceSection on ServiceSection {
  heading
  subHeading
  serviceCarouselsCollection(limit: 5) {
    items {
      ...ServiceCarouselItem
    }
  }
}
    ${o}`,l=(0,i.w)(r)},31027:(e,t,n)=>{n.d(t,{RD:()=>l,u6:()=>m});var i=n(3219),a=n(34807),o=n(6416);let r=(0,i.Ay)`
    fragment FAQItem_FAQModule on Faq {
  sys {
    id
  }
  question
  answer
}
    `,l=(0,i.Ay)`
    fragment FaqModuleFragment on FaqModule {
  heading
  subHeading
  sys {
    id
  }
  faqsCollection(limit: 100) {
    items {
      ...FAQItem_FAQModule
    }
  }
  button {
    ...CmsButton
  }
  buttonClickEventName
  medicallyReviewedBy
  medicallyReviewedByImage {
    url
  }
}
    ${r}
${a.E}`,s=(0,i.Ay)`
    query faqModule($id: String!, $locale: String!, $preview: Boolean) {
  faqModule(id: $id, locale: $locale, preview: $preview) {
    ...FaqModuleFragment
  }
}
    ${l}`;function m(e){return o.IT({query:s,...e})}},34807:(e,t,n)=>{n.d(t,{E:()=>a});var i=n(3219);let a=(0,i.Ay)`
    fragment CmsButton on Entry {
  ... on LinkButton {
    url
    type
    text
    rel
    __typename
  }
  ... on ScrollButton {
    selector
    type
    text
    __typename
  }
  ... on ActionButton {
    action
    type
    text
    membershipId
    passcode
    rxCategory
    __typename
  }
}
    `},36195:(e,t,n)=>{n.d(t,{NZ:()=>l,On:()=>o});var i=n(3219),a=n(6416);let o=(0,i.Ay)`
    fragment Markdown on MarkdownModule {
  heading
  text
  name
}
    `,r=(0,i.Ay)`
    query markdownModule($id: String!, $locale: String!, $preview: Boolean) {
  markdownModule(id: $id, locale: $locale, preview: $preview) {
    ...Markdown
  }
}
    ${o}`;function l(e){return a.IT({query:r,...e})}},37149:(e,t,n)=>{n.d(t,{_T:()=>r,k6:()=>s});var i=n(3219),a=n(6416);let o=(0,i.Ay)`
    fragment TestimonialItem on Testimonial {
  displayName
  quote
  location {
    location
  }
}
    `,r=(0,i.Ay)`
    fragment Testimonial on TestimonialSection {
  heading
  testimonialsCollection(limit: 3) {
    items {
      ...TestimonialItem
    }
  }
  themeKey
}
    ${o}`,l=(0,i.Ay)`
    query testimonialSection($locale: String!, $preview: Boolean, $id: String!) {
  testimonialSection(locale: $locale, preview: $preview, id: $id) {
    ...Testimonial
  }
}
    ${r}`;function s(e){return a.IT({query:l,...e})}},59490:(e,t,n)=>{n.d(t,{D:()=>r});var i=n(86512),a=n(3219);let o=(0,a.Ay)`
    fragment PartnerHero_PartnerHero on PartnerHero {
  heading
  subHeading
  image {
    description
    url
  }
  imageMobile {
    description
    url
  }
  partnerLogo {
    url
    width
    height
  }
  imagePosition
  imagePositionMobile
  ctaLink
  ctaText
  showProvidersCount
}
    `,r=(0,i.w)(o)},60374:(e,t,n)=>{n.d(t,{L:()=>o});var i=n(86512),a=n(37149);let o=(0,i.w)(a._T)},64751:(e,t,n)=>{n.d(t,{A:()=>a});var i=n(3219);let a=(0,i.Ay)`
    fragment PromoBanner_PromoBannerModule on PromoBannerModule {
  image {
    url
    width
    height
  }
  link
  label
  sticky
  text
  textColor
  backgroundColor
  name
  shouldPromoBannerPersist
  showPromoBannerForUsers
}
    `},66440:(e,t,n)=>{n.d(t,{q:()=>o});var i=n(86512),a=n(21334);let o=(0,i.w)(a.WJ)},68817:(e,t,n)=>{n.d(t,{A:()=>g});var i=n(37876),a=n(13174),o=n(77328),r=n.n(o),l=n(89099),s=n(45088),m=n(55961),c=n(74720),d=n(39892);let u=({canonical:e="",children:t,description:a,hasCanonical:o=!0,robots:c,socialImageAlt:d,socialImageUrl:u,title:g,viewport:p="width=device-width, initial-scale=1.0, maximum-scale=5"})=>{let{i18n:y,t:h}=(0,m.B)(),v=(0,l.useRouter)(),{isSeoBot:w}=(0,s.r)(),$=Number(v.query.page),f="en-US"===y.language,A=`${n.g.sesame.WHOAMI}${v.asPath}`.split("?")[0],S=h("sparrow:defaultMetaDescription"),b=g?.substring(0,256)??"",x=a||S,C=$?`Page ${$}`:"",M=w&&C?`${b} ${C}`:b,_=w&&C?`${C} ${x}`:x,k=u?((e,t)=>{let n=new URL(e);for(let[e,i]of Object.entries(t))n.searchParams.has(e)||n.searchParams.append(e,i);return`${n.origin}${"/"===n.pathname?"":n.pathname}?${n.searchParams.toString()}`})(u,{w:"756"}):"https://sesamecare.com/assets/sesame-twitter.png",P=u?d:"Sesame company logo";return(0,i.jsxs)(r(),{children:[(0,i.jsx)("meta",{charSet:"UTF-8"}),x&&(0,i.jsx)("meta",{content:_,name:"description"}),(0,i.jsx)("title",{children:M||"Sesame"}),(0,i.jsx)("meta",{content:M||"",property:"og:title"}),x&&(0,i.jsx)("meta",{content:_,property:"og:description"}),c&&(0,i.jsx)("meta",{content:f?c:"noindex, nofollow",name:"robots"}),(0,i.jsx)("meta",{content:p,name:"viewport"}),(0,i.jsx)("link",{href:"https://sesamecare.com/assets/sesame-favicon.png",rel:"icon",type:"image/png"}),(0,i.jsx)("link",{href:"https://sesamecare.com/assets/sesame-ios.png",rel:"apple-touch-icon"}),(0,i.jsx)("meta",{content:"summary_large_image",name:"twitter:card"}),(0,i.jsx)("meta",{content:M,name:"twitter:title"}),(0,i.jsx)("meta",{content:_,name:"twitter:description"}),(0,i.jsx)("meta",{content:"@Sesamecare",name:"twitter:site"}),(0,i.jsx)("meta",{content:k,name:"twitter:image"}),(0,i.jsx)("meta",{content:P||"",name:"twitter:image:alt"}),(0,i.jsx)("meta",{content:k,property:"og:image"}),(0,i.jsx)("meta",{content:"756",property:"og:image:width"}),(0,i.jsx)("meta",{content:"756",property:"og:image:height"}),o&&(0,i.jsx)("link",{href:e||A,rel:"canonical"},"canonical"),t]})},g=(0,a.Xc)(u,{fallback:({componentStack:e,error:t})=>(0,i.jsx)(c.A,{error:t,extras:{componentStack:e,originComponent:u.name},failScope:d.A.Component,severity:"warning"})})},70280:(e,t,n)=>{n.d(t,{i:()=>o});var i=n(86512),a=n(36195);let o=(0,i.w)(a.On)},86512:(e,t,n)=>{n.d(t,{E:()=>l,w:()=>o});var i=n(70368),a=n(3219);let o=e=>e,r=e=>e.definitions[0],l=(e,t="EntryFragment")=>{let n=e.reduce((e,t)=>{let n=r(t).typeCondition.name.value;return{...e,[n]:[...e?.[n]??[],t]}},{}),o=Object.entries(n).map(([e,[t]])=>{let n=r(t).name.value;return`... on ${e} {...${n}}`}).join("\n"),l=`fragment ${t} on Entry {
          sys {
              id
          }
          ${o}
      }`;return(0,a.J1)`
    ${Object.values(n).flat().map(i.y).join("")}
    ${l}
  `}},88976:(e,t,n)=>{n.d(t,{r:()=>r});var i=n(86512),a=n(3219);let o=(0,a.Ay)`
    fragment MarketHero_MarketHero on MarketHero {
  heading
  subHeading
  image {
    description
    url
  }
  imageMobile {
    description
    url
  }
  imagePosition
  imagePositionMobile
  ctaLink
  ctaText
}
    `,r=(0,i.w)(o)},89049:(e,t,n)=>{n.d(t,{M:()=>C});var i=n(86512),a=n(86355),o=n(3219);let r=(0,o.Ay)`
    fragment SectionDefault on Section {
  heading
  subHeading
  sys {
    id
  }
  tight
  variant
  queryParamFlag
  themeKey
}
    `;var l=n(34807);let s=(0,o.Ay)`
    fragment Announcement_Announcement on Announcement {
  buttonsCollection(limit: 2) {
    items {
      ...CmsButton
    }
  }
  centered
  eyebrow
  heading
  text
}
    ${l.E}`,m=(0,i.w)(s);var c=n(19544);let d=(0,o.Ay)`
    fragment IconLinkCollectionItem on IconLink {
  text
  url
}
    `,u=(0,o.Ay)`
    fragment IconLinkListModule_IconLinkListModule on IconLinkListModule {
  heading
  name
  linkButton {
    name
    type
    text
    url
  }
  iconLinkCollection {
    items {
      ...IconLinkCollectionItem
    }
  }
}
    ${d}`,g=(0,i.w)(u);var p=n(70280);let y=(0,o.Ay)`
    fragment PriceComparisonServiceFragment on PriceComparisonService {
  service
  labelWithSesame
  valueWithSesame
  labelWithoutInsurance
  valueWithoutInsurance
  url
}
    `,h=(0,o.Ay)`
    fragment PriceComparisonFragment on PriceComparison {
  heading
  subheading
  servicesCollection(limit: 4) {
    items {
      ...PriceComparisonServiceFragment
    }
  }
}
    ${y}`,v=(0,i.w)(h),w=(0,o.Ay)`
    fragment Snapshot_Snapshot on Snapshot {
  eyebrow
  heading
  image {
    url
    description
  }
  imageMobile {
    url
    description
  }
  imagePosition
  text
}
    `,$=(0,i.w)(w);var f=n(66440);let A=(0,o.Ay)`
    fragment ThreeUpModuleFragment on ThreeUp {
  blocksCollection(limit: 3) {
    items {
      ... on ImageHeadingTextBlock {
        sys {
          id
        }
        heading
        text
        image {
          description
          url
        }
      }
    }
  }
  button {
    ...CmsButton
  }
  buttonClickEventName
}
    ${l.E}`,S=(0,i.w)(A),b=[m,c.z,g,p.i,v,$,f.q,S],x=(0,i.E)(b,"SectionEntryFragment"),C=(0,i.w)((0,a.J1)`
  fragment Section_Section on Section {
    ...SectionDefault
    modulesCollection(limit: 1) {
      items {
        __typename
        ... on Entry {
          sys {
            id
          }
        }
        ...SectionEntryFragment
      }
    }
  }

  ${r}
  ${x}
`)},89673:(e,t,n)=>{n.d(t,{t:()=>l});var i=n(86512),a=n(3219),o=n(34807);let r=(0,a.Ay)`
    fragment Hero_Hero on Hero {
  heading
  subHeading
  heroTags
  buttonDisplay
  image {
    description
    url
  }
  imageMobile {
    description
    url
  }
  imagePosition
  imagePositionMobile
  tallImage
  wideImage
  button {
    ...CmsButton
  }
  secondaryButton {
    ...CmsButton
  }
  buttonClickEventName
  testimonial {
    displayName
    quote
    location {
      location
    }
  }
  servicePricingHeading
  trustpilotEyebrow
  themeKey
}
    ${o.E}`,l=(0,i.w)(r)},98813:(e,t,n)=>{n.d(t,{T:()=>r});var i=n(37876),a=n(77328),o=n.n(a);let r=({schema:e})=>(0,i.jsx)(o(),{children:(0,i.jsx)("script",{dangerouslySetInnerHTML:{__html:JSON.stringify(e)},type:"application/ld+json"})})},99321:(e,t,n)=>{n.d(t,{A:()=>c});var i=n(23459),a=n(89099),o=n(14232),r=n(6416),l=n(87072),s=n(85920),m=n(42251);let c=function(e,t={},n={}){let c=(0,a.useRouter)(),{locale:d}=(0,m.L)(),u={locale:d,preview:(0,s.vV)(c.query),...t.variables},g={query:e,...t,variables:u,pause:t.skip,context:(0,o.useMemo)(()=>s.uZ,[])};"string"==typeof g.variables?.locale&&i.LANGUAGES.includes(g.variables.locale)||(g.variables={...g.variables,locale:i.DEFAULT_LANGUAGE});let[{data:p,error:y,fetching:h}]=(0,r.IT)(g);return{data:(0,l.A)(p,n),loading:h,error:y}}}}]);
//# sourceMappingURL=2474-d9e4ee878a19100a.js.map