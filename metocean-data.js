const deg2rad = x => x / 180 * Math.PI

const content = `Time[UTC+0.0],lev[m],hs[m],hx[m],tp[s],tm01[s],tm02[s],dp[deg],dpm[deg],hs_sw1[m],hs_sw8[m],tp_sw1[s],tp_sw8[s],dpm_sw8[deg],dpm_sw1[deg],hs_sea8[m],hs_sea[m],tp_sea8[s],tp_sea[s],tm_sea[s],dpm_sea8[deg],dpm_sea[deg],hs_ig[m],hs_fig[m],wsp[kts],gst[kts],wd[deg],wsp100[kts],wsp50[kts],wsp80[kts],precip[mm/hr],tmp[C],rh[%],vis[km],cld[%],cb[m],csp0[kts],cd0[deg],ss[m],sst[C]
2014-02-10 05:00:00,0.00,1.9,3.5,13.1,6.6,5.6,0,243,1.4,1.3,13.1,13.1,243,243,1.3,0.0,7.4,0.0,0.0,163,0,0.00,0.00,5,6,136,6,6,6,0.00,17.4,72,11.8,0,0,0.6,247,-0.02,18.2
2014-02-10 06:00:00,0.00,1.8,3.4,13.0,6.6,5.6,0,244,1.4,1.3,13.0,13.0,244,244,1.3,0.0,7.4,0.0,0.0,166,0,0.00,0.00,8,10,121,9,9,9,0.00,17.1,70,12.6,0,0,0.5,241,-0.00,18.1
2014-02-10 07:00:00,0.00,1.8,3.3,13.0,6.6,5.5,0,244,1.3,1.3,13.0,13.0,244,243,1.3,0.0,7.4,0.0,0.0,168,0,0.00,0.00,9,11,116,10,9,10,0.00,16.9,73,11.4,0,0,0.5,232,-0.01,17.9
2014-02-10 08:00:00,0.00,1.8,3.3,13.0,6.4,5.4,0,244,1.3,1.2,13.0,13.0,244,244,1.3,0.0,7.3,0.0,0.0,170,0,0.00,0.00,8,10,119,9,9,9,0.00,16.9,74,11.1,0,0,0.4,222,0.02,17.8
2014-02-10 09:00:00,0.00,1.7,3.2,12.9,6.4,5.4,0,244,1.3,1.2,12.9,12.9,244,244,1.2,0.0,7.3,0.0,0.0,173,0,0.00,0.00,7,9,120,8,8,8,0.00,16.9,75,10.9,0,0,0.3,212,0.03,17.8
2014-02-10 10:00:00,0.00,1.7,3.1,12.9,6.5,5.4,0,244,1.3,1.2,12.9,12.9,244,244,1.2,0.0,7.3,0.0,0.0,176,0,0.00,0.00,6,7,119,6,6,6,0.00,16.9,75,10.8,0,0,0.2,203,0.02,17.7
2014-02-10 11:00:00,0.00,1.7,3.1,12.8,6.5,5.5,0,244,1.3,1.2,12.8,12.8,244,244,1.2,0.0,7.2,0.0,0.0,181,0,0.00,0.00,6,7,106,6,6,6,0.00,16.9,76,10.5,0,0,0.1,202,0.02,17.7
2014-02-10 12:00:00,0.00,1.6,3.0,12.8,6.6,5.5,0,244,1.3,1.2,12.8,12.8,244,244,1.1,0.0,7.2,0.0,0.0,185,0,0.00,0.00,2,2,89,2,2,2,0.00,17.1,73,11.6,0,0,0.0,206,0.03,17.7
2014-02-10 13:00:00,0.00,1.6,2.9,12.7,6.5,5.4,0,244,1.3,1.1,12.7,12.7,244,244,1.1,0.0,7.3,0.0,0.0,192,0,0.00,0.00,1,2,38,1,1,1,0.00,17.0,77,10.2,0,0,0.1,351,0.02,17.6
2014-02-10 14:00:00,0.00,1.5,2.9,12.6,6.4,5.3,0,241,1.2,1.1,12.6,12.6,241,241,1.1,0.0,0.0,0.0,0.0,0,0,0.00,0.00,2,3,355,3,3,3,0.00,17.0,77,10.1,0,0,0.1,329,0.01,17.6
2014-02-10 15:00:00,0.00,1.5,2.8,12.5,6.3,5.2,0,241,1.2,1.1,12.5,12.5,241,241,1.0,0.0,0.0,0.0,0.0,0,0,0.00,0.00,4,5,328,4,4,4,0.00,17.0,79,9.6,0,0,0.2,321,0.00,17.6
2014-02-10 16:00:00,0.00,1.5,2.7,12.4,6.3,5.2,0,241,1.2,1.1,12.4,12.4,241,241,1.0,0.0,0.0,0.0,0.0,0,0,0.00,0.00,6,7,311,6,6,6,0.00,17.1,80,9.1,100,8345,0.2,301,-0.01,17.6
2014-02-10 17:00:00,0.00,1.4,2.6,12.3,6.4,5.2,0,241,1.2,1.1,12.3,12.3,241,241,0.9,0.0,0.0,0.0,0.0,0,0,0.00,0.00,7,8,307,7,7,7,0.00,17.2,82,8.8,100,1957,0.2,289,-0.02,17.5
2014-02-10 18:00:00,0.00,1.4,2.6,12.2,6.5,5.3,0,241,1.2,1.0,12.2,12.2,241,241,0.9,0.0,0.0,0.0,0.0,0,0,0.00,0.00,7,9,323,8,7,7,0.00,17.5,74,11.2,0,0,0.2,274,-0.01,17.5
2014-02-10 19:00:00,0.00,1.3,2.5,12.1,6.6,5.3,0,241,1.2,1.0,12.1,12.1,241,241,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,8,9,323,9,8,8,0.00,17.4,78,9.9,51,0,0.2,266,-0.01,17.5
2014-02-10 20:00:00,0.00,1.3,2.4,12.0,6.6,5.4,0,241,1.1,1.0,12.0,12.0,241,241,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,8,10,333,9,9,9,0.00,17.5,78,9.8,0,651,0.2,252,0.00,17.5
2014-02-10 21:00:00,0.00,1.3,2.3,12.0,6.7,5.4,0,241,1.1,1.0,12.0,12.0,241,241,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,9,10,331,9,9,9,0.00,17.6,79,9.5,100,650,0.1,233,0.01,17.6
2014-02-10 22:00:00,0.00,1.2,2.3,11.9,6.8,5.5,0,241,1.1,1.0,11.9,11.9,241,241,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,9,11,330,10,10,10,0.00,17.7,79,9.4,100,650,0.1,178,0.01,17.7
2014-02-10 23:00:00,0.00,1.2,2.2,11.9,6.9,5.6,0,241,1.1,1.0,11.9,11.9,241,241,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,10,12,326,11,11,11,0.00,17.7,80,9.1,100,651,0.1,121,-0.01,17.8
2014-02-11 00:00:00,0.00,1.2,2.2,11.9,7.1,5.7,0,241,1.1,0.9,11.9,11.9,241,241,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,15,316,13,12,13,0.00,17.9,74,11.2,0,0,0.2,102,-0.02,17.9
2014-02-11 01:00:00,0.00,1.1,2.1,11.8,7.0,5.6,0,241,1.1,0.9,11.8,11.8,241,241,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,15,314,14,13,14,0.00,17.7,80,9.2,100,8540,0.3,88,-0.04,18.0
2014-02-11 02:00:00,0.00,1.1,2.1,11.8,6.8,5.4,0,242,1.0,0.9,11.8,11.8,242,241,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,13,15,312,14,14,14,0.00,17.8,81,8.9,100,7460,0.3,75,-0.04,18.0
2014-02-11 03:00:00,0.00,1.1,2.1,11.8,6.7,5.4,0,242,1.0,0.9,11.8,11.8,242,241,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,15,309,14,13,14,0.00,17.9,81,8.8,100,5305,0.3,97,-0.05,17.9
2014-02-11 04:00:00,0.00,1.1,2.0,11.7,6.7,5.4,0,242,1.0,0.9,11.7,11.7,242,242,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,13,16,305,15,14,15,0.00,17.9,82,8.7,100,1291,0.3,86,-0.04,17.9
2014-02-11 05:00:00,0.00,1.1,2.0,11.7,6.6,5.3,0,242,1.0,0.9,11.7,11.7,242,242,0.6,0.4,0.0,3.4,0.0,0,260,0.00,0.00,14,17,298,15,15,15,0.00,17.9,83,8.4,100,3032,0.3,75,-0.06,17.8
2014-02-11 06:00:00,0.00,1.1,2.0,11.7,6.5,5.3,0,242,0.9,0.9,11.7,11.7,242,242,0.7,0.5,0.0,3.5,0.0,0,262,0.00,0.00,15,19,298,16,16,16,0.00,17.9,77,10.2,0,0,0.4,66,-0.04,17.8
2014-02-11 07:00:00,0.00,1.1,2.1,11.6,5.9,4.8,0,243,0.9,0.8,11.6,11.6,243,242,0.7,0.6,0.0,3.5,0.0,0,268,0.00,0.00,15,19,289,17,17,17,0.00,17.9,82,8.5,0,0,0.4,57,-0.01,17.8
2014-02-11 08:00:00,0.00,1.1,2.1,11.6,5.7,4.7,0,243,0.9,0.8,11.6,11.6,243,242,0.8,0.6,0.0,3.8,0.0,0,259,0.00,0.00,14,18,291,16,16,16,0.00,17.9,83,8.4,0,0,0.3,48,-0.03,17.7
2014-02-11 09:00:00,0.00,1.1,2.1,11.6,5.7,4.7,0,243,0.9,0.8,11.6,11.6,243,243,0.8,0.7,0.0,4.0,0.0,0,257,0.00,0.00,14,17,298,16,15,15,0.00,17.9,83,8.3,0,0,0.3,42,0.02,17.7
2014-02-11 10:00:00,0.00,1.1,2.1,11.6,5.6,4.7,0,243,0.9,0.8,11.6,11.6,243,243,0.8,0.7,0.0,4.0,0.0,0,258,0.00,0.00,14,17,305,16,15,16,0.00,18.0,84,8.2,0,0,0.3,35,-0.01,17.7
2014-02-11 11:00:00,0.00,1.1,2.1,11.5,5.5,4.6,0,244,0.9,0.8,11.5,11.5,244,243,0.8,0.7,0.0,4.0,0.0,0,260,0.00,0.00,15,18,308,17,17,17,0.00,18.1,84,8.0,0,0,0.3,28,-0.00,17.6
2014-02-11 12:00:00,0.00,1.2,2.2,11.5,5.3,4.5,0,244,0.9,0.8,11.5,11.5,244,243,0.9,0.8,0.0,4.0,0.0,0,264,0.00,0.00,15,18,322,16,16,16,0.00,18.5,77,10.0,0,0,0.2,24,-0.01,17.6
2014-02-11 13:00:00,0.00,1.2,2.2,11.4,5.2,4.4,0,244,0.9,0.8,11.4,11.4,244,244,0.9,0.8,0.0,4.0,0.0,0,269,0.00,0.00,16,20,324,18,18,18,0.00,18.4,83,8.4,0,0,0.1,21,-0.03,17.6
2014-02-11 14:00:00,0.00,1.2,2.3,11.3,5.1,4.4,0,245,0.9,0.8,11.3,11.3,245,244,0.9,0.7,0.0,3.8,0.0,0,290,0.00,0.00,16,20,324,19,18,18,0.00,18.4,83,8.4,0,840,0.0,60,-0.03,17.6
2014-02-11 15:00:00,0.00,1.3,2.3,11.3,5.0,4.3,0,245,0.9,0.8,11.3,11.3,245,244,1.0,0.9,4.2,4.2,0.0,262,262,0.00,0.00,17,22,322,20,19,20,0.00,18.4,85,7.8,2,976,0.1,124,-0.04,17.6
2014-02-11 16:00:00,0.00,1.3,2.4,11.2,5.0,4.3,0,244,0.9,0.8,11.2,11.2,244,244,1.0,1.0,4.3,4.3,0.0,267,267,0.00,0.00,18,22,317,20,19,20,0.18,18.3,88,7.2,95,1150,0.1,128,-0.05,17.6
2014-02-11 17:00:00,0.00,1.3,2.5,11.2,5.1,4.4,0,244,0.9,0.8,11.1,11.2,244,244,1.0,1.0,4.4,4.4,0.0,270,270,0.00,0.00,13,16,291,15,14,15,0.33,18.1,89,6.8,55,1151,0.1,102,-0.06,17.6
2014-02-11 18:00:00,0.00,1.3,2.5,11.1,5.2,4.5,0,245,0.9,0.8,11.1,11.1,245,244,1.0,1.0,4.5,4.5,0.0,270,270,0.00,0.00,12,15,278,13,13,13,0.00,18.1,84,8.1,0,0,0.2,89,-0.04,17.6
2014-02-11 19:00:00,0.00,1.4,2.6,11.0,5.3,4.6,0,245,1.0,0.8,11.0,11.0,245,244,1.1,1.0,0.0,5.0,0.0,0,258,0.00,0.00,13,16,268,15,15,15,0.00,17.8,86,7.7,0,0,0.2,77,-0.01,17.6
2014-02-11 20:00:00,0.00,1.5,2.7,11.1,5.4,4.7,0,245,0.8,0.9,11.1,11.1,245,245,1.2,1.2,6.3,6.3,0.0,255,255,0.00,0.00,15,19,264,18,17,17,0.00,17.8,86,7.7,0,0,0.3,69,-0.01,17.6
2014-02-11 21:00:00,0.00,1.6,3.0,11.3,5.4,4.8,0,245,0.8,0.9,11.3,11.3,245,244,1.3,1.4,5.9,5.9,0.0,255,255,0.00,0.00,17,22,260,20,19,20,0.00,17.6,86,7.7,0,0,0.4,65,0.03,17.6
2014-02-11 22:00:00,0.00,1.7,3.2,11.4,5.5,4.9,0,245,0.9,0.9,11.4,11.4,245,244,1.4,1.5,6.3,6.3,0.0,255,255,0.00,0.00,18,23,261,21,20,21,0.00,17.5,86,7.7,100,650,0.4,63,0.00,17.6
2014-02-11 23:00:00,0.00,1.8,3.4,6.4,5.6,5.0,0,253,0.8,1.0,11.6,11.6,245,244,1.5,1.6,6.4,6.4,0.0,253,253,0.00,0.00,20,25,260,24,22,23,0.00,17.5,83,8.3,100,650,0.5,60,-0.02,17.7
2014-02-12 00:00:00,0.00,1.9,3.6,6.5,5.7,5.1,0,253,0.1,1.0,11.6,11.7,245,348,1.6,1.9,6.5,6.5,0.0,253,253,0.00,0.00,23,29,262,25,24,25,0.00,17.9,75,10.9,0,0,0.5,57,-0.05,17.7
2014-02-12 01:00:00,0.00,2.1,3.9,6.5,5.7,5.1,0,252,0.1,1.1,11.6,11.8,244,348,1.8,2.1,6.5,6.5,0.0,252,252,0.00,0.00,24,30,261,28,27,28,0.00,17.8,77,10.1,0,0,0.5,51,-0.07,17.8
2014-02-12 02:00:00,0.00,2.2,4.1,6.6,5.8,5.2,0,252,0.1,1.2,11.6,11.9,244,348,1.9,2.2,6.6,6.6,0.0,252,252,0.00,0.00,25,31,262,29,28,29,0.00,17.7,78,9.8,0,0,0.5,49,-0.07,17.8
2014-02-12 03:00:00,0.00,2.3,4.3,6.7,5.9,5.3,0,251,1.0,1.2,12.0,12.0,244,244,1.9,2.1,6.7,6.7,0.0,251,251,0.00,0.00,24,30,263,28,27,27,0.00,17.7,79,9.3,0,0,0.6,48,-0.08,17.7
2014-02-12 04:00:00,0.00,2.3,4.4,6.8,6.0,5.3,0,251,1.1,1.3,12.0,12.0,244,244,2.0,2.1,6.8,6.8,0.0,251,251,0.00,0.00,24,30,264,28,27,28,0.00,17.8,80,9.2,28,0,0.6,45,-0.07,17.7
2014-02-12 05:00:00,0.00,2.4,4.4,6.9,6.0,5.4,0,251,1.1,1.4,12.0,12.0,244,244,2.0,2.1,6.9,6.9,0.0,251,251,0.00,0.00,23,29,266,27,25,26,0.01,17.8,80,9.3,85,888,0.6,42,-0.08,17.7
2014-02-12 06:00:00,0.00,2.4,4.5,7.0,6.1,5.4,0,251,1.2,1.4,12.0,12.0,244,244,2.0,2.1,7.0,7.0,0.0,251,251,0.00,0.00,22,27,275,24,23,23,0.00,17.7,76,10.4,0,0,0.5,42,-0.06,17.7
2014-02-12 07:00:00,0.00,2.4,4.5,12.0,6.2,5.5,0,244,1.2,1.5,12.0,12.0,244,244,2.0,2.1,7.0,7.0,0.0,251,251,0.00,0.00,22,27,275,25,24,25,0.00,17.5,81,9.0,0,0,0.5,44,-0.02,17.7
2014-02-12 08:00:00,0.00,2.5,4.6,12.0,6.2,5.5,0,244,1.3,1.5,12.1,12.0,244,244,1.9,2.1,7.0,7.1,0.0,251,251,0.00,0.00,22,28,276,26,24,25,0.00,17.4,82,8.6,0,0,0.4,48,0.00,17.6
2014-02-12 09:00:00,0.00,2.4,4.5,12.0,6.3,5.5,0,244,1.3,1.5,12.1,12.0,244,244,1.9,2.1,7.1,7.2,0.0,251,251,0.00,0.00,21,26,275,25,23,24,0.06,17.3,83,8.3,29,649,0.4,51,0.02,17.6
2014-02-12 10:00:00,0.00,2.4,4.5,12.0,6.4,5.6,0,244,1.5,1.6,12.0,12.0,244,244,1.8,1.9,7.2,7.1,0.0,251,251,0.00,0.00,20,24,277,23,22,22,0.21,17.1,86,7.6,100,649,0.3,53,0.01,17.6
2014-02-12 11:00:00,0.00,2.4,4.5,12.0,6.4,5.6,0,244,1.6,1.6,12.0,12.0,244,244,1.8,1.8,7.2,7.0,0.0,251,251,0.00,0.00,19,24,274,22,21,22,0.09,17.1,86,7.7,100,649,0.3,58,0.02,17.6
2014-02-12 12:00:00,0.00,2.4,4.4,12.0,6.5,5.7,0,244,1.6,1.6,12.0,12.0,244,244,1.8,1.8,7.2,7.0,0.0,252,252,0.00,0.00,19,23,276,20,20,20,0.00,17.5,75,10.7,0,0,0.3,63,-0.02,17.6
2014-02-12 13:00:00,0.00,2.4,4.4,12.0,6.5,5.7,0,244,1.5,1.6,12.0,12.0,244,244,1.7,1.8,7.3,7.4,0.0,252,252,0.00,0.00,19,24,273,22,21,22,0.00,17.2,79,9.6,0,0,0.4,71,-0.01,17.6
2014-02-12 14:00:00,0.00,2.4,4.4,11.9,6.6,5.7,0,244,1.5,1.6,11.9,11.9,244,244,1.7,1.8,7.5,7.6,0.0,252,252,0.00,0.00,19,24,272,22,21,22,0.00,17.2,79,9.6,13,0,0.4,74,-0.03,17.6
2014-02-12 15:00:00,0.00,2.4,4.4,11.9,6.6,5.7,0,244,0.1,1.7,11.2,11.9,244,350,1.7,2.4,0.0,11.9,0.0,0,244,0.00,0.00,19,24,271,22,21,22,0.00,17.2,79,9.4,13,0,0.5,75,-0.06,17.6
2014-02-12 16:00:00,0.00,2.4,4.4,11.8,6.7,5.8,0,245,0.1,1.7,20.1,11.8,245,252,1.7,2.4,0.0,11.8,0.0,0,244,0.00,0.00,20,25,269,24,23,23,0.00,17.2,80,9.3,40,886,0.5,70,-0.05,17.6
2014-02-12 17:00:00,0.00,2.4,4.5,11.8,6.7,5.8,0,245,0.2,1.7,19.9,11.8,245,252,1.7,2.4,0.0,11.8,0.0,0,245,0.00,0.00,21,26,268,24,23,24,0.00,17.2,80,9.2,0,0,0.5,67,-0.07,17.6
2014-02-12 18:00:00,0.00,2.4,4.5,11.7,6.7,5.8,0,245,0.2,1.7,19.9,11.7,245,253,1.7,2.4,0.0,11.7,0.0,0,245,0.00,0.00,21,27,271,23,22,22,0.00,17.6,73,11.4,0,0,0.5,67,-0.05,17.6
2014-02-12 19:00:00,0.00,2.4,4.5,11.6,6.6,5.8,0,245,0.2,1.7,19.8,11.6,245,252,1.7,2.4,0.0,11.6,0.0,0,245,0.00,0.00,22,27,268,25,24,25,0.00,17.6,78,9.9,0,0,0.5,64,0.00,17.6
2014-02-12 20:00:00,0.00,2.5,4.6,11.6,6.6,5.8,0,245,0.2,1.7,19.8,11.6,245,252,1.8,2.4,0.0,11.6,0.0,0,245,0.00,0.00,22,27,269,25,24,25,0.00,17.6,79,9.4,0,0,0.6,61,0.01,17.6
2014-02-12 21:00:00,0.00,2.5,4.6,11.5,6.6,5.7,0,246,0.2,1.7,19.7,11.5,246,252,1.8,2.5,0.0,11.5,0.0,0,245,0.00,0.00,20,25,268,24,23,23,0.00,17.6,80,9.2,0,0,0.6,57,0.05,17.6
2014-02-12 22:00:00,0.00,2.5,4.7,11.4,6.5,5.7,0,246,0.3,1.7,19.5,11.4,246,252,1.8,2.5,0.0,11.4,0.0,0,246,0.00,0.00,21,26,271,25,24,24,0.00,17.7,81,8.8,0,0,0.6,56,0.06,17.6
2014-02-12 23:00:00,0.00,2.5,4.7,11.4,6.5,5.7,0,246,0.3,1.7,19.4,11.4,246,252,1.9,2.5,0.0,11.4,0.0,0,246,0.00,0.00,22,28,270,26,25,25,0.00,17.8,81,8.8,0,0,0.6,54,0.02,17.7
2014-02-13 00:00:00,0.00,2.5,4.7,11.3,6.5,5.7,0,246,0.3,1.7,19.4,11.3,246,252,1.9,2.5,6.7,11.3,0.0,259,246,0.00,0.00,23,29,272,25,24,25,0.00,18.2,75,10.9,0,0,0.5,56,-0.02,17.7
2014-02-13 01:00:00,0.00,2.6,4.8,11.2,6.5,5.7,0,245,0.3,1.7,19.3,11.2,245,252,1.9,2.5,6.8,11.2,0.0,259,245,0.00,0.00,23,30,269,28,26,27,0.00,18.0,79,9.6,0,0,0.6,56,-0.03,17.7
2014-02-13 02:00:00,0.00,2.6,4.7,11.1,6.5,5.7,0,245,0.4,1.7,18.9,11.1,245,252,1.9,2.5,6.8,11.1,0.0,259,245,0.00,0.00,24,30,271,28,27,28,0.00,17.8,81,9.0,0,0,0.5,59,-0.06,17.7
2014-02-13 03:00:00,0.00,2.6,4.8,11.0,6.5,5.7,0,245,0.4,1.7,18.8,11.0,245,252,1.9,2.5,6.8,11.1,0.0,260,245,0.00,0.00,23,29,272,27,26,27,0.00,17.8,82,8.7,0,0,0.5,60,-0.06,17.7
2014-02-13 04:00:00,0.00,2.6,4.8,10.9,6.5,5.7,0,246,0.4,1.7,18.6,10.9,246,252,1.9,2.5,6.8,10.9,0.0,260,245,0.00,0.00,23,29,271,27,26,27,0.00,17.8,83,8.4,0,0,0.5,62,-0.09,17.7
2014-02-13 05:00:00,0.00,2.6,4.8,10.9,6.5,5.7,0,246,0.4,1.7,18.4,10.9,246,252,1.9,2.5,0.0,10.9,0.0,0,245,0.00,0.00,23,30,274,28,26,27,0.00,17.7,83,8.3,0,0,0.5,65,-0.10,17.7
2014-02-13 06:00:00,0.00,2.6,4.8,10.8,6.5,5.7,0,246,0.5,1.7,18.0,10.8,246,248,1.9,2.5,0.0,10.8,0.0,0,245,0.00,0.00,21,27,274,23,22,23,0.00,18.0,78,9.9,0,0,0.5,69,-0.09,17.7
2014-02-13 07:00:00,0.00,2.6,4.8,10.7,6.5,5.7,0,246,0.5,1.7,17.8,10.7,246,249,1.9,2.5,0.0,10.7,0.0,0,245,0.00,0.00,22,28,273,26,25,25,0.00,17.8,82,8.8,0,0,0.5,71,-0.02,17.7
2014-02-13 08:00:00,0.00,2.6,4.8,10.6,6.5,5.7,0,246,0.5,1.7,17.7,10.6,246,249,1.9,2.5,0.0,10.6,0.0,0,246,0.00,0.00,23,29,271,27,26,27,0.00,17.6,82,8.6,0,0,0.5,72,0.01,17.6
2014-02-13 09:00:00,0.00,2.6,4.8,10.6,6.5,5.7,0,246,0.5,1.7,17.6,10.6,246,249,2.0,2.6,0.0,10.6,0.0,0,246,0.00,0.00,22,27,272,25,24,25,0.00,17.6,82,8.6,0,0,0.5,72,0.05,17.6
2014-02-13 10:00:00,0.00,2.6,4.8,10.5,6.5,5.7,0,246,0.6,1.7,17.4,10.5,246,249,2.0,2.5,0.0,10.5,0.0,0,246,0.00,0.00,21,26,269,24,23,24,0.07,17.4,86,7.5,10,0,0.5,72,0.05,17.6
2014-02-13 11:00:00,0.00,2.6,4.8,10.4,6.5,5.7,0,246,0.6,1.7,17.4,10.4,246,249,1.9,2.5,0.0,10.4,0.0,0,246,0.00,0.00,21,27,275,25,24,25,0.00,17.6,82,8.6,0,0,0.5,71,0.05,17.6
2014-02-13 12:00:00,0.00,2.6,4.8,10.4,6.5,5.8,0,246,0.6,1.7,17.4,10.4,246,249,1.9,2.5,0.0,10.4,0.0,0,246,0.00,0.00,22,28,271,24,23,23,0.00,17.9,78,9.8,0,0,0.5,72,0.01,17.6
2014-02-13 13:00:00,0.00,2.6,4.9,10.3,6.5,5.8,0,246,0.6,1.7,17.3,10.3,246,249,2.0,2.6,0.0,10.3,0.0,0,246,0.00,0.00,21,27,271,25,24,25,0.00,17.7,83,8.5,0,0,0.6,71,0.00,17.6
2014-02-13 14:00:00,0.00,2.6,4.9,10.2,6.5,5.8,0,246,0.6,1.7,17.3,10.2,246,249,2.0,2.6,0.0,10.2,0.0,0,246,0.00,0.00,21,27,269,25,24,25,0.00,17.6,83,8.3,13,0,0.6,68,-0.02,17.6
2014-02-13 15:00:00,0.00,2.7,4.9,10.1,6.5,5.8,0,246,0.6,1.8,17.2,10.1,246,249,2.0,2.6,0.0,10.1,0.0,0,246,0.00,0.00,20,26,270,24,23,23,0.00,17.6,83,8.2,57,650,0.5,62,-0.05,17.6
2014-02-13 16:00:00,0.00,2.7,4.9,10.1,6.5,5.8,0,246,0.6,1.8,17.2,10.1,246,249,2.0,2.6,0.0,10.1,0.0,0,246,0.00,0.00,21,26,268,24,23,24,0.04,17.5,85,8.0,96,649,0.5,59,-0.05,17.6
2014-02-13 17:00:00,0.00,2.6,4.9,10.0,6.6,5.8,0,246,0.6,1.8,17.1,10.0,246,249,2.0,2.6,0.0,10.0,0.0,0,246,0.00,0.00,22,27,269,26,24,25,0.01,17.5,84,8.1,100,649,0.5,57,-0.05,17.6
2014-02-13 18:00:00,0.00,2.6,4.9,9.9,6.6,5.8,0,247,0.7,1.8,16.8,9.9,247,249,2.0,2.6,0.0,9.9,0.0,0,247,0.00,0.00,22,28,268,24,23,23,0.00,17.8,79,9.5,0,0,0.5,55,-0.05,17.6
2014-02-13 19:00:00,0.00,2.7,4.9,9.8,6.6,5.8,0,247,0.7,1.8,16.7,9.8,247,249,2.0,2.6,0.0,9.7,0.0,0,247,0.00,0.00,22,28,267,26,25,26,0.00,17.6,82,8.6,0,0,0.5,55,0.02,17.6
2014-02-13 20:00:00,0.00,2.7,5.0,9.6,6.6,5.8,0,247,0.7,1.8,16.6,9.6,247,249,2.0,2.6,0.0,9.6,0.0,0,247,0.00,0.00,23,28,263,27,25,26,0.00,17.5,82,8.6,0,0,0.5,54,0.04,17.6
2014-02-13 21:00:00,0.00,2.7,5.0,9.5,6.6,5.8,0,247,0.7,1.8,16.4,9.5,247,249,2.0,2.6,0.0,9.5,0.0,0,247,0.00,0.00,21,26,261,25,23,24,0.00,17.5,82,8.5,10,888,0.5,54,0.07,17.6
2014-02-13 22:00:00,0.00,2.7,5.0,9.5,6.6,5.8,0,247,0.6,1.8,16.8,9.5,247,249,2.0,2.6,0.0,9.5,0.0,0,247,0.00,0.00,21,26,262,24,23,24,0.00,17.7,82,8.7,96,858,0.5,54,0.08,17.6
2014-02-13 23:00:00,0.00,2.7,4.9,9.4,6.6,5.8,0,246,0.8,1.8,15.7,9.4,246,245,2.0,2.5,0.0,9.4,0.0,0,246,0.00,0.00,20,25,267,23,22,23,0.00,17.7,82,8.6,96,888,0.5,55,0.04,17.6
2014-02-14 00:00:00,0.00,2.6,4.9,9.4,6.6,5.8,0,246,0.8,1.8,15.6,9.4,246,245,2.0,2.5,0.0,9.4,0.0,0,246,0.00,0.00,22,28,269,24,23,24,0.00,18.1,76,10.4,0,0,0.5,58,-0.00,17.7
2014-02-14 01:00:00,0.00,2.6,4.9,9.4,6.6,5.8,0,246,0.8,1.8,15.6,9.4,246,245,1.9,2.5,0.0,9.4,0.0,0,246,0.00,0.00,22,28,267,26,25,26,0.00,17.9,80,9.1,0,0,0.5,59,-0.02,17.7
2014-02-14 02:00:00,0.00,2.6,4.9,9.4,6.5,5.8,0,246,0.7,1.7,15.6,9.4,246,245,1.9,2.5,0.0,9.4,0.0,0,246,0.00,0.00,23,29,264,27,26,27,0.00,17.7,81,8.8,0,0,0.5,61,-0.04,17.7
2014-02-14 03:00:00,0.00,2.6,4.8,9.3,6.5,5.7,0,245,0.8,1.7,15.5,9.3,245,245,1.9,2.5,0.0,9.3,0.0,0,245,0.00,0.00,23,29,265,27,26,26,0.00,17.7,82,8.6,0,0,0.6,63,-0.10,17.7
2014-02-14 04:00:00,0.00,2.6,4.8,9.3,6.5,5.7,0,245,0.8,1.7,15.4,9.3,245,245,1.9,2.5,0.0,9.3,0.0,0,245,0.00,0.00,23,29,267,27,26,27,0.00,17.8,83,8.4,0,0,0.6,65,-0.11,17.7
2014-02-14 05:00:00,0.00,2.6,4.8,9.3,6.5,5.7,0,245,0.8,1.7,15.4,9.3,245,245,1.9,2.4,0.0,9.3,0.0,0,245,0.00,0.00,23,29,268,27,26,27,0.00,17.7,83,8.3,0,0,0.6,65,-0.09,17.7
2014-02-14 06:00:00,0.00,2.6,4.8,9.2,6.4,5.7,0,244,0.8,1.7,15.2,9.2,244,245,1.9,2.4,0.0,9.2,0.0,0,244,0.00,0.00,25,32,269,28,27,28,0.00,18.1,77,10.2,0,0,0.6,61,-0.09,17.7
2014-02-14 07:00:00,0.00,2.7,5.0,8.8,6.4,5.7,0,246,0.8,1.7,15.4,8.8,246,245,2.1,2.6,0.0,8.8,0.0,0,246,0.00,0.00,26,33,263,30,29,30,0.00,17.9,79,9.4,0,0,0.6,58,-0.02,17.6
2014-02-14 08:00:00,0.00,2.8,5.2,7.5,6.3,5.6,0,248,0.8,1.7,15.4,0.0,247,245,2.2,2.7,7.4,7.5,0.0,248,248,0.00,0.00,26,33,257,31,29,30,0.00,17.7,81,8.9,0,0,0.6,58,0.03,17.6
2014-02-14 09:00:00,0.00,2.9,5.3,7.4,6.3,5.6,0,247,0.8,1.7,15.3,0.0,246,245,2.3,2.8,7.3,7.4,0.0,247,247,0.00,0.00,26,33,254,31,29,30,0.00,17.7,82,8.6,0,0,0.6,55,0.09,17.6
2014-02-14 10:00:00,0.00,2.8,5.3,7.4,6.3,5.6,0,247,0.9,1.7,14.9,0.0,246,245,2.3,2.7,7.3,7.4,0.0,247,247,0.00,0.00,25,31,252,29,28,29,0.00,17.7,83,8.4,0,0,0.6,54,0.10,17.6
2014-02-14 11:00:00,0.00,2.8,5.2,7.4,6.2,5.6,0,246,1.0,1.7,14.7,0.0,245,245,2.3,2.6,7.3,7.4,0.0,246,246,0.00,0.00,23,29,253,27,26,27,0.00,17.7,83,8.5,0,0,0.5,51,0.08,17.6
2014-02-14 12:00:00,0.00,2.8,5.1,7.4,6.2,5.6,0,245,0.8,1.6,14.6,0.0,244,245,2.2,2.6,7.4,7.4,0.0,245,245,0.00,0.00,21,27,258,24,23,23,0.00,18.1,75,10.6,0,0,0.5,47,0.03,17.6
2014-02-14 13:00:00,0.00,2.7,5.0,7.5,6.2,5.5,0,245,0.9,1.6,14.5,0.0,244,245,2.1,2.5,7.4,7.5,0.0,245,245,0.00,0.00,20,25,256,23,22,23,0.00,17.8,78,9.7,0,0,0.4,40,0.00,17.6
2014-02-14 14:00:00,0.00,2.5,4.7,7.5,6.2,5.5,0,244,0.9,1.5,14.3,0.0,244,242,2.0,2.4,7.4,7.5,0.0,244,244,0.00,0.00,20,25,255,23,22,23,0.00,17.8,79,9.5,87,8185,0.4,37,-0.02,17.5
2014-02-14 15:00:00,0.00,2.4,4.5,7.6,6.2,5.5,0,244,0.9,1.5,14.2,0.0,243,242,1.9,2.2,7.5,7.6,0.0,244,244,0.00,0.00,19,24,255,22,21,22,0.00,17.6,80,9.2,100,7437,0.3,35,-0.03,17.5
2014-02-14 16:00:00,0.00,2.3,4.3,7.6,6.2,5.5,0,244,0.9,1.4,14.1,0.0,243,242,1.8,2.1,7.5,7.6,0.0,244,244,0.00,0.00,19,23,256,21,21,21,0.00,17.5,80,9.1,100,7018,0.3,38,-0.06,17.5
2014-02-14 17:00:00,0.00,2.2,4.1,7.9,6.2,5.5,0,242,0.9,1.4,13.7,8.2,242,242,1.7,2.0,0.0,7.9,0.0,0,242,0.00,0.00,17,22,258,20,19,20,0.00,17.5,81,8.8,36,8381,0.2,45,-0.04,17.5
2014-02-14 18:00:00,0.00,2.1,3.9,13.8,6.3,5.5,0,242,0.9,1.3,13.8,13.8,242,242,1.6,1.9,0.0,8.4,0.0,0,243,0.00,0.00,17,20,275,18,17,18,0.00,17.7,75,10.9,0,0,0.2,54,-0.05,17.5
2014-02-14 19:00:00,0.00,2.0,3.8,13.7,6.2,5.4,0,242,0.9,1.3,13.7,13.7,242,242,1.6,1.8,0.0,8.8,0.0,0,242,0.00,0.00,18,22,273,20,19,20,0.00,17.5,78,9.7,11,0,0.2,66,0.02,17.5
2014-02-14 20:00:00,0.00,2.0,3.7,13.6,6.2,5.4,0,242,1.0,1.3,13.6,13.6,242,242,1.5,1.7,0.0,8.8,0.0,0,242,0.00,0.00,18,22,270,21,20,20,0.00,17.5,79,9.5,11,0,0.2,76,0.04,17.5
2014-02-14 21:00:00,0.00,1.9,3.6,13.6,6.2,5.3,0,242,1.0,1.3,13.6,13.6,242,242,1.5,1.6,0.0,8.8,0.0,0,242,0.00,0.00,17,21,268,19,19,19,0.00,17.4,80,9.2,0,0,0.2,81,0.11,17.6
2014-02-14 22:00:00,0.00,1.9,3.5,13.6,6.2,5.3,0,242,0.9,1.2,13.6,13.6,242,242,1.4,1.6,0.0,9.0,0.0,0,241,0.00,0.00,16,19,267,18,17,18,0.00,17.4,80,9.2,0,0,0.3,81,0.10,17.7
2014-02-14 23:00:00,0.00,1.8,3.4,13.5,6.1,5.3,0,242,0.9,1.2,13.5,13.5,242,242,1.4,1.6,0.0,9.1,0.0,0,241,0.00,0.00,16,19,265,18,17,17,0.00,17.4,81,8.9,0,0,0.4,80,0.09,17.8
2014-02-15 00:00:00,0.00,1.8,3.3,13.5,6.2,5.3,0,242,0.9,1.2,13.5,13.5,242,242,1.3,1.5,0.0,9.0,0.0,0,242,0.00,0.00,15,18,286,16,15,16,0.00,17.8,77,10.1,0,0,0.5,77,0.05,17.8
2014-02-15 01:00:00,0.00,1.7,3.2,13.4,6.2,5.3,0,242,1.7,1.2,13.4,13.4,242,242,1.3,0.0,0.0,0.0,0.0,0,0,0.00,0.00,15,19,287,18,17,17,0.00,17.8,79,9.5,0,0,0.5,74,0.02,17.9
2014-02-15 02:00:00,0.00,1.7,3.1,13.4,6.3,5.3,0,242,1.7,1.1,13.4,13.4,242,242,1.2,0.0,0.0,0.0,0.0,0,0,0.00,0.00,15,19,285,18,17,17,0.00,17.8,80,9.3,0,0,0.6,72,-0.03,18.0
2014-02-15 03:00:00,0.00,1.6,3.1,13.4,6.3,5.3,0,242,1.0,1.1,13.4,13.4,242,242,1.2,1.3,0.0,8.8,0.0,0,242,0.00,0.00,15,18,286,17,16,16,0.00,17.7,80,9.1,0,0,0.6,74,-0.06,17.8
2014-02-15 04:00:00,0.00,1.6,3.0,13.3,6.3,5.3,0,242,1.0,1.1,13.3,13.3,242,242,1.2,1.3,0.0,8.8,0.0,0,242,0.00,0.00,14,17,284,16,15,16,0.00,17.7,81,9.0,0,0,0.6,68,-0.08,17.8
2014-02-15 05:00:00,0.00,1.6,3.0,13.3,6.2,5.3,0,242,1.6,1.1,13.3,13.3,242,242,1.2,0.0,0.0,0.0,0.0,0,0,0.00,0.00,14,17,283,15,15,15,0.00,17.7,81,8.9,0,0,0.6,61,-0.10,17.8
2014-02-15 06:00:00,0.00,1.6,2.9,13.3,6.3,5.3,0,242,1.6,1.1,13.3,13.3,242,242,1.2,0.0,0.0,0.0,0.0,0,0,0.00,0.00,13,15,282,14,13,13,0.00,17.7,76,10.3,0,0,0.5,54,-0.08,17.8
2014-02-15 07:00:00,0.00,1.6,2.9,13.2,6.3,5.3,0,242,1.6,1.1,13.2,13.2,242,242,1.1,0.0,0.0,0.0,0.0,0,0,0.00,0.00,13,15,281,14,14,14,0.00,17.6,79,9.4,0,0,0.5,48,0.00,17.7
2014-02-15 08:00:00,0.00,1.5,2.9,13.2,6.3,5.3,0,242,1.5,1.1,13.2,13.2,242,242,1.1,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,15,282,14,13,13,0.00,17.5,81,9.0,0,0,0.4,44,0.04,17.7
2014-02-15 09:00:00,0.00,1.5,2.8,13.1,6.3,5.3,0,242,1.5,1.0,13.1,13.1,242,242,1.1,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,14,284,13,13,13,0.00,17.4,81,8.9,0,0,0.4,41,0.09,17.6
2014-02-15 10:00:00,0.00,1.5,2.8,13.1,6.4,5.4,0,242,1.5,1.0,13.1,13.1,242,242,1.1,0.0,0.0,0.0,0.0,0,0,0.00,0.00,11,13,287,12,12,12,0.00,17.3,81,8.9,0,0,0.3,38,0.09,17.6
2014-02-15 11:00:00,0.00,1.5,2.7,13.0,6.4,5.4,0,242,1.5,1.0,13.0,13.0,242,242,1.0,0.0,0.0,0.0,0.0,0,0,0.00,0.00,10,12,295,11,11,11,0.00,17.3,81,9.0,0,0,0.3,35,0.07,17.6
2014-02-15 12:00:00,0.00,1.4,2.7,13.0,6.5,5.5,0,242,1.4,1.0,13.0,13.0,242,242,1.0,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,14,292,12,12,12,0.00,17.4,79,9.5,0,0,0.2,32,0.05,17.6
2014-02-15 13:00:00,0.00,1.4,2.6,12.9,6.5,5.4,0,242,1.4,1.0,12.9,12.9,242,242,1.0,0.0,0.0,0.0,0.0,0,0,0.00,0.00,11,13,290,12,12,12,0.00,17.2,82,8.7,0,0,0.2,34,0.03,17.6
2014-02-15 14:00:00,0.00,1.4,2.6,12.8,6.5,5.4,0,242,1.4,1.0,12.8,12.8,242,242,1.0,0.0,0.0,0.0,0.0,0,0,0.00,0.00,10,12,293,11,11,11,0.00,17.1,83,8.5,0,0,0.1,49,-0.03,17.5
2014-02-15 15:00:00,0.00,1.4,2.5,12.8,6.6,5.5,0,242,1.4,1.0,12.8,12.8,242,242,0.9,0.0,0.0,0.0,0.0,0,0,0.00,0.00,9,11,294,10,10,10,0.00,17.1,83,8.3,0,0,0.1,73,-0.03,17.5
2014-02-15 16:00:00,0.00,1.3,2.5,12.8,6.7,5.6,0,242,1.3,1.0,12.8,12.8,242,242,0.9,0.0,0.0,0.0,0.0,0,0,0.00,0.00,8,10,294,9,8,8,0.00,17.1,84,8.2,0,0,0.1,98,-0.06,17.5
2014-02-15 17:00:00,0.00,1.3,2.5,12.7,6.9,5.7,0,240,1.3,1.0,12.7,12.7,240,240,0.9,0.0,0.0,0.0,0.0,0,0,0.00,0.00,7,8,299,7,7,7,0.00,17.0,84,8.2,0,0,0.1,111,-0.05,17.5
2014-02-15 18:00:00,0.00,1.3,2.4,12.7,7.1,5.9,0,240,1.3,1.0,12.8,12.7,240,242,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,5,6,308,5,5,5,0.00,16.8,76,10.4,0,0,0.1,113,-0.05,17.5
2014-02-15 19:00:00,0.00,1.3,2.4,12.8,7.2,5.9,0,243,1.3,1.0,12.8,12.8,243,242,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,5,5,312,5,5,5,0.00,16.7,79,9.5,0,0,0.2,110,-0.00,17.5
2014-02-15 20:00:00,0.00,1.3,2.4,12.9,7.3,5.9,0,243,1.3,1.0,13.0,12.9,243,242,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,4,5,317,4,4,4,0.00,16.8,78,9.7,32,0,0.2,107,0.04,17.5
2014-02-15 21:00:00,0.00,1.3,2.4,13.1,7.5,6.1,0,242,1.3,1.1,13.1,13.1,242,242,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,3,4,328,4,4,4,0.00,16.8,78,9.7,0,0,0.3,104,0.08,17.6
2014-02-15 22:00:00,0.00,1.3,2.5,13.7,7.8,6.3,0,243,1.3,1.1,13.7,13.7,243,242,0.8,0.0,0.0,0.0,0.0,0,0,0.00,0.00,3,3,338,3,3,3,0.00,16.9,78,9.9,0,0,0.3,100,0.13,17.8
2014-02-15 23:00:00,0.00,1.3,2.5,14.5,8.1,6.6,0,245,1.3,1.1,14.5,14.5,245,245,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,2,2,14,2,2,2,0.00,16.9,78,9.9,0,0,0.4,93,0.12,18.0
2014-02-16 00:00:00,0.00,1.3,2.5,14.9,8.6,7.2,0,245,1.3,1.2,14.9,14.9,245,245,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,2,2,48,2,2,2,0.00,16.9,78,9.9,0,0,0.4,85,0.08,18.3
2014-02-16 01:00:00,0.00,1.4,2.6,14.9,8.9,7.4,0,245,1.4,1.2,14.9,14.9,245,245,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,3,4,68,3,3,3,0.00,17.0,79,9.6,0,0,0.5,76,0.03,18.8
2014-02-16 02:00:00,0.00,1.4,2.6,14.9,9.1,7.6,0,245,1.4,1.2,15.0,14.9,245,245,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,2,2,68,2,2,2,0.00,17.1,79,9.5,0,0,0.5,66,-0.03,19.1
2014-02-16 03:00:00,0.00,1.4,2.7,15.0,9.5,7.9,0,245,1.4,1.3,15.0,15.0,245,245,0.7,0.0,0.0,0.0,0.0,0,0,0.00,0.00,1,1,136,1,1,1,0.00,17.1,79,9.4,0,0,0.5,54,-0.07,19.4
2014-02-16 04:00:00,0.00,1.5,2.7,15.0,9.7,8.1,0,245,1.5,1.3,15.0,15.0,245,245,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,2,2,235,2,2,2,0.00,17.2,79,9.3,0,0,0.5,42,-0.09,19.6
2014-02-16 05:00:00,0.00,1.5,2.8,14.9,10.0,8.4,0,245,1.5,1.3,14.9,14.9,245,245,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,4,4,243,4,4,4,0.00,17.3,79,9.4,0,0,0.5,30,-0.08,19.7
2014-02-16 06:00:00,0.00,1.5,2.8,14.9,10.4,9.1,0,245,1.5,1.4,14.9,14.9,245,245,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,3,4,215,4,4,4,0.00,17.3,79,9.4,0,0,0.4,19,-0.06,19.5
2014-02-16 07:00:00,0.00,1.5,2.9,14.9,10.6,9.2,0,245,1.5,1.4,14.9,14.9,245,245,0.6,0.1,0.0,1.9,0.0,0,261,0.00,0.00,5,6,209,6,6,6,0.00,17.4,79,9.4,0,0,0.4,7,-0.02,19.2
2014-02-16 08:00:00,0.00,1.6,2.9,14.8,10.8,9.4,0,245,1.6,1.4,14.8,14.8,245,245,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,6,7,202,7,7,7,0.00,17.5,80,9.3,0,0,0.4,354,-0.01,18.9
2014-02-16 09:00:00,0.00,1.6,2.9,14.7,10.9,9.6,0,245,1.6,1.5,14.7,14.7,245,245,0.6,0.1,0.0,0.0,0.0,0,215,0.00,0.00,5,6,197,6,6,6,0.00,17.5,80,9.3,0,0,0.3,340,0.07,18.7
2014-02-16 10:00:00,0.00,1.6,3.0,14.7,11.0,9.7,0,245,1.6,1.5,14.7,14.7,245,245,0.6,0.1,0.0,0.0,0.0,0,225,0.00,0.00,4,5,174,4,4,4,0.00,17.7,79,9.5,5,0,0.3,322,0.11,18.6
2014-02-16 11:00:00,0.00,1.6,3.0,14.6,11.1,9.8,0,245,1.6,1.5,14.6,14.6,245,245,0.6,0.0,0.0,0.0,0.0,0,0,0.00,0.00,6,7,121,7,7,7,0.00,17.8,80,9.2,0,0,0.2,300,0.10,18.4
2014-02-16 12:00:00,0.00,1.6,3.0,14.5,11.4,10.4,0,245,1.6,1.5,14.5,14.5,245,245,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,5,6,97,5,5,5,0.00,17.9,81,9.0,13,1811,0.2,272,0.10,18.4
2014-02-16 13:00:00,0.00,1.6,3.0,14.3,11.4,10.5,0,242,1.6,1.5,14.3,14.3,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,4,5,88,4,4,4,0.00,18.0,80,9.1,39,1812,0.2,240,0.01,18.3
2014-02-16 14:00:00,0.00,1.6,3.1,14.2,11.4,10.5,0,242,1.6,1.6,14.2,14.2,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,6,7,76,7,7,7,0.00,18.1,82,8.8,0,0,0.2,212,0.01,18.2
2014-02-16 15:00:00,0.00,1.7,3.1,14.0,11.4,10.6,0,242,1.7,1.6,14.0,14.0,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,11,13,66,12,12,12,0.00,18.1,84,8.2,0,0,0.2,195,-0.06,18.1
2014-02-16 16:00:00,0.00,1.7,3.1,13.9,11.4,10.6,0,242,1.7,1.6,13.9,13.9,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,15,58,14,14,14,0.00,18.3,86,7.7,0,0,0.2,181,-0.08,18.0
2014-02-16 17:00:00,0.00,1.7,3.1,13.8,11.4,10.5,0,242,1.7,1.6,13.8,13.8,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,12,15,33,14,13,14,0.00,18.5,82,8.7,0,0,0.3,165,-0.05,17.9
2014-02-16 18:00:00,0.00,1.6,3.1,13.7,11.4,10.6,0,242,1.6,1.6,13.7,13.7,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,13,16,19,15,15,15,0.00,18.3,84,8.2,0,0,0.3,152,-0.05,17.8
2014-02-16 19:00:00,0.00,1.6,3.0,13.6,11.3,10.6,0,242,1.6,1.6,13.6,13.6,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,15,18,15,17,16,17,0.00,18.3,85,7.8,0,0,0.3,141,-0.01,17.8
2014-02-16 20:00:00,0.00,1.6,3.0,13.6,11.3,10.6,0,242,1.6,1.5,13.6,13.6,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,15,18,14,17,16,16,0.00,18.1,86,7.5,0,0,0.3,132,0.02,17.8
2014-02-16 21:00:00,0.00,1.6,3.0,13.5,11.3,10.5,0,242,1.6,1.5,13.5,13.5,242,242,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,14,17,11,16,16,16,0.00,18.1,88,7.2,0,0,0.4,127,0.09,17.8
2014-02-16 22:00:00,0.00,1.6,3.0,13.4,11.2,10.5,0,243,1.6,1.5,13.4,13.4,243,243,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,15,18,11,16,16,16,0.00,18.0,89,7.0,0,0,0.4,122,0.13,17.9
2014-02-16 23:00:00,0.00,1.6,2.9,13.4,11.1,10.4,0,243,1.6,1.5,13.4,13.4,243,243,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,14,17,11,16,16,16,0.00,18.1,88,7.2,0,0,0.4,120,0.14,18.0
2014-02-17 00:00:00,0.00,1.6,2.9,13.4,11.1,10.4,0,243,1.6,1.5,13.4,13.4,243,243,0.5,0.0,0.0,0.0,0.0,0,0,0.00,0.00,14,18,11,16,16,16,0.00,18.1,87,7.3,0,0,0.4,117,0.12,18.1
2014-02-17 01:00:00,0.00,1.5,2.9,13.3,11.0,10.3,0,243,1.5,1.5,13.3,13.3,243,243,0.5,0.0,0.0,1.9,0.0,0,305,0.00,0.00,14,17,359,16,16,16,0.00,18.2,87,7.3,0,0,0.4,115,0.05,18.2
2014-02-17 02:00:00,0.00,1.5,2.8,13.2,10.9,10.2,0,243,1.5,1.4,13.2,13.2,243,243,0.5,0.0,0.0,1.9,0.0,0,310,0.00,0.00,12,15,347,14,13,13,0.00,18.2,88,7.1,0,0,0.4,111,0.03,18.2
2014-02-17 03:00:00,0.00,1.5,2.8,13.2,10.8,10.0,0,243,1.5,1.4,13.2,13.2,243,243,0.5,0.0,0.0,1.9,0.0,0,310,0.00,0.00,12,15,348,14,13,14,0.00,18.3,89,7.0,0,0,0.4,106,-0.04,18.2
2014-02-17 04:00:00,0.00,1.5,2.8,13.1,10.5,9.4,0,243,1.5,1.4,13.1,13.1,243,243,0.5,0.1,0.0,2.5,0.0,0,293,0.00,0.00,12,14,341,16,14,15,0.00,18.5,88,7.2,41,0,0.4,100,-0.07,18.2
2014-02-17 05:00:00,0.00,1.5,2.7,13.1,10.0,8.6,0,244,1.5,1.4,13.1,13.1,244,244,0.5,0.2,0.0,2.5,0.0,0,296,0.00,0.00,11,14,337,16,13,15,0.00,18.7,87,7.4,27,10157,0.4,94,-0.05,18.2
2014-02-17 06:00:00,0.00,1.5,2.7,13.0,9.3,7.7,0,244,1.4,1.3,13.0,13.0,244,244,0.6,0.3,0.0,2.6,0.0,0,294,0.00,0.00,12,15,340,15,14,15,0.00,19.1,84,8.0,25,0,0.4,85,-0.08,18.2
2014-02-17 07:00:00,0.00,1.4,2.7,12.9,8.9,7.2,0,244,1.4,1.3,12.9,12.9,244,244,0.6,0.4,0.0,2.7,0.0,0,296,0.00,0.00,9,11,328,11,10,11,0.00,18.9,87,7.4,0,0,0.4,74,-0.04,18.1
2014-02-17 08:00:00,0.00,1.4,2.7,12.8,8.6,6.9,0,245,1.4,1.3,12.8,12.8,245,245,0.6,0.4,0.0,2.7,0.0,0,298,0.00,0.00,6,7,350,7,7,7,0.00,18.8,89,7.0,0,0,0.3,61,0.00,18.1
2014-02-17 09:00:00,0.00,1.4,2.6,12.7,8.4,6.7,0,244,1.4,1.3,12.7,12.7,244,244,0.6,0.4,0.0,2.8,0.0,0,301,0.00,0.00,7,9,40,9,8,8,0.00,18.7,91,6.5,0,0,0.3,48,0.08,18.1
2014-02-17 10:00:00,0.00,1.4,2.6,12.4,8.3,6.7,0,244,1.3,1.2,12.4,12.4,244,244,0.6,0.4,0.0,3.0,0.0,0,292,0.00,0.00,10,12,49,13,12,12,0.00,18.6,93,6.2,81,10494,0.2,36,0.12,18.1
2014-02-17 11:00:00,0.00,1.4,2.5,12.2,8.3,6.7,0,245,1.3,1.2,12.2,12.2,245,245,0.6,0.4,0.0,3.1,0.0,0,296,0.00,0.00,10,12,53,13,11,12,0.00,18.6,92,6.4,100,9691,0.1,12,0.15,18.0
2014-02-17 12:00:00,0.00,1.3,2.5,12.1,8.4,6.8,0,246,1.3,1.2,12.1,12.1,246,246,0.6,0.4,0.0,3.1,0.0,0,298,0.00,0.00,9,11,44,12,11,12,0.00,18.8,89,7.0,100,9891,0.1,327,0.13,18.0
2014-02-17 13:00:00,0.00,1.3,2.5,11.9,8.3,6.8,0,247,1.3,1.2,11.9,11.9,247,247,0.6,0.4,0.0,3.0,0.0,0,300,0.00,0.00,11,18,23,15,13,14,0.00,18.9,87,7.3,100,10004,0.1,253,0.07,18.0
2014-02-17 14:00:00,0.00,1.3,2.4,11.8,8.1,6.7,0,248,1.2,1.1,11.8,11.8,248,248,0.6,0.4,0.0,3.0,0.0,0,303,0.00,0.00,17,24,17,21,19,20,0.00,18.9,88,7.1,100,9626,0.2,203,0.02,18.0
2014-02-17 15:00:00,0.00,1.3,2.4,11.7,7.9,6.5,0,248,1.2,1.1,11.8,11.7,248,248,0.7,0.3,0.0,2.8,0.0,0,342,0.00,0.00,17,22,15,22,20,21,0.00,18.6,92,6.4,100,9446,0.3,183,-0.02,18.0
2014-02-17 16:00:00,0.00,1.3,2.4,11.6,7.3,5.9,0,250,1.2,1.1,11.6,11.6,250,249,0.7,0.4,0.0,3.0,0.0,0,339,0.00,0.00,18,22,14,21,20,20,0.00,18.4,93,6.1,100,9829,0.4,169,-0.03,18.0
2014-02-17 17:00:00,0.00,1.3,2.5,11.5,6.6,5.4,0,251,1.2,1.1,11.5,11.5,251,251,0.8,0.6,0.0,3.3,0.0,0,341,0.00,0.00,17,21,13,20,19,20,0.00,18.3,94,6.0,100,9989,0.4,158,-0.02,18.0
2014-02-17 18:00:00,0.00,1.4,2.5,11.5,6.2,5.1,0,251,1.0,1.0,11.8,11.5,251,249,0.9,0.7,0.0,3.6,0.0,0,349,0.00,0.00,17,21,10,19,19,19,0.00,18.4,93,6.1,96,9952,0.4,147,-0.01,17.9
2014-02-17 19:00:00,0.00,1.4,2.6,11.3,5.9,5.0,0,253,0.9,1.0,11.9,11.3,253,247,1.0,0.7,0.0,3.8,0.0,0,350,0.00,0.00,16,20,7,19,18,19,0.00,18.4,93,6.1,100,10017,0.5,138,0.01,17.9
2014-02-17 20:00:00,0.00,1.4,2.6,11.1,5.7,4.9,0,261,0.9,1.0,11.7,11.1,261,247,1.0,0.8,0.0,4.0,0.0,0,356,0.00,0.00,17,21,5,20,19,19,0.00,18.4,93,6.1,100,9869,0.5,131,0.01,17.9
2014-02-17 21:00:00,0.00,1.4,2.7,11.3,5.7,4.9,0,255,0.8,1.0,9.3,11.3,255,281,1.1,0.8,0.0,4.3,0.0,0,357,0.00,0.00,18,22,5,21,20,21,0.00,18.3,93,6.1,88,11405,0.5,124,0.08,17.9
2014-02-17 22:00:00,0.00,1.4,2.7,11.2,5.7,4.9,0,265,0.9,0.9,9.3,11.2,265,281,1.1,0.8,0.0,4.4,0.0,0,357,0.00,0.00,18,22,7,21,20,20,0.00,18.4,92,6.3,87,10051,0.5,119,0.12,17.9
2014-02-17 23:00:00,0.00,1.4,2.7,11.0,5.6,4.9,0,266,0.9,0.9,10.3,11.0,266,279,1.1,0.8,0.0,4.5,0.0,0,0,0.00,0.00,16,20,4,20,19,20,0.00,18.5,92,6.3,100,9803,0.5,113,0.14,18.0
2014-02-18 00:00:00,0.00,1.4,2.7,11.3,5.7,4.9,0,268,1.0,0.9,10.2,11.3,268,276,1.1,0.8,0.0,4.6,0.0,0,4,0.00,0.00,13,16,354,16,15,16,0.00,18.5,93,6.2,100,6327,0.6,108,0.14,18.1
2014-02-18 01:00:00,0.00,1.4,2.7,11.1,5.7,4.9,0,269,1.0,0.9,10.2,11.1,269,279,1.1,0.8,0.0,4.6,0.0,0,4,0.00,0.00,13,16,330,15,14,15,0.00,19.0,93,6.2,96,5253,0.6,102,0.10,18.2
2014-02-18 02:00:00,0.00,1.4,2.7,11.1,5.7,4.9,0,270,1.0,0.9,10.2,11.1,270,280,1.1,0.7,0.0,4.7,0.0,0,5,0.00,0.00,13,16,323,15,13,14,0.00,19.0,94,6.0,93,6668,0.6,96,0.05,18.3
2014-02-18 03:00:00,0.00,1.4,2.6,11.2,5.8,5.0,0,270,1.0,1.0,10.2,11.2,270,280,1.1,0.8,0.0,4.8,0.0,0,359,0.00,0.00,13,16,316,14,12,13,0.00,18.9,94,6.0,91,6084,0.6,89,0.00,18.3
2014-02-18 04:00:00,0.00,1.4,2.6,10.9,6.0,5.1,0,270,1.0,1.0,10.0,10.9,270,284,1.0,0.7,0.0,4.8,0.0,0,4,0.00,0.00,12,15,308,13,11,12,0.00,18.9,94,6.0,83,5955,0.5,80,-0.08,18.3
>
lev : Elevation
hs : Significant wave height
hx : Spectral estimate of maximum wave
tp : Peak Period
tm01 : Mean wave period
tm02 : Mean wave period
dp : Peak wave direction (from)
dpm : Mean direction at peak frequency (from)
hs_sw1 : Significant wave height of primary swell
hs_sw8 : Significant wave height of swell (> 8s)
tp_sw1 : Peak period of primary swell
tp_sw8 : Peak period of swell (> 8s)
dpm_sw8 : Mean direction at swell peak frequency (from)
dpm_sw1 : Mean direction of primary swell peak frequency
hs_sea8 : Significant wave height of sea (< 8s)
hs_sea : Significant wave height of wind sea
tp_sea8 : Peak period of sea (< 8s)
tp_sea : Peak period of wind sea
tm_sea : Mean period of wind sea
dpm_sea8 : Mean direction at sea peak frequency (from)
dpm_sea : Mean direction at wind sea peak frequency (from)
hs_ig : Infragravity significant wave height
hs_fig : Far infragravity wave height
wsp : Mean wind speed at 10 m
gst : Typical gust speed
wd : Wind direction (from)
wsp100 : Mean wind speed at 100 m
wsp50 : Mean wind speed at 50 m
wsp80 : Mean wind speed at 80 m
precip : Precipitation
tmp : Air temperature
rh : Relative humidity
vis : Visibility
cld : Cloud cover
cb : Cloud base
csp0 : Surface current speed
cd0 : Surface current direction (to)
ss : Storm surge elevation
sst : Sea surface temperature

Occasional waves may be larger than Hx.Occasional gusts may be up to 50% greater`

export default content
  .split('>')[0]
  .split('\n')
  .slice(1, -1)
  .map(line => {
    const items = line.split(',')
    const g = () => items.shift()

    return {
      time: new Date(`${g().replace(' ', 'T')}+13:00`).getTime() / 1000,
      lev: Number(g()),
      hs: Number(g()),
      hx: Number(g()),
      tp: Number(g()),
      tm01: Number(g()),
      tm02: Number(g()),
      dp: Number(g()),
      dpm: Number(deg2rad(g())),
      hs_sw1: Number(g()),
      hs_sw8: Number(g()),
      tp_sw1: Number(g()),
      tp_sw8: Number(g()),
      dpm_sw8: Number(g()),
      dpm_sw1: Number(g()),
      hs_sea8: Number(g()),
      hs_sea: Number(g()),
      tp_sea8: Number(g()),
      tp_sea: Number(g()),
      tm_sea: Number(g()),
      dpm_sea8: Number(g()),
      dpm_sea: Number(g()),
      hs_ig: Number(g()),
      hs_fig: Number(g()),
      wsp: Number(g()),
      gst: Number(g()),
      wd: Number(deg2rad(g())),
      wsp100: Number(g()),
      wsp50: Number(g()),
      wsp80: Number(g()),
      precip: Number(g()),
      tmp: Number(g()),
      rh: Number(g()),
      vis: Number(g()),
      cld: Number(g()),
      cb: Number(g()),
      csp0: Number(g()),
      cd0: Number(g()),
      ss: Number(g()),
      sst: Number(g())
    }
  })
