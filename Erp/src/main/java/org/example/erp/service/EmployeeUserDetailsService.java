package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import org.example.erp.entity.Employee;
import org.example.erp.repository.EmployeeRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeUserDetailsService implements UserDetailsService {
    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found with email: " + username));

        return User.builder()
                .username(employee.getEmail())
                .password(employee.getPassword())
                .roles("USER") // 필요에 따라 역할 추가
                .build();
    }
}
