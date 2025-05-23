#ifndef CHECKER_HPP
#define CHECKER_HPP

#include <bits/stdc++.h>
#include <exception>
#include "../json.hpp"
#include "../fifo_map.hpp"

template<class K, class V, class dummy_compare, class A>
using fifo_map = nlohmann::fifo_map<K, V, nlohmann::fifo_map_compare<K>, A>;
using json = nlohmann::basic_json<fifo_map>;

#endif
