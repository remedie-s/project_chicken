package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Users;
import org.example.backend.repository.UsersRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpmallUserDetailsService implements UserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = usersRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        return User.builder()
                .username(users.getEmail())
                .password(users.getPassword())
                .roles("USER") // 필요에 따라 역할 추가
                .build();
    }
}
