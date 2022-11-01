# Build edenexplorer.wasm contract
add_executable(edenexplorer src/edenexplorer.cpp)
target_include_directories(edenexplorer PUBLIC include)
target_link_libraries(edenexplorer eosio-contract-simple-malloc)
set_target_properties(edenexplorer PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR})

# Build edenexplorer-debug.wasm
# This is like edenexplorer.wasm, but includes debugging information.
add_executable(edenexplorer-debug src/edenexplorer.cpp)
target_include_directories(edenexplorer-debug PRIVATE include)
target_link_libraries(edenexplorer-debug eosio-contract-simple-malloc-debug)
set_target_properties(edenexplorer-debug PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR})

# Generate edenexplorer.abi
# This is a 2-step process:
# * Build edenexplorer.abi.wasm. This must link to eosio-contract-abigen.
# * Run the wasm to generate the abi
add_executable(edenexplorer-abigen src/edenexplorer.cpp)
target_include_directories(edenexplorer-abigen PRIVATE include)
target_link_libraries(edenexplorer-abigen eosio-contract-abigen)
add_custom_command(TARGET edenexplorer-abigen POST_BUILD
    COMMAND cltester edenexplorer-abigen.wasm >${PROJECT_BINARY_DIR}/edenexplorer.abi
)

# Builds tests.wasm
# Tests must link to either cltestlib (runs faster) or cltestlib-debug (supports debugging)
add_executable(tests tests/tests.cpp)
target_include_directories(tests PUBLIC include ./tests/include)
target_link_libraries(tests cltestlib-debug)
set_target_properties(tests PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR})

# These symlinks help vscode
execute_process(COMMAND ln -sf ${clsdk_DIR} ${CMAKE_CURRENT_BINARY_DIR}/clsdk)
execute_process(COMMAND ln -sf ${WASI_SDK_PREFIX} ${CMAKE_CURRENT_BINARY_DIR}/wasi-sdk)

# Generate compile_commands.json to aid vscode and other editors
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
