#!/bin/bash
OPENWBBASEDIR=$(cd `dirname $0`/../../ && pwd)
RAMDISKDIR="${OPENWBBASEDIR}/ramdisk"
MODULEDIR=$(cd `dirname $0` && pwd)
#DMOD="EVU"
DMOD="MAIN"
Debug=$debug

#For development only
#Debug=1

if [ ${DMOD} == "MAIN" ]; then
	MYLOGFILE="${RAMDISKDIR}/openWB.log"
else
	MYLOGFILE="${RAMDISKDIR}/evu.log"
fi

python3 ${OPENWBBASEDIR}/packages/modules/fronius/device.py "counter_s0" "${wrfroniusip}" "${froniuserzeugung}" "${wrfroniusisgen24}" "${froniusvar2}" "${froniusprimo}" "${froniusmeterlocation}" "${wrfronius2ip}" "${speichermodul}" >>${MYLOGFILE} 2>&1
ret=$?

openwbDebugLog ${DMOD} 2 "EVU RET: ${ret}"

wattbezug=$(<${RAMDISKDIR}/wattbezug)
echo $wattbezug
