# All cmake projects need these
cmake_minimum_required(VERSION 3.16)
project(edenexplorer)

# clsdk requires C++20
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Libraries for building contracts and tests
find_package(clsdk REQUIRED)

add_subdirectory(edenexplorer)