# Life Calendar server side

## How to run

### Production mode
```bash
sqlx migrate run
cargo b --release
./target/release/server
```

### Dev mode

run (dev)
```bash
sqlx migrate run
cargo r
```


If you are on windows, you need to preinstall openssl packages for winx64 before starting the server
### PREINSTALL
```cmd
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
.\bootstrap-vcpkg.bat
# here path to vcpkg
#setx VCPKG_ROOT "C:\path\to\vcpkg"
# then install pkgs
vcpkg integrate install
vcpkg install openssl:x64-windows
choco install openssl
# MSYS2
pacman -S mingw-w64-x86_64-openssl
pacman -S mingw-w64-ucrt-x86_64-gcc
```

### Run (dev) windows
```bash
sqlx migrate run
export OPENSSL_DIR="C:/Program Files/OpenSSL-Win64"
export OPENSSL_LIB_DIR="C:/Program Files/OpenSSL-Win64/lib/VC/x64/MD"
export OPENSSL_INCLUDE_DIR="C:/Program Files/OpenSSL-Win64/include"
export OPENSSL_STATIC="true"
cargo run
```