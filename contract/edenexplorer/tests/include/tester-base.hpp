#include <eosio/tester.hpp>

#include <edenexplorer.hpp>

// Catch2 unit testing framework. https://github.com/catchorg/Catch2
#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

using namespace eosio;
using user_context = test_chain::user_context;

void edenexplorer_setup( test_chain &t ) {
  t.set_code( "edenexplorer"_n, "edenexplorer.wasm" );
}

struct tester {
  test_chain   chain;
  user_context edenexplorer = chain.as( "edenexplorer"_n );
  user_context isedenmember = chain.as( "isedenmember"_n );

  user_context alice = chain.as( "alice"_n );
  user_context bob = chain.as( "bob"_n );
  user_context pip = chain.as( "pip"_n );
  user_context egeon = chain.as( "egeon"_n );
  user_context bertie = chain.as( "bertie"_n );
  user_context ahab = chain.as( "ahab"_n );

  tester() {
    chain.create_code_account( "edenexplorer"_n );
    chain.create_code_account( "isedenmember"_n );
    edenexplorer_setup( chain );
    for ( auto account :
          { "alice"_n, "bob"_n, "pip"_n, "egeon"_n, "bertie"_n, "ahab"_n } ) {
      chain.create_account( account );
    }
  }
};
