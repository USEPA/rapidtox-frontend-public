# add_env.sh - copy real env. vars. to .env file used by app.
#
# Brown.TerryN@epa.gov - Tue 23 Feb 2021 08:49:17 PM UTC

# "build" or "runtime"
TIMENAME="$1"
# collect vars. in ENV_FILE
ENV_FILE=/tmp/rapidtox_env_"$TIMENAME"
# base .env FILE
SRC_FILE=/rapidtox/.env 
# collect var. names found in .env and env. here
TMP_FILE=/tmp/tmp.rapidtox.env
echo -n >$TMP_FILE

# create / clear file for this kind (build/run) of vars.
echo "# $TIMENAME values from env. vars. $(date)" >$ENV_FILE
# drop lines starting with zero or more spaces followed by #
# drop blank lines
# split remaining lines at first space or = and capture first part
sed -rn '/^\s*#+/ d; /^\s*$/ d; s/[ =].*//; p' < $SRC_FILE \
    | sort -u \
    >> $TMP_FILE
# for each var. name in .env and env. write to ENV_FILE
for VAR in $(cat $TMP_FILE); do
    [ "${!VAR}" ] && echo "${VAR}=${!VAR}" >> $ENV_FILE
done
# append to base .env and display
cat $ENV_FILE >> $SRC_FILE
cat /tmp/rapidtox_env_*
