// cltester definitions
#include <tester-base.hpp>

#define CATCH_CONFIG_RUNNER

TEST_CASE( "Require to be an eden member" ) {
  tester t;

  expect( t.edenexplorer.trace< eden::actions::categorize >( "alice"_n,
                                                             "testing",
                                                             "testing",
                                                             "testing" ),
          "missing authority of alice" );
}

TEST_CASE( "Requiere the right memo format" ) {
  tester t;

  expect( t.edenexplorer.trace< eden::actions::categorize >( "edenexplorer"_n,
                                                             "testing",
                                                             "testing",
                                                             "testing" ),
          "assertion failure with message: Incorrect format or category, use: "
          "'eden_expense: <category>/<description>'" );
}

TEST_CASE( "Requiere a right category" ) {
  tester t;

  expect( t.edenexplorer.trace< eden::actions::categorize >(
              "edenexplorer"_n,
              "eden_expense: testing/expense for pay EOSIO developers",
              "testing",
              "testing" ),
          "assertion failure with message: Incorrect format or category, use: "
          "'eden_expense: <category>/<description>'" );
}

TEST_CASE( "Requiere the right length for tx_id" ) {
  tester t;

  expect( t.bob.trace< eden::actions::categorize >(
              "bob"_n,
              "eden_expense: development/expense for pay EOSIO developers",
              "testing",
              "testing" ),
          "assertion failure with message: Incorrect length transaction id" );
}

TEST_CASE( "Requiere the right length for digest" ) {
  tester t;

  expect(
      t.bob.trace< eden::actions::categorize >(
          "bob"_n,
          "eden_expense: development/expense for pay EOSIO developers",
          "96dda25da00b945e5b696a8a4b01453c97973c78dc766a885b73e28bd42f6cc5",
          "testing" ),
      "assertion failure with message: Incorrect length digest id" );
}

TEST_CASE( "Succes action" ) {
  tester t;

  expect( t.bob.trace< eden::actions::categorize >(
      "bob"_n,
      "eden_expense: infrastructure/expense for pay EOSIO developers",
      "96dda25da00b945e5b696a8a4b01453c97973c78dc766a885b73e28bd42f6cc5",
      "f3f57eaf6efe030d6af4c77818daec081e505fde4c2b15cfdad950f636400b8b" ) );
}
