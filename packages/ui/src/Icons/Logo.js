export const Logo = ({ ...props }) => {
  return(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 885 256"
      {...props}
    >
      <path
        fill="#915FF2"
        d="M661 27.818C661 12.823 673.156.667 688.152.667h169.696C872.844.667 885 12.823 885 27.818v33.94c0 14.995-12.156 27.151-27.152 27.151H688.152C673.156 88.91 661 76.753 661 61.758v-33.94z"
      ></path>
      <path
        fill="#fff"
        d="M707.74 61.758V22.265h16.468c2.957 0 5.431.418 7.424 1.253 2.006.836 3.51 2.006 4.512 3.51 1.016 1.504 1.524 3.246 1.524 5.226 0 1.504-.315 2.847-.945 4.03a8.321 8.321 0 01-2.603 2.912c-1.106.771-2.385 1.311-3.838 1.62v.386a9.586 9.586 0 014.416 1.291c1.363.785 2.456 1.877 3.278 3.279.823 1.388 1.235 3.034 1.235 4.936 0 2.122-.54 4.018-1.62 5.69-1.08 1.657-2.642 2.969-4.686 3.933-2.044.951-4.525 1.427-7.444 1.427H707.74zm9.545-7.694h5.901c2.07 0 3.593-.392 4.57-1.176.99-.785 1.485-1.877 1.485-3.279 0-1.015-.238-1.89-.714-2.622-.475-.746-1.15-1.318-2.024-1.717-.875-.411-1.922-.617-3.144-.617h-6.074v9.41zm0-15.562h5.284c1.041 0 1.967-.174 2.777-.52.809-.348 1.439-.85 1.889-1.505.463-.656.695-1.446.695-2.372 0-1.324-.47-2.365-1.408-3.124-.939-.758-2.205-1.138-3.799-1.138h-5.438v8.659zM743.8 61.758V22.265h27.538v7.752h-17.992v8.1h16.584v7.77h-16.584v8.119h17.992v7.752H743.8zM776.024 30.017v-7.752h33.38v7.752h-11.975v31.741h-9.411V30.017h-11.994zM817.677 61.758h-10.26l13.326-39.493h12.707l13.326 39.493h-10.26l-9.275-29.543h-.308l-9.256 29.543zm-1.37-15.543h21.444v7.251h-21.444v-7.25z"
      ></path>
      <path
        fill="#FFAE45"
        d="M171.453 59l39.682 39.46c32.789 32.607 32.789 85.473 0 118.08L171.453 256l-99.051-98.5L171.453 59z"
      ></path>
      <path
        fill="#915FF2"
        d="M64.273 256l-39.681-39.461c-32.79-32.606-32.79-85.472 0-118.078L64.273 59l99.052 98.5L64.273 256z"
      ></path>
      <path
        fill="#2A1468"
        fillRule="evenodd"
        d="M117.863 112.297l45.462 45.208-45.462 45.209-45.461-45.209 45.461-45.208z"
        clipRule="evenodd"
      ></path>
      <path
        fill={props.white ? '#FFFFFF' : '#171129'}
        d="M290.863 220.637h27.081v-53.722c0-15.789 8.724-26.316 25.99-26.316 3.09 0 6.543.363 9.996 1.089v-27.405a39.79 39.79 0 00-6.543-.545c-12.904 0-23.627 5.627-31.624 14.52l-2.181-13.612h-22.719v105.991zM413.386 222.452c17.448 0 29.989-4.719 42.348-15.79l-15.994-17.605c-6.725 6.353-15.631 9.619-26.172 9.619-16.176 0-27.808-8.711-31.261-22.323h78.698c.545-2.178.727-5.808.727-12.523 0-29.765-21.265-50.999-50.89-50.999-31.625 0-55.434 23.775-55.434 55.536 0 31.943 23.809 54.085 57.978 54.085zm-30.534-66.608c3.817-11.978 13.632-19.238 27.808-19.238 14.358 0 24.536 7.804 25.081 19.238h-52.889zM474.265 106.66v113.977h27.263V139.51h11.086v-24.864h-11.086v-7.441c0-6.171 3.998-11.253 11.086-11.253V71.088c-21.082 0-38.349 14.882-38.349 35.572zm51.124 80.401c0 22.868 12.173 35.391 35.986 35.391v-24.138c-6.543 0-8.905-3.993-8.905-12.342l.181-113.07h-27.262v114.159zM574.708 220.637h27.08V114.646h-27.08v105.991zm-2.363-136.482c0 8.712 7.27 15.79 15.994 15.79s15.812-7.078 15.812-15.79c0-8.53-7.088-15.608-15.812-15.608s-15.994 7.078-15.994 15.608zM669.203 222.452c31.261 0 55.797-23.957 55.797-54.811 0-30.853-24.536-54.81-55.797-54.81-31.079 0-55.615 23.775-55.615 54.81 0 30.854 24.354 54.811 55.615 54.811zm-28.171-54.811c0-16.334 12.177-28.312 28.171-28.312s28.171 11.978 28.171 28.312c0 16.153-11.995 28.313-28.171 28.313-15.994 0-28.171-11.978-28.171-28.313z"
      ></path>
    </svg>
  );
};

export default Logo;