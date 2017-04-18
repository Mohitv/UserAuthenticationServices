# escape=`
FROM microsoft/nanoserver

# copy nodejs to nanoserver
RUN mkdir "C:\nodejs"
ADD ./nodejs/nodejs /nodejs

# set path
RUN powershell.exe -NoProfile -ExecutionPolicy Bypass -Command `
    $oldpath = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH).Path; `
    $newpath = 'C:\nodejs;'+$oldpath; `
    Set-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH -Value $newpath;

RUN mkdir "C:\App"
WORKDIR /App

# Install app dependencies
COPY package.json /App
RUN npm install

# Bundle app source
COPY . /App

EXPOSE 8081

CMD [ "npm.cmd", "run dev" ]
